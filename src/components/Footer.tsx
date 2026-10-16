import React from 'react';
import { ExternalLink, ArrowUp, Shield } from 'lucide-react';
import { formatFullTimestamp } from '../utils/dateUtils';

interface FooterProps {
  lastSuccessFetchTime?: string;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lastSuccessFetchTime,
  onScrollToTop,
}) => {
  return (
    <footer id="disclaimer" className="bg-white border-t border-slate-200 mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 数据源与返回顶部 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>数据来源：新加坡国家环境局官方烟霾网站</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>官方数据门户：</span>
              <a
                href="https://www.haze.gov.sg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
              >
                <span>https://www.haze.gov.sg/</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">·</span>
              <a
                href="https://data.gov.sg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
              >
                <span>Data.gov.sg 开放数据平台</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-xs text-slate-400">
              数据最后成功获取时间：{lastSuccessFetchTime ? formatFullTimestamp(lastSuccessFetchTime) : '获取中…'}
            </div>
          </div>

          <button
            onClick={onScrollToTop}
            aria-label="返回页面顶部"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>返回顶部</span>
          </button>
        </div>

        {/* 严格法定义务免责声明 */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-800">重要免责声明：</p>
          <p className="leading-relaxed">
            本应用仅用于信息展示，数据以新加坡官方发布的信息为准。数据可能存在更新延迟或暂时无法获取的情况。本应用并非官方政府网站，也不代表新加坡国家环境局（NEA）。健康建议请以相关官方机构发布的信息为准。
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            本应用不提供任何明示或暗示的保证。任何依赖本应用数据所做出的个人活动计划、出行决定或防护举措，请根据自身健康状况并以新加坡卫生部（MOH）及国家环境局官方实时发布为准。
          </p>
        </div>

        {/* 底部版权与时区标识 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 pt-2">
          <div>新加坡实时烟霾监测应用 · 简体中文标准版</div>
          <div>时区采用新加坡标准时间：Asia/Singapore (UTC+8)</div>
        </div>
      </div>
    </footer>
  );
};
