import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBasket, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatisticsProps {
  total: number;
  pending: number;
  purchased: number;
}

export const Statistics: React.FC<StatisticsProps> = ({ total, pending, purchased }) => {
  const { t } = useTranslation();
  const prevPendingRef = useRef<number>(pending);

  const percentage = total > 0 ? Math.round((purchased / total) * 100) : 0;
  const isAllDone = total > 0 && pending === 0;

  useEffect(() => {
    // If just completed all items
    if (isAllDone && prevPendingRef.current > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    }
    prevPendingRef.current = pending;
  }, [pending, isAllDone]);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
        {/* Total Items */}
        <div id="stat-total-card" className="bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('totalItems')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBasket className="w-4 h-4" />
            </div>
          </div>
          <p id="stat-total-count" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {total}
          </p>
        </div>

        {/* Pending Items */}
        <div id="stat-pending-card" className="bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {t('pending')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p id="stat-pending-count" className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-300">
            {pending}
          </p>
        </div>

        {/* Purchased Items */}
        <div id="stat-purchased-card" className="bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t('purchased')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p id="stat-purchased-count" className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {purchased}
          </p>
        </div>
      </div>

      {/* Progress Bar & Banner */}
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('shoppingProgress')}
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {percentage}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isAllDone && (
          <div className="mt-3 p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-center">
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
              {t('allDoneTitle')}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              {t('allDoneSub')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
