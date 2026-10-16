/**
 * 新加坡时区 (Asia/Singapore, UTC+8) 时间与日期工具函数
 */

export const SGT_TIMEZONE = 'Asia/Singapore';

/**
 * 获取当前新加坡时间对象
 */
export function getSingaporeNow(): Date {
  return new Date();
}

/**
 * 格式化当前日期为中文格式：例 "2026年10月16日"
 */
export function formatSingaporeDate(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: SGT_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formatter.format(date);
}

/**
 * 格式化当前星期：例 "星期五"
 */
export function formatSingaporeWeekday(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: SGT_TIMEZONE,
    weekday: 'long',
  });
  return formatter.format(date);
}

/**
 * 格式化当前时间为 24 小时制：例 "18:30:45"
 */
export function formatSingaporeTime(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: SGT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return formatter.format(date);
}

/**
 * 格式化时间戳为新加坡简短时间：例 "12:00"
 */
export function formatTimestampToHour(isoString: string): string {
  if (!isoString) return '--:--';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: SGT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return '--:--';
  }
}

/**
 * 格式化完整时间戳：例 "2026年10月16日 12:00"
 */
export function formatFullTimestamp(isoString: string): string {
  if (!isoString) return '暂无数据';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const datePart = new Intl.DateTimeFormat('zh-CN', {
      timeZone: SGT_TIMEZONE,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(d);
    const timePart = new Intl.DateTimeFormat('zh-CN', {
      timeZone: SGT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(d);
    return `${datePart} ${timePart}`;
  } catch {
    return isoString;
  }
}

/**
 * 判断数据是否已过期（超过 2 小时未更新）
 */
export function isTimestampStale(isoString: string, maxAgeMinutes: number = 120): boolean {
  if (!isoString) return true;
  try {
    const dataTime = new Date(isoString).getTime();
    if (isNaN(dataTime)) return true;
    const now = Date.now();
    const diffMinutes = (now - dataTime) / (1000 * 60);
    return diffMinutes > maxAgeMinutes;
  } catch {
    return true;
  }
}

/**
 * 计算相对时间描述：例 "刚刚"、"5分钟前"、"1小时前"
 */
export function getRelativeTimeText(isoString: string): string {
  if (!isoString) return '未获取';
  try {
    const past = new Date(isoString).getTime();
    if (isNaN(past)) return '未获取';
    const diffSec = Math.max(0, Math.floor((Date.now() - past) / 1000));
    if (diffSec < 45) return '刚刚';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`;
    return `${Math.floor(diffSec / 86400)} 天前`;
  } catch {
    return '未获取';
  }
}

/**
 * 获取当前新加坡日期对应 YYYY-MM-DD 字符串
 */
export function getSingaporeDateString(offsetDays: number = 0): string {
  const now = new Date();
  if (offsetDays !== 0) {
    now.setDate(now.getDate() + offsetDays);
  }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SGT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return parts; // en-CA gives YYYY-MM-DD
}
