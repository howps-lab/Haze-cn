import React from 'react';
import { RefreshCw, Radio, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  formatSingaporeDate,
  formatSingaporeTime,
  formatSingaporeWeekday,
} from '../utils/dateUtils';

interface HeaderProps {
  currentDate: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  connectionStatus: 'connected' | 'updating' | 'error';
  lastSuccessMessage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  isRefreshing,
  onRefresh,
  connectionStatus,
}) => {
  const dateStr = formatSingaporeDate(currentDate);
  const weekdayStr = formatSingaporeWeekday(currentDate);
  const timeStr = formatSingaporeTime(currentDate);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 顶部主导航栏（符合 Top Bar Contract：品牌元素 — 4至5个导航锚点 — 核心主操作） */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: 品牌字标 */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
            <a
              href="#"
              className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-emerald-700 transition-colors"
            >
              新加坡实时烟霾监测
            </a>
          </div>

          {/* Zone 2: 4-5个单行导航链接（桌面端） */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#overview" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              主要指标
            </a>
            <a href="#regions" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              地区数据
            </a>
            <a href="#trends" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              历史趋势
            </a>
            <a href="#advisory" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              健康防护
            </a>
            <a href="#standards" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              分级标准
            </a>
            <a href="#disclaimer" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              官方数据源
            </a>
          </nav>

          {/* Zone 3: 1个核心主操作 */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="立即更新官方数据"
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs ${
                isRefreshing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="whitespace-nowrap">{isRefreshing ? '正在获取…' : '立即更新'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 实时时间与官方连接状态横条 */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {/* 左侧：动态新加坡时钟 */}
          <div className="flex items-center gap-2 text-slate-600 font-medium flex-wrap">
            <span>{dateStr}</span>
            <span className="text-slate-300">·</span>
            <span>{weekdayStr}</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono tabular-nums text-slate-900 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
              {timeStr}
            </span>
            <span className="text-slate-400 text-[11px]">新加坡时间 (UTC+8)</span>
          </div>

          {/* 右侧：连接状态指示器 */}
          <div className="flex items-center gap-3 text-xs">
            {connectionStatus === 'connected' && (
              <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>官方数据实时连接</span>
              </div>
            )}
            {connectionStatus === 'updating' && (
              <div className="inline-flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/60 font-medium">
                <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span>正在检查数据更新…</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>暂时无法连接官方接口（已保留最近数据）</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
