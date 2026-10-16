import React from 'react';
import { HeartPulse, ExternalLink, ShieldCheck, Users, AlertCircle, Baby } from 'lucide-react';
import { AirQualityBand, Pm25Band } from '../types/haze';
import { PM25_BANDS, PSI_BANDS } from '../utils/hazeStandards';

interface HealthAdvisoryProps {
  currentPm25Band: Pm25Band;
  currentPsiBand: AirQualityBand;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({
  currentPm25Band,
  currentPsiBand,
}) => {
  return (
    <section id="advisory" className="space-y-6 mb-8">
      {/* 模块标题 */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <span>新加坡官方健康与防护指南</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            严格遵循新加坡国家环境局（NEA）与新加坡卫生部（MOH）联合健康指引制定
          </p>
        </div>

        <a
          href="https://www.haze.gov.sg/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 self-start sm:self-auto"
        >
          <span>访问国家环境局官方指引页面</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 两类人群分栏防护行动建议 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 健康人群（一般大众） */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 text-slate-900">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">健康公众（一般人群）</h3>
              <p className="text-[11px] text-slate-400">身体健康无基础疾病者</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">
                即时活动安排（参考 1小时 PM2.5）：
              </span>
              {currentPm25Band === 'normal' && (
                <p className="text-emerald-800">
                  当前处于<strong>正常水平</strong>，可正常进行户外长跑、骑行、球类及所有常规户外活动。
                </p>
              )}
              {currentPm25Band === 'elevated' && (
                <p className="text-amber-800">
                  当前处于<strong>较高水平</strong>，建议减少长时间或剧烈户外体育锻炼，适度转移至室内。
                </p>
              )}
              {currentPm25Band === 'high' && (
                <p className="text-orange-800">
                  当前处于<strong>高风险水平</strong>，公众应显著减少非必要户外剧烈体力活动。
                </p>
              )}
              {currentPm25Band === 'very_high' && (
                <p className="text-rose-800">
                  当前处于<strong>极高危险水平</strong>，所有人应避免户外滞留，尽量闭门窗并在室内开启空气净化装置。
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">
                长程全天考量（参考 24小时 PSI）：
              </span>
              <p>
                24小时 PSI 指数当前处于
                <strong className="text-slate-900 mx-1">{PSI_BANDS[currentPsiBand].label}</strong>
                区间。可结合全天天气预报和烟霾扩散风向合理规划次日户外行程。
              </p>
            </div>
          </div>
        </div>

        {/* 易感人群（老年人、孕妇、儿童及患有慢性心肺疾病人士） */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 text-slate-900">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">易感脆弱群体</h3>
              <p className="text-[11px] text-slate-400">老年人、孕妇、幼童、哮喘或心血管慢性病患者</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">
                敏感人群即刻防护（参考 1小时 PM2.5）：
              </span>
              {currentPm25Band === 'normal' && (
                <p className="text-emerald-800">
                  当前处于<strong>正常区间</strong>，可正常进行日常出行与户外散步。
                </p>
              )}
              {currentPm25Band === 'elevated' && (
                <p className="text-amber-800">
                  当前处于<strong>较高区间</strong>，易感人群应<strong>避免剧烈户外运动</strong>，出门请备好常备哮喘气雾剂或心肺类药物。
                </p>
              )}
              {(currentPm25Band === 'high' || currentPm25Band === 'very_high') && (
                <p className="text-rose-800">
                  当前处于<strong>高风险或极高危险区间</strong>，易感人群<strong>应避免任何户外活动</strong>，留居室内并关闭通风不良门窗。如感胸闷气急应及时就医。
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">口罩与防护装备须知：</span>
              <p>
                普通医用外科口罩无法阻挡超细微颗粒物 PM2.5。当烟霾严重且确需长时间外出时，建议佩戴符合 N95 标准且气密性良好的防护口罩；但慢性心肺疾病患者佩戴 N95 前请咨询医生意见。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 官方标准说明表格卡片 */}
      <div id="standards" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          新加坡官方空气质量等级与分级对照表
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 表格 1: 1小时 PM2.5 四级标准 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800">1小时 PM2.5 官方四级分类</h4>
              <span className="text-[11px] text-slate-400">单位：微克/立方米 (µg/m³)</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-12 py-2 px-3 font-semibold text-slate-700">
                <span className="col-span-3">等级名称</span>
                <span className="col-span-3">浓度范围</span>
                <span className="col-span-6">即时活动建议</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-12 py-2.5 px-3 items-center">
                  <span className="col-span-3 font-semibold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    正常 (Normal)
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">0 - 55</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">正常进行各类户外活动</span>
                </div>

                <div className="grid grid-cols-12 py-2.5 px-3 items-center">
                  <span className="col-span-3 font-semibold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    较高 (Elevated)
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">56 - 150</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">
                    减少剧烈户外活动；易感者避免剧烈运动
                  </span>
                </div>

                <div className="grid grid-cols-12 py-2.5 px-3 items-center">
                  <span className="col-span-3 font-semibold text-orange-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    高 (High)
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">151 - 250</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">减少外出；易感人群留在室内</span>
                </div>

                <div className="grid grid-cols-12 py-2.5 px-3 items-center">
                  <span className="col-span-3 font-semibold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    极高 (Very High)
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">&gt; 250</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">避免非必要外出；留在室内紧闭门窗</span>
                </div>
              </div>
            </div>
          </div>

          {/* 表格 2: 24小时 PSI 五级标准 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800">24小时 PSI 污染指数官方分级</h4>
              <span className="text-[11px] text-slate-400">综合空气质量指标</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-12 py-2 px-3 font-semibold text-slate-700">
                <span className="col-span-3">等级名称</span>
                <span className="col-span-3">指数范围</span>
                <span className="col-span-6">全天健康指导</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-12 py-2 px-3 items-center">
                  <span className="col-span-3 font-semibold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    良好
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">0 - 50</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">适合所有正常户外活动</span>
                </div>

                <div className="grid grid-cols-12 py-2 px-3 items-center">
                  <span className="col-span-3 font-semibold text-sky-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    中等
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">51 - 100</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">大多数人可正常活动</span>
                </div>

                <div className="grid grid-cols-12 py-2 px-3 items-center">
                  <span className="col-span-3 font-semibold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    不健康
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">101 - 200</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">减少长时间剧烈体力运动</span>
                </div>

                <div className="grid grid-cols-12 py-2 px-3 items-center">
                  <span className="col-span-3 font-semibold text-orange-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    非常不健康
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">201 - 300</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">避免剧烈户外活动；易感者居室内</span>
                </div>

                <div className="grid grid-cols-12 py-2 px-3 items-center">
                  <span className="col-span-3 font-semibold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    危险 (Hazardous)
                  </span>
                  <span className="col-span-3 font-mono tabular-nums text-slate-600">&gt; 300</span>
                  <span className="col-span-6 text-slate-600 text-[11px]">尽量留在室内；严格遵循官方应急指引</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
