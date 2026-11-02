/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, ArrowRight, Building, Tag, Wrench } from "lucide-react";
import { Company, KeywordEntry, SearchScope } from "../types.ts";
import { getAutocompleteSuggestions } from "../search.ts";
import { SearchScopeSelect } from "./SearchScopeSelect.tsx";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (query: string) => void;
  scope: SearchScope;
  onScopeChange: (scope: SearchScope) => void;
  companies: Company[];
  keywordsDict: KeywordEntry[];
}

const RECENT_SEARCHES_KEY = "auto_b2b_recent_searches_v1";

export function SearchBar({
  value,
  onChange,
  onSubmit,
  scope,
  onScopeChange,
  companies,
  keywordsDict,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    try {
      const filtered = [clean, ...recentSearches.filter((s) => s !== clean)].slice(0, 5);
      setRecentSearches(filtered);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    try {
      const filtered = recentSearches.filter((s) => s !== term);
      setRecentSearches(filtered);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleSelectQuery = (term: string) => {
    onChange(term);
    saveRecentSearch(term);
    setIsOpen(false);
    onSubmit(term);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      saveRecentSearch(value.trim());
      setIsOpen(false);
      onSubmit(value.trim());
    }
  };

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = value.trim()
    ? getAutocompleteSuggestions(value, companies, keywordsDict)
    : [];

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <SearchScopeSelect value={scope} onChange={onScopeChange} />

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="기업명, 제품/부품, 기술 키워드 검색..."
            aria-label="자동차 B2B 기업 키워드 검색창"
            className="w-full h-11 pl-10 pr-9 bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-sky-500 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(true);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              aria-label="검색어 지우기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="h-11 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          검색
        </button>
      </form>

      {/* Autocomplete / Recent Searches Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-sky-400" />
                <span>데이터 일치 제안</span>
              </div>
              <div className="space-y-0.5">
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.text}-${idx}`}
                    type="button"
                    onClick={() => handleSelectQuery(item.text)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-200 hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {item.type === "company" && <Building className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      {item.type === "keyword" && <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {item.type === "product" && <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      <span className="truncate group-hover:text-white">{item.text}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                      {item.type === "company" ? "기업" : item.type === "keyword" ? "키워드" : "부품"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 bg-slate-900/60">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>최근 검색어</span>
                </span>
                <button
                  type="button"
                  onClick={clearAllRecent}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  모두 삭제
                </button>
              </div>
              <div className="space-y-0.5">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    onClick={() => handleSelectQuery(term)}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs sm:text-sm text-slate-300 hover:bg-slate-800 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate group-hover:text-white">{term}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(e, term)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors rounded"
                      aria-label={`${term} 최근 검색어 삭제`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.length === 0 && !value.trim() && recentSearches.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-400">
              검색어를 입력하면 데이터에 존재하는 기업, 제품 및 키워드를 제안합니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
