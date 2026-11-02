/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MetaInfo } from "../types.ts";
import { X, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

interface CriteriaModalProps {
  meta: MetaInfo;
  onClose: () => void;
}

export function CriteriaModal({ meta, onClose }: CriteriaModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg">숨은 강자 기업 선정 기준</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200">
            <strong>절대 원칙:</strong> 본 앱은 인기도나 인지도를 AI나 알고리즘으로 임의 계산하지 않으며,
            운영진이 공시 자료를 전수 확인하여 수동 지정(hidden_badge=true)한 기업에만 배지를 부여합니다.
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">운영진 검토 세부 기준 (meta.json):</h4>
            <div className="whitespace-pre-line bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300">
              {meta.hidden_badge_criteria}
            </div>
          </div>

          <div className="pt-2 text-slate-400 text-xs">
            데이터 기준일: <span className="text-slate-200 font-semibold">{meta.updated_at}</span> (버전: {meta.version})
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
