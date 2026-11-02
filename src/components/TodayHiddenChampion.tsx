/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Company } from "../types.ts";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { SampleDataBadge, VerifiedBadge } from "./Badges.tsx";

interface TodayHiddenChampionProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onOpenCriteria: () => void;
}

export function TodayHiddenChampion({
  companies,
  onSelectCompany,
  onOpenCriteria,
}: TodayHiddenChampionProps) {
  // Eligible companies: hidden_badge === true && verified === true
  const candidates = companies.filter((c) => c.hidden_badge && c.verified);

  // Deterministic daily pick based on date string (e.g. 2026-11-01)
  const getTodayPick = (): Company | null => {
    if (candidates.length === 0) return null;
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % candidates.length;
    return candidates[index];
  };

  const todayPick = getTodayPick();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/50 rounded-3xl p-5 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-200">
              오늘의 숨은 강자 B2B 기업
            </h3>
            <p className="text-[11px] text-amber-400/80">
              출처 검증 완료 기업 중 날짜별 추천 (운영진 수동 검토)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCriteria}
          className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>선정 기준</span>
        </button>
      </div>

      {todayPick ? (
        <div className="mt-4 pt-4 border-t border-amber-900/40">
          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg sm:text-xl font-extrabold text-white">
                  {todayPick.name}
                </h4>
                {todayPick.is_sample && <SampleDataBadge />}
                <VerifiedBadge />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{todayPick.categories.join(", ")}</span>
                <span aria-hidden="true">·</span>
                <span>{todayPick.size_class ? todayPick.size_class.value : "중견·대기업"}</span>
                {todayPick.region && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{todayPick.region.value}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => onSelectCompany(todayPick)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              <span>기업 상세 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayPick.hidden_badge_reason && (
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-amber-900/30 mt-3">
              <strong className="text-amber-300 block mb-0.5">선정 이유:</strong>
              {todayPick.hidden_badge_reason}
            </p>
          )}

          {todayPick.one_line_summary && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              {todayPick.one_line_summary.value}
            </p>
          )}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          아직 선정된 기업이 없습니다. (운영진 검토 완료 후 숨은 강자 지정 시 매일 자동 표시됩니다)
        </div>
      )}
    </div>
  );
}
