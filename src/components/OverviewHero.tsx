import React from 'react';
import { Wind, Activity, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { HazeDataSnapshot } from '../types/haze';
import {
  PM25_BANDS,
  PSI_BANDS,
  getHealthAdvice,
  getPm25SolidStyle,
  getPsiSolidStyle,
} from '../utils/hazeStandards';

interface OverviewHeroProps {
  snapshot: HazeDataSnapshot;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({ snapshot }) => {
  const currentPm25Band = PM25_BANDS[snapshot.peakPm25.band];
  const currentPsiBand = PSI_BANDS[snapshot.peakPsi.band];

  // 严格依颜色代码标准获取对应饱满实心色
  const pm25Solid = getPm25SolidStyle(snapshot.peakPm25.value);
  const psiSolid = getPsiSolidStyle(snapshot.peakPsi.value);

  const advice = getHealthAdvice(snapshot.peakPm25.band, snapshot.peakPsi.band);

  return (
    <section id="overview" className="space-y-6 mb-8">
      {/* 顶部标题 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          新加坡空气质量与烟霾状况
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          数据来源：新加坡国家环境局 (NEA) · 监测范围覆盖全岛五大主要区域
        </p>
      </div>

      {/* 主展示区：两大核心指数与即时建议 */}
      <div className="space-y-5">
        {/* 两大核心数据卡片并列：采用匹配参考图的深色顶栏与饱满分色读数 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 卡片 1: 1小时 PM2.5 */}
          <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white flex flex-col justify-between">
            <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-sm sm:text-base">1小时 PM2.5 实时浓度</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded">
                即时活动指标
              </span>
            </div>

            <div
              className={`p-6 flex flex-col justify-between transition-colors ${pm25Solid.bgTailwind} ${pm25Solid.textColor}`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>全岛最高：{snapshot.peakPm25.regionName}</span>
                <span className={`text-[11px] font-medium ${pm25Solid.unitColor}`}>µg/m³</span>
              </div>

              <div className="my-4 text-center">
                <span className="text-5xl sm:text-6xl font-black font-mono tabular-nums tracking-tight">
                  {snapshot.peakPm25.value}
                </span>
                <div className={`text-xs mt-1 font-semibold ${pm25Solid.unitColor}`}>
                  微克/立方米 (µg/m³)
                </div>
              </div>

              <div className="text-center">
                <span
                  className={`inline-block py-1.5 px-4 rounded-lg text-sm font-extrabold shadow-2xs ${pm25Solid.badgeBg} ${pm25Solid.badgeText}`}
                >
                  {currentPm25Band.label}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片 2: 24小时 PSI */}
          <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white flex flex-col justify-between">
            <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="font-extrabold text-sm sm:text-base">24小时 PSI 污染标准指数</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded">
                综合健康指引
              </span>
            </div>

            <div
              className={`p-6 flex flex-col justify-between transition-colors ${psiSolid.bgTailwind} ${psiSolid.textColor}`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>全岛最高：{snapshot.peakPsi.regionName}</span>
                <span className={`text-[11px] font-medium ${psiSolid.unitColor}`}>PSI</span>
              </div>

              <div className="my-4 text-center">
                <span className="text-5xl sm:text-6xl font-black font-mono tabular-nums tracking-tight">
                  {snapshot.peakPsi.value}
                </span>
                <div className={`text-xs mt-1 font-semibold ${psiSolid.unitColor}`}>
                  污染标准指数 (PSI)
                </div>
              </div>

              <div className="text-center">
                <span
                  className={`inline-block py-1.5 px-4 rounded-lg text-sm font-extrabold shadow-2xs ${psiSolid.badgeBg} ${psiSolid.badgeText}`}
                >
                  {currentPsiBand.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 整体空气质量评级与即时建议横幅 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  全岛即时健康行动建议
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>1小时 PM2.5 评估：</span>
                  <span className="font-bold text-slate-900">{currentPm25Band.label}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {advice.immediateAdvice}
              </p>

              <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">全天长程规划参考（24小时 PSI）：</span>
                {advice.dailyPlanningAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* 决策提示 */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3.5 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            💡 <strong>决策提示：</strong>准备立刻出门或进行跑步、骑行等户外活动，请主要参考{' '}
            <strong>1小时 PM2.5 浓度</strong>；规划未来一整天的活动，请参考{' '}
            <strong>24小时 PSI</strong>。
          </span>
          <a
            href="#advisory"
            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-0.5 shrink-0 self-start sm:self-auto"
          >
            <span>查看完整防护细则</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
