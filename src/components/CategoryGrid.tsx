/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Category, Company, MetaInfo } from "../types.ts";
import {
  Car,
  Layers,
  Cpu,
  Boxes,
  Wrench,
  Navigation,
  GitFork,
  ArrowRight,
} from "lucide-react";

interface CategoryGridProps {
  companies: Company[];
  meta: MetaInfo;
  onSelectCategory: (cat: Category) => void;
  selectedCategory?: Category | "all";
}

const CATEGORY_ITEMS: {
  category: Category;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}[] = [
  { category: "완성차", icon: Car, accentColor: "text-blue-400 group-hover:text-blue-300" },
  { category: "1차 부품사", icon: Layers, accentColor: "text-sky-400 group-hover:text-sky-300" },
  { category: "2차 부품사", icon: GitFork, accentColor: "text-cyan-400 group-hover:text-cyan-300" },
  { category: "전장·SW", icon: Cpu, accentColor: "text-indigo-400 group-hover:text-indigo-300" },
  { category: "소재", icon: Boxes, accentColor: "text-amber-400 group-hover:text-amber-300" },
  { category: "정비·서비스", icon: Wrench, accentColor: "text-emerald-400 group-hover:text-emerald-300" },
  { category: "모빌리티", icon: Navigation, accentColor: "text-purple-400 group-hover:text-purple-300" },
];

export function CategoryGrid({
  companies,
  meta,
  onSelectCategory,
  selectedCategory,
}: CategoryGridProps) {
  // Count companies per category (only those with verified size_class or count all verified/sample)
  const getCategoryCount = (cat: Category) => {
    return companies.filter((c) => c.categories.includes(cat)).length;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
          7대 산업 분야별 탐색
        </h2>
        <span className="text-xs text-slate-400">
          총 {companies.length}개 기업 등록
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {CATEGORY_ITEMS.map(({ category, icon: Icon, accentColor }) => {
          const count = getCategoryCount(category);
          const definition =
            meta.category_definitions[category] || "자동차 부품 및 공급망 분류";
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`group text-left p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[120px] ${
                isSelected
                  ? "bg-slate-800/90 border-sky-500 shadow-md ring-1 ring-sky-500/50"
                  : "bg-slate-900/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/60">
                      <Icon className={`w-4 h-4 ${accentColor}`} />
                    </div>
                    <span className="font-bold text-sm text-slate-100 group-hover:text-sky-300 transition-colors">
                      {category}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-md ${
                      count > 0
                        ? "bg-slate-800 text-sky-400 border border-slate-700"
                        : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    {count > 0 ? `${count}개사` : "0개"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {definition}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-slate-300">
                <span>{count === 0 ? "아직 등록된 기업이 없습니다" : "목록 보기"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
