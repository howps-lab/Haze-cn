/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  HazeDataSnapshot,
  HistoricalDataPoint,
  RegionKey,
} from './types/haze';
import {
  fetchLatestHazeSnapshot,
  fetchHistoricalHazeData,
  getCachedHazeSnapshot,
} from './services/hazeApi';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { OverviewHero } from './components/OverviewHero';
import { RegionalGrid } from './components/RegionalGrid';
import { TrendChart } from './components/TrendChart';
import { HealthAdvisory } from './components/HealthAdvisory';
import { Footer } from './components/Footer';
import { ArrowUp, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  // 实时时钟（每秒更新）
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 烟霾实时快照与历史数据
  const [snapshot, setSnapshot] = useState<HazeDataSnapshot | null>(() => getCachedHazeSnapshot());
  const [historyData, setHistoryData] = useState<HistoricalDataPoint[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);

  // 网络与刷新状态
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'updating' | 'error'>(
    'updating'
  );
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastSuccessFetchTime, setLastSuccessFetchTime] = useState<string>('');

  // 提示信息 Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(
    null
  );

  // 交互筛选
  const [activeMetric, setActiveMetric] = useState<'pm25' | 'psi'>('pm25');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | 'all'>('all');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const lastFetchTimeRef = useRef<number>(0);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // 1. 每秒更新时钟
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 页面滚动监听（控制返回顶部按钮）
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. 数据拉取主逻辑
  const loadData = useCallback(async (isSilent: boolean = false) => {
    if (!isSilent) {
      setIsRefreshing(true);
      showToast('正在获取最新数据……', 'info');
    }
    setConnectionStatus('updating');

    try {
      const newSnapshot = await fetchLatestHazeSnapshot();
      setSnapshot(newSnapshot);
      setHasError(false);
      setErrorMessage('');
      setConnectionStatus('connected');
      const nowIso = new Date().toISOString();
      setLastSuccessFetchTime(nowIso);
      lastFetchTimeRef.current = Date.now();

      if (!isSilent) {
        showToast('数据已更新', 'success');
      }
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : '暂时无法连接官方接口';
      setHasError(true);
      setErrorMessage(errText);
      setConnectionStatus('error');
      if (!isSilent) {
        showToast('暂时无法获取官方数据', 'error');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // 4. 历史时序数据拉取
  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const hist = await fetchHistoricalHazeData();
      setHistoryData(hist);
    } catch {
      // 保持已有历史缓存
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // 5. 初始化与事件监听 (60秒自动轮询、前台恢复、网络重连)
  useEffect(() => {
    // 首次进入立即获取
    loadData(false);
    loadHistory();

    // 60 秒定期自动检查
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    }, 60000);

    // 页面可见性改变（从后台回到前台立即刷新）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastFetchTimeRef.current;
        // 如果离开超过 45 秒，回到前台立即检查更新
        if (elapsed > 45000) {
          loadData(true);
        }
      }
    };

    // 网络恢复监听
    const handleOnline = () => {
      loadData(false);
      loadHistory();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [loadData, loadHistory]);

  const handleManualRefresh = () => {
    loadData(false);
    loadHistory();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 顶部标题与时钟横栏 */}
      <Header
        currentDate={currentDate}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
        connectionStatus={connectionStatus}
      />

      {/* 居中浮动 Toast 状态反馈 */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 pointer-events-none transition-all duration-300">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold pointer-events-auto ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : toastMessage.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'info' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-300" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 主体容器 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 数据连接与发布时间状态横条 */}
        <StatusBar
          officialTimestamp={snapshot?.timestamp}
          officialUpdateTimestamp={snapshot?.updateTimestamp}
          fetchTimestamp={lastSuccessFetchTime}
          isStale={!!snapshot?.isStale}
          hasError={hasError}
          errorMessage={errorMessage}
        />

        {snapshot ? (
          <>
            {/* 主要烟霾核心指标概览 */}
            <OverviewHero
              snapshot={snapshot}
              activeMetric={activeMetric}
              onChangeMetric={setActiveMetric}
            />

            {/* 地区卡片网格 */}
            <RegionalGrid
              snapshot={snapshot}
              activeMetric={activeMetric}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />

            {/* 历史趋势图表 */}
            <TrendChart
              historyData={historyData}
              isLoading={isHistoryLoading}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              activeMetric={activeMetric}
              onChangeMetric={setActiveMetric}
            />

            {/* 官方健康防护指南与分级对照表 */}
            <HealthAdvisory
              currentPm25Band={snapshot.peakPm25.band}
              currentPsiBand={snapshot.peakPsi.band}
            />
          </>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-base font-bold text-slate-900">正在连接新加坡国家环境局官方接口…</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              正在获取最新的 1小时 PM2.5 实时浓度与 24小时 PSI 污染指数数据，请稍候。
            </p>
          </div>
        )}
      </main>

      {/* 浮动返回顶部按钮（在手机和桌面均便捷触发） */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          aria-label="平滑滚动至页面顶部"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* 页脚与官方免责声明 */}
      <Footer
        lastSuccessFetchTime={lastSuccessFetchTime || snapshot?.fetchTimestamp}
        onScrollToTop={handleScrollToTop}
      />
    </div>
  );
}
