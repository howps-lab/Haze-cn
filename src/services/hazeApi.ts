/**
 * 新加坡官方烟霾与空气质量数据服务
 * 数据源：新加坡国家环境局 (NEA) / Data.gov.sg 官方 API
 */

import {
  HazeDataSnapshot,
  HistoricalDataPoint,
  Pm25ApiResponse,
  PsiApiResponse,
  RegionKey,
  RegionalRecord,
} from '../types/haze';
import { getSingaporeDateString, isTimestampStale } from '../utils/dateUtils';
import {
  getPm25Band,
  getPsiBand,
  REGION_NAMES_EN,
  REGION_NAMES_ZH,
} from '../utils/hazeStandards';

const LOCAL_STORAGE_CACHE_KEY = 'sg_haze_monitoring_cache_v2';
const LOCAL_STORAGE_HISTORY_KEY = 'sg_haze_history_cache_v2';

const REGIONS: RegionKey[] = ['north', 'south', 'east', 'west', 'central'];

interface ApiFetchOptions {
  date?: string;
  dateTime?: string;
}

/**
 * 具有双重备选通道的官方 API 请求器
 * 通道 1: 本地反向代理 /api/gov/* (开发/服务端支持)
 * 通道 2: 直接请求官方 https://api.data.gov.sg/v1/environment/* (支持浏览器 CORS)
 */
async function fetchOfficialEndpoint<T>(
  endpoint: 'pm25' | 'psi',
  options?: ApiFetchOptions
): Promise<T> {
  const queryParams = new URLSearchParams();
  if (options?.date) queryParams.set('date', options.date);
  if (options?.dateTime) queryParams.set('date_time', options.dateTime);
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';

  // 尝试路径 1：本地代理路由
  const proxyUrl = `/api/gov/${endpoint}${queryStr}`;
  // 备用路径 2：官方公开全量地址
  const directUrl = `https://api.data.gov.sg/v1/environment/${endpoint}${queryStr}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const res = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
        return data as T;
      }
    }
  } catch {
    // 代理失败，转入备用直连通道
  }

  // 直连通道请求
  const directController = new AbortController();
  const directTimeoutId = setTimeout(() => directController.abort(), 8000);

  try {
    const res = await fetch(directUrl, {
      signal: directController.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(directTimeoutId);

    if (!res.ok) {
      throw new Error(`官方接口返回异常状态码: ${res.status}`);
    }

    const data = await res.json();
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('官方接口未返回有效数据项');
    }
    return data as T;
  } catch (err) {
    clearTimeout(directTimeoutId);
    throw err;
  }
}

/**
 * 获取最新实时数据快照
 */
export async function fetchLatestHazeSnapshot(): Promise<HazeDataSnapshot> {
  try {
    // 并行请求最新的 PM2.5 与 PSI 数据
    const [pm25Res, psiRes] = await Promise.all([
      fetchOfficialEndpoint<Pm25ApiResponse>('pm25'),
      fetchOfficialEndpoint<PsiApiResponse>('psi'),
    ]);

    const pm25LatestItem = pm25Res.items[pm25Res.items.length - 1];
    const psiLatestItem = psiRes.items[psiRes.items.length - 1];

    if (!pm25LatestItem || !psiLatestItem) {
      throw new Error('未获取到最新记录项');
    }

    const pm25Readings = pm25LatestItem.readings?.pm25_one_hourly || {};
    const psiReadings = psiLatestItem.readings?.psi_twenty_four_hourly || {};
    const pm10Readings = psiLatestItem.readings?.pm10_twenty_four_hourly || {};
    const o3Readings = psiLatestItem.readings?.o3_sub_index || {};
    const coReadings = psiLatestItem.readings?.co_sub_index || {};
    const so2Readings = psiLatestItem.readings?.so2_sub_index || {};
    const no2Readings = psiLatestItem.readings?.no2_one_hour_max || {};

    const regions: Record<RegionKey, RegionalRecord> = {} as Record<RegionKey, RegionalRecord>;

    let maxPm25 = -1;
    let maxPm25Region: RegionKey = 'central';

    let maxPsi = -1;
    let maxPsiRegion: RegionKey = 'central';

    for (const key of REGIONS) {
      const pm25Val = typeof pm25Readings[key] === 'number' ? pm25Readings[key] : null;
      const psiVal = typeof psiReadings[key] === 'number' ? psiReadings[key] : null;

      if (pm25Val !== null && pm25Val > maxPm25) {
        maxPm25 = pm25Val;
        maxPm25Region = key;
      }

      if (psiVal !== null && psiVal > maxPsi) {
        maxPsi = psiVal;
        maxPsiRegion = key;
      }

      regions[key] = {
        key,
        nameZh: REGION_NAMES_ZH[key],
        nameEn: REGION_NAMES_EN[key],
        pm25OneHourly: pm25Val,
        pm25Band: getPm25Band(pm25Val),
        psiTwentyFourHourly: psiVal,
        psiBand: getPsiBand(psiVal),
        pm10TwentyFourHourly: typeof pm10Readings[key] === 'number' ? pm10Readings[key] : null,
        o3SubIndex: typeof o3Readings[key] === 'number' ? o3Readings[key] : null,
        coSubIndex: typeof coReadings[key] === 'number' ? coReadings[key] : null,
        so2SubIndex: typeof so2Readings[key] === 'number' ? so2Readings[key] : null,
        no2OneHourMax: typeof no2Readings[key] === 'number' ? no2Readings[key] : null,
      };
    }

    const officialTimestamp = pm25LatestItem.timestamp || psiLatestItem.timestamp;
    const officialUpdateTimestamp =
      pm25LatestItem.update_timestamp || psiLatestItem.update_timestamp || officialTimestamp;

    const snapshot: HazeDataSnapshot = {
      timestamp: officialTimestamp,
      updateTimestamp: officialUpdateTimestamp,
      fetchTimestamp: new Date().toISOString(),
      isStale: isTimestampStale(officialTimestamp, 120),
      regions,
      peakPm25: {
        value: maxPm25 >= 0 ? maxPm25 : 0,
        regionKey: maxPm25Region,
        regionName: REGION_NAMES_ZH[maxPm25Region],
        band: getPm25Band(maxPm25 >= 0 ? maxPm25 : 0),
      },
      peakPsi: {
        value: maxPsi >= 0 ? maxPsi : 0,
        regionKey: maxPsiRegion,
        regionName: REGION_NAMES_ZH[maxPsiRegion],
        band: getPsiBand(maxPsi >= 0 ? maxPsi : 0),
      },
      overallStatus: {
        pm25Band: getPm25Band(maxPm25 >= 0 ? maxPm25 : 0),
        psiBand: getPsiBand(maxPsi >= 0 ? maxPsi : 0),
      },
    };

    // 保存至本地存储以供断网离线保留
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(snapshot));
    } catch {
      // 忽略存储失败
    }

    return snapshot;
  } catch (error) {
    // 尝试读取本地缓存数据，绝不无中生有
    const cached = getCachedHazeSnapshot();
    if (cached) {
      cached.isStale = true;
      return cached;
    }
    throw error;
  }
}

/**
 * 读取本地缓存的最新快照（离线保留）
 */
export function getCachedHazeSnapshot(): HazeDataSnapshot | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HazeDataSnapshot;
    parsed.isStale = isTimestampStale(parsed.timestamp, 120);
    return parsed;
  } catch {
    return null;
  }
}

/**
 * 获取官方连续历史数据（支持近 6小时、12小时、24小时、48小时）
 * 通过获取今天与昨天的官方数据集并合并排序
 */
export async function fetchHistoricalHazeData(): Promise<HistoricalDataPoint[]> {
  const todayStr = getSingaporeDateString(0);
  const yesterdayStr = getSingaporeDateString(-1);

  try {
    // 获取今天与昨天的 PM2.5 与 PSI 历史数据集
    const [todayPm25, yesterdayPm25, todayPsi, yesterdayPsi] = await Promise.allSettled([
      fetchOfficialEndpoint<Pm25ApiResponse>('pm25', { date: todayStr }),
      fetchOfficialEndpoint<Pm25ApiResponse>('pm25', { date: yesterdayStr }),
      fetchOfficialEndpoint<PsiApiResponse>('psi', { date: todayStr }),
      fetchOfficialEndpoint<PsiApiResponse>('psi', { date: yesterdayStr }),
    ]);

    const pm25Items = [
      ...(yesterdayPm25.status === 'fulfilled' ? yesterdayPm25.value.items : []),
      ...(todayPm25.status === 'fulfilled' ? todayPm25.value.items : []),
    ];

    const psiItems = [
      ...(yesterdayPsi.status === 'fulfilled' ? yesterdayPsi.value.items : []),
      ...(todayPsi.status === 'fulfilled' ? todayPsi.value.items : []),
    ];

    // 构建以时间为键的合并字典
    const timelineMap: Map<string, HistoricalDataPoint> = new Map();

    // 填充 PM2.5 数据
    for (const item of pm25Items) {
      if (!item.timestamp) continue;
      const iso = item.timestamp;
      const d = new Date(iso);
      if (isNaN(d.getTime())) continue;

      const hourStr = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(d);

      const monthDayStr = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Singapore',
        month: 'numeric',
        day: 'numeric',
      }).format(d);

      const r = item.readings?.pm25_one_hourly || {};

      timelineMap.set(iso, {
        time: hourStr,
        fullDateTime: `${monthDayStr} ${hourStr}`,
        timestamp: iso,
        central_pm25: typeof r.central === 'number' ? r.central : null,
        east_pm25: typeof r.east === 'number' ? r.east : null,
        north_pm25: typeof r.north === 'number' ? r.north : null,
        south_pm25: typeof r.south === 'number' ? r.south : null,
        west_pm25: typeof r.west === 'number' ? r.west : null,
        central_psi: null,
        east_psi: null,
        north_psi: null,
        south_psi: null,
        west_psi: null,
      });
    }

    // 填充并匹配 PSI 数据
    for (const item of psiItems) {
      if (!item.timestamp) continue;
      const iso = item.timestamp;
      const d = new Date(iso);
      if (isNaN(d.getTime())) continue;

      const hourStr = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(d);

      const monthDayStr = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Singapore',
        month: 'numeric',
        day: 'numeric',
      }).format(d);

      const psiReadings = item.readings?.psi_twenty_four_hourly || {};

      let entry = timelineMap.get(iso);
      if (!entry) {
        entry = {
          time: hourStr,
          fullDateTime: `${monthDayStr} ${hourStr}`,
          timestamp: iso,
          central_pm25: null,
          east_pm25: null,
          north_pm25: null,
          south_pm25: null,
          west_pm25: null,
          central_psi: null,
          east_psi: null,
          north_psi: null,
          south_psi: null,
          west_psi: null,
        };
        timelineMap.set(iso, entry);
      }

      entry.central_psi = typeof psiReadings.central === 'number' ? psiReadings.central : null;
      entry.east_psi = typeof psiReadings.east === 'number' ? psiReadings.east : null;
      entry.north_psi = typeof psiReadings.north === 'number' ? psiReadings.north : null;
      entry.south_psi = typeof psiReadings.south === 'number' ? psiReadings.south : null;
      entry.west_psi = typeof psiReadings.west === 'number' ? psiReadings.west : null;
    }

    // 按时间顺序升序排列
    const sorted = Array.from(timelineMap.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (sorted.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(sorted));
      } catch {
        // 忽略写入失败
      }
    }

    return sorted;
  } catch (err) {
    // 尝试读取历史缓存
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (cached) {
        return JSON.parse(cached) as HistoricalDataPoint[];
      }
    } catch {
      // 忽略
    }
    return [];
  }
}
