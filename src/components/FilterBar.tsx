/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Category, FilterState } from "../types.ts";
import { Filter, SlidersHorizontal, CheckSquare, Square, RotateCcw } from "lucide-react";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  regions: string[];
  sortOrder: "name" | "updated";
  onSortChange: (sort: "name" | "updated") => void;
  activeTab: "main" | "pending";
  onTabChange: (tab: "main" | "pending") => void;
  mainCount: number;
  pendingCount: number;
}

export function FilterBar({
  filters,
  onFilterChange,
  regions,
  sortOrder,
  onSortChange,
  activeTab,
  onTabChange,
  mainCount,
  pendingCount,
}: FilterBarProps) {
  const handleReset = () => {
    onFilterChange({
      sizeClass: "all",
      region: "all",
      hiddenOnly: false,
      verifiedOnly: false,
      category: "all",
      tier: "all",
    });
  };

  const isFiltered =
    filters.sizeClass !== "all" ||
    filters.region !== "all" ||
    filters.hiddenOnly ||
    filters.verifiedOnly ||
    filters.category !== "all" ||
    filters.tier !== "all";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
      {/* Tab Switcher: 기본 목록 vs 검토 대기(규모 미확인) */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange("main")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "main"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            기본 기업 목록 ({mainCount})
          </button>
          <button
            type="button"
            onClick={() => onTabChange("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "pending"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="공식 출처 근거가 없어 규모 구분이 확인되지 않은 기업 목록입니다"
          >
            검토 대기 ({pendingCount})
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>정렬:</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as "name" | "updated")}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="name">가나다순 (이름순)</option>
            <option value="updated">최근 업데이트순</option>
          </select>
        </div>
      </div>

      {/* Sub Filters */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* 기업 규모 필터 */}
        {activeTab === "main" && (
          <select
            value={filters.sizeClass}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sizeClass: e.target.value as FilterState["sizeClass"],
              })
            }
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">기업 규모 (전체)</option>
            <option value="대기업">대기업</option>
            <option value="중견기업">중견기업</option>
          </select>
        )}

        {/* 티어 필터 */}
        <select
          value={filters.tier}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              tier: e.target.value as FilterState["tier"],
            })
          }
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">공급망 티어 (전체)</option>
          <option value="OEM">완성차 (OEM)</option>
          <option value="1차">1차 부품사</option>
          <option value="2차">2차 부품사</option>
          <option value="3차 이상">3차 이상 협력사</option>
        </select>

        {/* 지역 필터 */}
        <select
          value={filters.region}
          onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">소재지 (전체)</option>
          {regions.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        {/* 숨은 기업만 보기 토글 */}
        <button
          type="button"
          onClick={() =>
            onFilterChange({ ...filters, hiddenOnly: !filters.hiddenOnly })
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            filters.hiddenOnly
              ? "bg-amber-950/60 text-amber-200 border-amber-700"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          {filters.hiddenOnly ? (
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
          <span>숨은 기업만</span>
        </button>

        {/* 검증 완료만 보기 토글 */}
        <button
          type="button"
          onClick={() =>
            onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly })
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            filters.verifiedOnly
              ? "bg-emerald-950/60 text-emerald-200 border-emerald-700"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          {filters.verifiedOnly ? (
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
          <span>검증 완료만</span>
        </button>

        {/* 필터 초기화 */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="ml-auto text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>필터 초기화</span>
          </button>
        )}
      </div>
    </div>
  );
}
