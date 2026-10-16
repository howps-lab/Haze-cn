import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { HistoricalDataPoint, RegionKey } from '../types/haze';
import { REGION_NAMES_ZH } from '../utils/hazeStandards';

interface TrendChartProps {
  historyData: HistoricalDataPoint[];
  isLoading: boolean;
  selectedRegion: RegionKey | 'all';
  onSelectRegion: (region: RegionKey | 'all') => void;
  activeMetric: 'pm25' | 'psi';
  onChangeMetric: (metric: 'pm25' | 'psi') => void;
}

type TimeRangeOption = 6 | 12 | 24 | 48;

export const TrendChart: React.FC<TrendChartProps> = ({
  historyData,
  isLoading,
  selectedRegion,
  onSelectRegion,
  activeMetric,
  onChangeMetric,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>(24);

  // 截取对应小时数的数据
  const filteredData = React.useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    return historyData.slice(-timeRange);
  }, [historyData, timeRange]);

  const unit = activeMetric === 'pm25' ? 'µg/m³' : 'PSI';
  const metricName = activeMetric === 'pm25' ? '1小时 PM2.5 浓度' : '24小时 PSI 指数';

  // 区域色彩映射方案（符合无刺眼高饱和原则）
  const REGION_COLORS: Record<RegionKey, string> = {
    central: '#0284c7', // Sky
    north: '#059669', // Emerald
    south: '#dc2626', // Red
    east: '#d97706', // Amber
    west: '#7c3aed', // Purple
  };

  return (
    <section id="trends" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs mb-8">
      {/* 图表标题与筛选器 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>空气质量历史变化趋势</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            官方逐小时连续监测读数 · 横轴为新加坡时间 · 支持多区域对比分析
          </p>
        </div>

        {/* 控件区：指标切换、区域选择与时间范围 */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* 指标选择 */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => onChangeMetric('pm25')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'pm25'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1小时 PM2.5
            </button>
            <button
              onClick={() => onChangeMetric('psi')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'psi'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24小时 PSI
            </button>
          </div>

          {/* 区域选择下拉菜单 */}
          <select
            value={selectedRegion}
            onChange={(e) => onSelectRegion(e.target.value as RegionKey | 'all')}
            aria-label="选择查看趋势图的地区"
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">全岛五区对比</option>
            <option value="central">中部地区</option>
            <option value="north">北部地区</option>
            <option value="south">南部地区</option>
            <option value="east">东部地区</option>
            <option value="west">西部地区</option>
          </select>

          {/* 时间范围选择 */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            {([6, 12, 24, 48] as TimeRangeOption[]).map((hours) => (
              <button
                key={hours}
                onClick={() => setTimeRange(hours)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  timeRange === hours
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                近{hours}小时
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 图表展示区 */}
      <div className="pt-4">
        {isLoading ? (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">正在整理官方历史时序数据…</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-300" />
            <span className="text-sm font-medium text-slate-600">暂无历史数据</span>
            <span className="text-xs text-slate-400">
              数据源正在同步或接口临时维护中，稍后将自动呈现
            </span>
          </div>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit={` ${unit}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload as HistoricalDataPoint;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-lg border border-slate-800">
                          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2">
                            {dataPoint.fullDateTime || label}（新加坡时间）
                          </div>
                          <div className="space-y-1">
                            {payload.map((item) => (
                              <div
                                key={item.name}
                                className="flex items-center justify-between gap-4"
                              >
                                <span className="flex items-center gap-1.5 text-slate-300">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span>{item.name}：</span>
                                </span>
                                <span className="font-mono font-bold tabular-nums text-white">
                                  {item.value} {unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-medium text-slate-700">{value}</span>
                  )}
                />

                {/* 按用户选择渲染对应区域或全岛五区曲线 */}
                {(['north', 'south', 'east', 'west', 'central'] as RegionKey[])
                  .filter((k) => selectedRegion === 'all' || selectedRegion === k)
                  .map((k) => {
                    const dataKey = activeMetric === 'pm25' ? `${k}_pm25` : `${k}_psi`;
                    return (
                      <Line
                        key={k}
                        type="monotone"
                        dataKey={dataKey}
                        name={`${REGION_NAMES_ZH[k]}地区`}
                        stroke={REGION_COLORS[k]}
                        strokeWidth={selectedRegion === k ? 2.5 : 1.8}
                        dot={filteredData.length <= 12 ? { r: 3 } : false}
                        activeDot={{ r: 5 }}
                        connectNulls
                      />
                    );
                  })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span>纵轴单位：{unit} · 真实追溯至新加坡官方数据库记录</span>
        <span>提示：支持通过手指或鼠标轻触曲线以查看各整点时标的具体数值</span>
      </div>
    </section>
  );
};
