import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin,
  LayoutGrid,
} from 'lucide-react';
import { HazeDataSnapshot, RegionKey, RegionalRecord } from '../types/haze';
import { formatTimestampToHour } from '../utils/dateUtils';
import {
  PM25_BANDS,
  PSI_BANDS,
  getPm25SolidStyle,
  getPsiSolidStyle,
} from '../utils/hazeStandards';

interface RegionalGridProps {
  snapshot: HazeDataSnapshot;
  activeMetric: 'pm25' | 'psi';
  selectedRegion: RegionKey | 'all';
  onSelectRegion: (region: RegionKey | 'all') => void;
}

type SortOrder = 'default' | 'desc' | 'asc';

export const RegionalGrid: React.FC<RegionalGridProps> = ({
  snapshot,
  activeMetric,
  selectedRegion,
  onSelectRegion,
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleDetails = (regionKey: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [regionKey]: !prev[regionKey],
    }));
  };

  const regionList: RegionalRecord[] = Object.values(snapshot.regions);

  // 排序逻辑
  const sortedRegions = [...regionList].sort((a, b) => {
    if (sortOrder === 'default') return 0;
    const valA = activeMetric === 'pm25' ? (a.pm25OneHourly ?? -1) : (a.psiTwentyFourHourly ?? -1);
    const valB = activeMetric === 'pm25' ? (b.pm25OneHourly ?? -1) : (b.psiTwentyFourHourly ?? -1);
    if (sortOrder === 'desc') return valB - valA;
    return valA - valB;
  });

  return (
    <section id="regions" className="space-y-4 mb-8">
      {/* 头部标题与控制栏（参考设计图顶部风格） */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-slate-800" />
            <span>新加坡五大区域数据详情</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            官方发布 1小时 PM2.5 实时浓度与 24小时 PSI 污染指数读数（覆盖全岛五大区域）
          </p>
        </div>

        {/* 排序与过滤操作栏 */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>排序方式：</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setSortOrder('desc')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                sortOrder === 'desc'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              指数从高到低
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                sortOrder === 'asc'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              指数从低到高
            </button>
            <button
              onClick={() => setSortOrder('default')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                sortOrder === 'default'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              默认区域
            </button>
          </div>
        </div>
      </div>

      {/* 区域卡片响应式网格（严格依据用户参考图 Air Quality Readings Color.png 配色与双列实心饱满色块结构） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedRegions.map((reg) => {
          const pm25Band = PM25_BANDS[reg.pm25Band];
          const psiBand = PSI_BANDS[reg.psiBand];

          // 核心颜色映射：严格依据用户指定颜色代码获取饱满背景与对比文字
          const pm25Solid = getPm25SolidStyle(reg.pm25OneHourly);
          const psiSolid = getPsiSolidStyle(reg.psiTwentyFourHourly);

          const isSelected = selectedRegion === reg.key;
          const isExpanded = !!expandedDetails[reg.key];

          const isHighest =
            activeMetric === 'pm25'
              ? reg.key === snapshot.peakPm25.regionKey
              : reg.key === snapshot.peakPsi.regionKey;

          return (
            <div
              key={reg.key}
              onClick={() => onSelectRegion(reg.key === selectedRegion ? 'all' : reg.key)}
              className={`rounded-2xl overflow-hidden border transition-all shadow-md bg-white flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'ring-3 ring-emerald-500 border-emerald-400'
                  : 'border-slate-200/90 hover:border-slate-400/80 hover:shadow-lg'
              }`}
            >
              <div>
                {/* 1. 卡片深色顶部标题栏 (对应参考图深蓝黑色顶栏) */}
                <div className="bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-rose-400" />
                    </div>
                    <span className="font-extrabold tracking-wider text-sm sm:text-base">
                      {reg.nameZh}
                      <span className="text-xs font-semibold text-slate-400 uppercase ml-1">
                        ({reg.nameEn})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    {isHighest && (
                      <span className="text-[10px] font-bold text-rose-200 bg-rose-900/90 px-2 py-0.5 rounded border border-rose-500/40">
                        当前全岛最高
                      </span>
                    )}
                    <span className="text-slate-300 text-[11px]">
                      {formatTimestampToHour(snapshot.timestamp)}
                    </span>
                  </div>
                </div>

                {/* 2. 双列实心饱满色块读数区 (依据 Air Quality Readings Color.png 严格分色) */}
                <div className="grid grid-cols-2 divide-x divide-black/10">
                  {/* 左列：1小时 PM2.5 读数列 */}
                  <div
                    className={`p-4 sm:p-5 flex flex-col justify-between transition-colors ${pm25Solid.bgTailwind} ${pm25Solid.textColor}`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold tracking-tight">
                      <span>1小时 PM2.5</span>
                      <span className={`text-[11px] font-medium ${pm25Solid.unitColor}`}>µg/m³</span>
                    </div>

                    <div className="my-5 text-center">
                      <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums tracking-tight">
                        {reg.pm25OneHourly !== null ? reg.pm25OneHourly : '--'}
                      </span>
                    </div>

                    <div className="text-center">
                      <span
                        className={`inline-block w-full py-1.5 px-2 rounded-lg text-xs font-extrabold shadow-2xs ${pm25Solid.badgeBg} ${pm25Solid.badgeText}`}
                      >
                        {pm25Band.label}
                      </span>
                    </div>
                  </div>

                  {/* 右列：24小时 PSI 读数列 */}
                  <div
                    className={`p-4 sm:p-5 flex flex-col justify-between transition-colors ${psiSolid.bgTailwind} ${psiSolid.textColor}`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold tracking-tight">
                      <span>24小时 PSI</span>
                      <span className={`text-[11px] font-medium ${psiSolid.unitColor}`}>指数</span>
                    </div>

                    <div className="my-5 text-center">
                      <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums tracking-tight">
                        {reg.psiTwentyFourHourly !== null ? reg.psiTwentyFourHourly : '--'}
                      </span>
                    </div>

                    <div className="text-center">
                      <span
                        className={`inline-block w-full py-1.5 px-2 rounded-lg text-xs font-extrabold shadow-2xs ${psiSolid.badgeBg} ${psiSolid.badgeText}`}
                      >
                        {psiBand.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. 卡片下半部分：活动建议摘要 */}
                <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {activeMetric === 'pm25' ? pm25Band.description : psiBand.description}
                </div>

                {/* 4. 官方其他环境监测指标可折叠部分 */}
                {isExpanded && (
                  <div className="px-4 pb-3 bg-white space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-semibold text-slate-500">
                      官方附属监测子指标（国家环境局发布）：
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">PM10 (24小时)</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {reg.pm10TwentyFourHourly ?? '--'} µg/m³
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">臭氧 O3 分指数</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {reg.o3SubIndex ?? '--'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">一氧化碳 CO 分指数</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {reg.coSubIndex ?? '--'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">二氧化硫 SO2 分指数</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {reg.so2SubIndex ?? '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 卡片底部操作与更新时间 */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>更新时点：{formatTimestampToHour(snapshot.timestamp)}</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(reg.key);
                  }}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold"
                >
                  <span>{isExpanded ? '收起附属指标' : '更多污染物'}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
