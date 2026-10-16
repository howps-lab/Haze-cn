/**
 * 新加坡国家环境局 (NEA) 烟霾与空气质量分级标准及颜色代码
 */

import { AirQualityBand, BandInfo, Pm25Band, RegionKey } from '../types/haze';

export const REGION_NAMES_ZH: Record<RegionKey, string> = {
  north: '北部',
  south: '南部',
  east: '东部',
  west: '西部',
  central: '中部',
};

export const REGION_NAMES_EN: Record<RegionKey, string> = {
  north: 'North',
  south: 'South',
  east: 'East',
  west: 'West',
  central: 'Central',
};

export interface ReadingStyle {
  bgClass: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  textClass: string;
  colorName: string;
  hex: string;
}

/**
 * 1小时 PM2.5 颜色编码规则：
 * 0 – 55: Green 绿色
 * 56 – 150: Yellow 黄色
 * 151 – 250: Orange 橙色
 * 250 及以上: Red 红色
 */
export function getPm25ReadingStyle(value: number | null | undefined): ReadingStyle {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      bgClass: 'bg-slate-50 border border-slate-200',
      badgeClass: 'bg-slate-100 text-slate-700',
      dotClass: 'bg-slate-400',
      borderClass: 'border-slate-200',
      textClass: 'text-slate-700',
      colorName: '灰色',
      hex: '#94a3b8',
    };
  }

  // 0 – 55: Green
  if (value <= 55) {
    return {
      bgClass: 'bg-emerald-50/90 border border-emerald-200/90',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      dotClass: 'bg-emerald-500',
      borderClass: 'border-emerald-300',
      textClass: 'text-emerald-800',
      colorName: '绿色',
      hex: '#10b981',
    };
  }
  // 56 – 150: Yellow
  if (value <= 150) {
    return {
      bgClass: 'bg-amber-50/90 border border-amber-200/90',
      badgeClass: 'bg-amber-100 text-amber-900',
      dotClass: 'bg-amber-500',
      borderClass: 'border-amber-300',
      textClass: 'text-amber-800',
      colorName: '黄色',
      hex: '#f59e0b',
    };
  }
  // 151 – 250: Orange
  if (value <= 250) {
    return {
      bgClass: 'bg-orange-50/90 border border-orange-200/90',
      badgeClass: 'bg-orange-100 text-orange-900',
      dotClass: 'bg-orange-500',
      borderClass: 'border-orange-300',
      textClass: 'text-orange-800',
      colorName: '橙色',
      hex: '#f97316',
    };
  }
  // 250 及以上: Red
  return {
    bgClass: 'bg-rose-50/90 border border-rose-200/90',
    badgeClass: 'bg-rose-100 text-rose-900',
    dotClass: 'bg-rose-500',
    borderClass: 'border-rose-300',
    textClass: 'text-rose-800',
    colorName: '红色',
    hex: '#ef4444',
  };
}

/**
 * 24小时 PSI 颜色编码规则：
 * 0 – 50: Green 绿色
 * 51 – 100: Blue 蓝色
 * 101 – 200: Yellow 黄色
 * 201 – 300: Orange 橙色
 * 300 以上: Red 红色
 */
export function getPsiReadingStyle(value: number | null | undefined): ReadingStyle {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      bgClass: 'bg-slate-50 border border-slate-200',
      badgeClass: 'bg-slate-100 text-slate-700',
      dotClass: 'bg-slate-400',
      borderClass: 'border-slate-200',
      textClass: 'text-slate-700',
      colorName: '灰色',
      hex: '#94a3b8',
    };
  }

  // 0 – 50: Green
  if (value <= 50) {
    return {
      bgClass: 'bg-emerald-50/90 border border-emerald-200/90',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      dotClass: 'bg-emerald-500',
      borderClass: 'border-emerald-300',
      textClass: 'text-emerald-800',
      colorName: '绿色',
      hex: '#10b981',
    };
  }
  // 51 – 100: Blue
  if (value <= 100) {
    return {
      bgClass: 'bg-sky-50/90 border border-sky-200/90',
      badgeClass: 'bg-sky-100 text-sky-800',
      dotClass: 'bg-sky-500',
      borderClass: 'border-sky-300',
      textClass: 'text-sky-800',
      colorName: '蓝色',
      hex: '#0284c7',
    };
  }
  // 101 – 200: Yellow
  if (value <= 200) {
    return {
      bgClass: 'bg-amber-50/90 border border-amber-200/90',
      badgeClass: 'bg-amber-100 text-amber-900',
      dotClass: 'bg-amber-500',
      borderClass: 'border-amber-300',
      textClass: 'text-amber-800',
      colorName: '黄色',
      hex: '#f59e0b',
    };
  }
  // 201 – 300: Orange
  if (value <= 300) {
    return {
      bgClass: 'bg-orange-50/90 border border-orange-200/90',
      badgeClass: 'bg-orange-100 text-orange-900',
      dotClass: 'bg-orange-500',
      borderClass: 'border-orange-300',
      textClass: 'text-orange-800',
      colorName: '橙色',
      hex: '#f97316',
    };
  }
  // 300 以上: Red
  return {
    bgClass: 'bg-rose-50/90 border border-rose-200/90',
    badgeClass: 'bg-rose-100 text-rose-900',
    dotClass: 'bg-rose-500',
    borderClass: 'border-rose-300',
    textClass: 'text-rose-800',
    colorName: '红色',
    hex: '#ef4444',
  };
}

export interface SolidReadingStyle {
  bgHex: string;
  bgTailwind: string;
  textColor: string;
  unitColor: string;
  badgeBg: string;
  badgeText: string;
  colorName: string;
}

/**
 * 饱满对比色块样式（严格还原 Air Quality Readings 官方/参考图配色）：
 * 1-Hour PM2.5:
 * 0 – 55: Green
 * 56 – 150: Yellow
 * 151 – 250: Orange
 * 250 and above: Red
 */
export function getPm25SolidStyle(value: number | null | undefined): SolidReadingStyle {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      bgHex: '#475569',
      bgTailwind: 'bg-slate-600',
      textColor: 'text-white',
      unitColor: 'text-slate-200',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '灰色',
    };
  }

  // 0 – 55: Green
  if (value <= 55) {
    return {
      bgHex: '#10b981',
      bgTailwind: 'bg-[#10b981]',
      textColor: 'text-white',
      unitColor: 'text-emerald-100',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '绿色',
    };
  }
  // 56 – 150: Yellow
  if (value <= 150) {
    return {
      bgHex: '#eab308',
      bgTailwind: 'bg-[#eab308]',
      textColor: 'text-slate-900',
      unitColor: 'text-slate-800',
      badgeBg: 'bg-black/15',
      badgeText: 'text-slate-950 font-bold',
      colorName: '黄色',
    };
  }
  // 151 – 250: Orange
  if (value <= 250) {
    return {
      bgHex: '#e0531c',
      bgTailwind: 'bg-[#e0531c]',
      textColor: 'text-white',
      unitColor: 'text-orange-100',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '橙色',
    };
  }
  // 250 and above: Red
  return {
    bgHex: '#dc2626',
    bgTailwind: 'bg-[#dc2626]',
    textColor: 'text-white',
    unitColor: 'text-rose-100',
    badgeBg: 'bg-black/25',
    badgeText: 'text-white',
    colorName: '红色',
  };
}

/**
 * 24-Hour PSI 饱满对比色块样式：
 * 0 – 50: Green
 * 51 – 100: Blue
 * 101 – 200: Yellow
 * 201 – 300: Orange
 * 300 above: Red
 */
export function getPsiSolidStyle(value: number | null | undefined): SolidReadingStyle {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      bgHex: '#475569',
      bgTailwind: 'bg-slate-600',
      textColor: 'text-white',
      unitColor: 'text-slate-200',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '灰色',
    };
  }

  // 0 – 50: Green
  if (value <= 50) {
    return {
      bgHex: '#10b981',
      bgTailwind: 'bg-[#10b981]',
      textColor: 'text-white',
      unitColor: 'text-emerald-100',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '绿色',
    };
  }
  // 51 – 100: Blue
  if (value <= 100) {
    return {
      bgHex: '#0284c7',
      bgTailwind: 'bg-[#0284c7]',
      textColor: 'text-white',
      unitColor: 'text-sky-100',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '蓝色',
    };
  }
  // 101 – 200: Yellow
  if (value <= 200) {
    return {
      bgHex: '#eab308',
      bgTailwind: 'bg-[#eab308]',
      textColor: 'text-slate-900',
      unitColor: 'text-slate-800',
      badgeBg: 'bg-black/15',
      badgeText: 'text-slate-950 font-bold',
      colorName: '黄色',
    };
  }
  // 201 – 300: Orange
  if (value <= 300) {
    return {
      bgHex: '#e0531c',
      bgTailwind: 'bg-[#e0531c]',
      textColor: 'text-white',
      unitColor: 'text-orange-100',
      badgeBg: 'bg-black/25',
      badgeText: 'text-white',
      colorName: '橙色',
    };
  }
  // 300 above: Red
  return {
    bgHex: '#dc2626',
    bgTailwind: 'bg-[#dc2626]',
    textColor: 'text-white',
    unitColor: 'text-rose-100',
    badgeBg: 'bg-black/25',
    badgeText: 'text-white',
    colorName: '红色',
  };
}

/**
 * 1小时 PM2.5 官方四级分类定义
 */
export const PM25_BANDS: Record<Pm25Band, BandInfo> = {
  normal: {
    key: 'normal',
    label: '正常',
    colorName: '绿色',
    bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-300',
    dotClass: 'bg-emerald-500',
    hex: '#10b981',
    description: '0 - 55 微克/立方米：空气质量处于正常水平，一般大众可进行正常的户外活动。',
  },
  elevated: {
    key: 'elevated',
    label: '较高',
    colorName: '黄色',
    bgClass: 'bg-amber-50 text-amber-900 border-amber-200',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-300',
    dotClass: 'bg-amber-500',
    hex: '#f59e0b',
    description: '56 - 150 微克/立方米：建议健康人群减少长时间剧烈户外运动；易感人群应避免剧烈户外运动。',
  },
  high: {
    key: 'high',
    label: '高风险',
    colorName: '橙色',
    bgClass: 'bg-orange-50 text-orange-900 border-orange-200',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-300',
    dotClass: 'bg-orange-500',
    hex: '#f97316',
    description: '151 - 250 微克/立方米：健康人群应减少剧烈户外体力消耗；易感人群应尽量留在室内。',
  },
  very_high: {
    key: 'very_high',
    label: '极高风险',
    colorName: '红色',
    bgClass: 'bg-rose-50 text-rose-900 border-rose-200',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-300',
    dotClass: 'bg-rose-500',
    hex: '#ef4444',
    description: '250 微克/立方米以上：所有人应减少或避免户外活动；易感人群应完全避免外出。',
  },
};

/**
 * 24小时 PSI 官方五级分类标准（综合空气质量指数）
 */
export const PSI_BANDS: Record<AirQualityBand, BandInfo> = {
  good: {
    key: 'good',
    label: '良好',
    colorName: '绿色',
    bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-300',
    dotClass: 'bg-emerald-500',
    hex: '#10b981',
    description: '0 - 50 PSI：空气质量良好，适合所有户外活动。',
  },
  moderate: {
    key: 'moderate',
    label: '中等',
    colorName: '蓝色',
    bgClass: 'bg-sky-50 text-sky-900 border-sky-200',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-300',
    dotClass: 'bg-sky-500',
    hex: '#0284c7',
    description: '51 - 100 PSI：绝大多数人可正常活动；极敏感群体若出现不适可减少长时间户外活动。',
  },
  unhealthy: {
    key: 'unhealthy',
    label: '不健康',
    colorName: '黄色',
    bgClass: 'bg-amber-50 text-amber-900 border-amber-200',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-300',
    dotClass: 'bg-amber-500',
    hex: '#f59e0b',
    description: '101 - 200 PSI：公众应减少长时间剧烈户外活动；老人、孕妇、儿童及心肺疾病患者应尽量避免剧烈户外活动。',
  },
  very_unhealthy: {
    key: 'very_unhealthy',
    label: '非常不健康',
    colorName: '橙色',
    bgClass: 'bg-orange-50 text-orange-900 border-orange-200',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-300',
    dotClass: 'bg-orange-500',
    hex: '#f97316',
    description: '201 - 300 PSI：公众应避免长时间或剧烈户外活动；易感人群应留在室内并开启空气净化设备。',
  },
  hazardous: {
    key: 'hazardous',
    label: '危险',
    colorName: '红色',
    bgClass: 'bg-rose-50 text-rose-900 border-rose-200',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-300',
    dotClass: 'bg-rose-500',
    hex: '#ef4444',
    description: '300 以上 PSI：严重风险，所有人群均应减少非必要户外活动；老人、病患及儿童必须留在室内。',
  },
};

export function getPm25Band(value: number | null | undefined): Pm25Band {
  if (value === null || value === undefined || isNaN(value)) return 'normal';
  if (value <= 55) return 'normal';
  if (value <= 150) return 'elevated';
  if (value <= 250) return 'high';
  return 'very_high';
}

export function getPsiBand(value: number | null | undefined): AirQualityBand {
  if (value === null || value === undefined || isNaN(value)) return 'good';
  if (value <= 50) return 'good';
  if (value <= 100) return 'moderate';
  if (value <= 200) return 'unhealthy';
  if (value <= 300) return 'very_unhealthy';
  return 'hazardous';
}

/**
 * 官方活动建议文字
 */
export function getHealthAdvice(pm25Band: Pm25Band, psiBand: AirQualityBand) {
  // PM2.5 advice
  let immediateAdvice = '当前 1小时 PM2.5 处于正常范围，可正常进行户外体育运动与日常活动。';
  if (pm25Band === 'elevated') {
    immediateAdvice = '当前 1小时 PM2.5 指数较高。一般健康人群请根据身体反应适当降低长时间剧烈运动强度；老年人、孕妇、儿童及患有呼吸道或心脏病患者应尽量避免剧烈户外运动。';
  } else if (pm25Band === 'high') {
    immediateAdvice = '当前 1小时 PM2.5 指数处于高风险范围。建议大众减少户外活动；敏感体质及易感人群应留在室内并关闭门窗。';
  } else if (pm25Band === 'very_high') {
    immediateAdvice = '当前 1小时 PM2.5 指数极高，存在显著健康风险。建议所有人尽量避免外出，室内开启空气净化滤清设备。';
  }

  // 24-hr PSI daily plan advice
  let dailyPlanningAdvice = '全天 24小时 PSI 处于安全范围，可按原计划安排日常行程。';
  if (psiBand === 'moderate') {
    dailyPlanningAdvice = '24小时 PSI 为中等水平，总体良好，但极敏感人群应留意空气质量最新动态。';
  } else if (psiBand === 'unhealthy') {
    dailyPlanningAdvice = '24小时 PSI 达到不健康标准，全天外出请减少过度运动，有呼吸系统疾病者外出可备好防护口罩。';
  } else if (psiBand === 'very_unhealthy') {
    dailyPlanningAdvice = '24小时 PSI 达到非常不健康标准，建议各机构与家庭减少组织室外聚会或体育赛事。';
  } else if (psiBand === 'hazardous') {
    dailyPlanningAdvice = '24小时 PSI 达危险级别，请遵照新加坡国家环境局（NEA）与卫生部最新发布的应急指南采取居家防护。';
  }

  return {
    immediateAdvice,
    dailyPlanningAdvice,
  };
}
