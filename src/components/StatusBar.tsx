import React from 'react';
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getRelativeTimeText } from '../utils/dateUtils';

interface StatusBarProps {
  officialTimestamp?: string;
  officialUpdateTimestamp?: string;
  fetchTimestamp?: string;
  isStale: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  officialTimestamp,
  fetchTimestamp,
  isStale,
  hasError,
  errorMessage,
}) => {
  return (
    <div className="space-y-2 mb-6">
      {/* 过期或错误告警条 */}
      {hasError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 sm:p-4 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900">暂时无法获取官方最新数据</p>
            <p className="text-amber-800 text-xs mt-0.5">
              {errorMessage || '网络请求受阻或官方服务暂未响应。当前已自动为您保留最近一次成功获取的官方数据，绝无虚构指数。'}
            </p>
          </div>
        </div>
      )}

      {isStale && !hasError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 sm:p-4 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900">数据可能已过期</p>
            <p className="text-amber-800 text-xs mt-0.5">
              距官方最新记录已超过2小时，国家环境局官方通常在整点更新。请参阅官方网站确认是否有维护公告。
            </p>
          </div>
        </div>
      )}

      {/* 正常信息状态条 */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">


            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">最后成功获取：</span>
              <span className="font-mono tabular-nums text-slate-800 font-medium">
                {fetchTimestamp ? getRelativeTimeText(fetchTimestamp) : '进行中'}
              </span>
            </div>

            <div className="hidden sm:inline text-slate-300">|</div>

            <div className="inline-flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>数据直通：新加坡国家环境局 (NEA)</span>
            </div>
          </div>

          {/* 自动检查频率提示说明 */}
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Info className="w-3 h-3 shrink-0" />
            <span>页面每 60 秒自动检查更新（以官方实际每小时/每15分钟发布频率为准）</span>
          </div>
        </div>
      </div>
    </div>
  );
};
