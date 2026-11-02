/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SearchScope } from "../types.ts";

interface SearchScopeSelectProps {
  value: SearchScope;
  onChange: (scope: SearchScope) => void;
}

const SCOPE_OPTIONS: { label: string; value: SearchScope }[] = [
  { label: "전체", value: "all" },
  { label: "기업명", value: "name" },
  { label: "제품·부품", value: "product" },
  { label: "기술 키워드", value: "tech_keyword" },
  { label: "납품처", value: "customer" },
  { label: "지역", value: "region" },
  { label: "직무", value: "job_role" },
];

export function SearchScopeSelect({ value, onChange }: SearchScopeSelectProps) {
  return (
    <div className="relative shrink-0">
      <label htmlFor="search-scope-select" className="sr-only">
        검색 대상 분야
      </label>
      <select
        id="search-scope-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SearchScope)}
        className="h-11 px-3 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none pr-8 cursor-pointer transition-colors"
      >
        {SCOPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200 py-1">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
