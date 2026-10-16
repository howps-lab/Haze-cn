/**
 * 新加坡烟霾监测数据类型定义
 */

export type RegionKey = 'north' | 'south' | 'east' | 'west' | 'central';

export interface RegionMetadata {
  name: string;
  label_location: {
    latitude: number;
    longitude: number;
  };
}

export interface PollutantReadings {
  pm10_twenty_four_hourly?: Record<string, number>;
  pm10_sub_index?: Record<string, number>;
  pm25_twenty_four_hourly?: Record<string, number>;
  pm25_sub_index?: Record<string, number>;
  psi_twenty_four_hourly?: Record<string, number>;
  o3_eight_hour_max?: Record<string, number>;
  o3_sub_index?: Record<string, number>;
  co_eight_hour_max?: Record<string, number>;
  co_sub_index?: Record<string, number>;
  so2_twenty_four_hourly?: Record<string, number>;
  so2_sub_index?: Record<string, number>;
  no2_one_hour_max?: Record<string, number>;
}

export interface PsiApiResponseItem {
  timestamp: string;
  update_timestamp: string;
  readings: PollutantReadings;
}

export interface PsiApiResponse {
  region_metadata: RegionMetadata[];
  items: PsiApiResponseItem[];
  api_info?: { status: string };
}

export interface Pm25ApiResponseItem {
  timestamp: string;
  update_timestamp: string;
  readings: {
    pm25_one_hourly: Record<string, number>;
  };
}

export interface Pm25ApiResponse {
  region_metadata: RegionMetadata[];
  items: Pm25ApiResponseItem[];
  api_info?: { status: string };
}

export type AirQualityBand = 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
export type Pm25Band = 'normal' | 'elevated' | 'high' | 'very_high';

export interface BandInfo {
  key: string;
  label: string;
  colorName: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  hex: string;
  description: string;
}

export interface RegionalRecord {
  key: RegionKey;
  nameZh: string;
  nameEn: string;
  pm25OneHourly: number | null;
  pm25Band: Pm25Band;
  psiTwentyFourHourly: number | null;
  psiBand: AirQualityBand;
  pm10TwentyFourHourly?: number | null;
  o3SubIndex?: number | null;
  coSubIndex?: number | null;
  so2SubIndex?: number | null;
  no2OneHourMax?: number | null;
}

export interface HazeDataSnapshot {
  timestamp: string; // 官方数据对应时间 (UTC+8)
  updateTimestamp: string; // 官方最后生成时间
  fetchTimestamp: string; // 本系统获取时间
  isStale: boolean;
  regions: Record<RegionKey, RegionalRecord>;
  peakPm25: {
    value: number;
    regionKey: RegionKey;
    regionName: string;
    band: Pm25Band;
  };
  peakPsi: {
    value: number;
    regionKey: RegionKey;
    regionName: string;
    band: AirQualityBand;
  };
  overallStatus: {
    pm25Band: Pm25Band;
    psiBand: AirQualityBand;
  };
}

export interface HistoricalDataPoint {
  time: string; // "14:00"
  fullDateTime: string; // "2026-10-16 14:00"
  timestamp: string; // ISO
  central_pm25: number | null;
  east_pm25: number | null;
  north_pm25: number | null;
  south_pm25: number | null;
  west_pm25: number | null;
  central_psi: number | null;
  east_psi: number | null;
  north_psi: number | null;
  south_psi: number | null;
  west_psi: number | null;
}
