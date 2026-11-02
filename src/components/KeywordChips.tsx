/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles } from "lucide-react";

interface KeywordChipsProps {
  onSelectKeyword: (kw: string) => void;
  selectedKeyword?: string;
}

const RECOMMENDED_CHIPS = ["자율주행", "배터리", "도장", "시트", "램프", "변속기"];

export function KeywordChips({ onSelectKeyword, selectedKeyword }: KeywordChipsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>추천 탐색 키워드 (편의용 바로가기 · 등록 현황에 따라 결과가 없을 수 있습니다)</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {RECOMMENDED_CHIPS.map((chip) => {
          const isSelected = selectedKeyword === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => onSelectKeyword(chip)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isSelected
                  ? "bg-sky-950/80 text-sky-200 border-sky-600 shadow-sm"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              #{chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}
