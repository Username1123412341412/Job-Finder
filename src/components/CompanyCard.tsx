/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Company, SearchMatchDetail } from "../types.ts";
import {
  VerifiedBadge,
  HiddenChampionBadge,
  SampleDataBadge,
  EstimatedBadge,
  ConfirmedBadge,
  OutdatedBadge,
} from "./Badges.tsx";
import { ChevronRight, Building2, MapPin, Layers, Users, Wrench } from "lucide-react";

interface CompanyCardProps {
  company: Company;
  matches?: SearchMatchDetail[];
  onSelect: (company: Company) => void;
}

export function CompanyCard({ company, matches, onSelect }: CompanyCardProps) {
  // Check 1차 or 2차 tier evidence
  const primaryTier = company.tiers.find(
    (t) => t.level === "1차" || t.level === "2차" || t.level === "OEM"
  ) || company.tiers[0];

  return (
    <div
      onClick={() => onSelect(company)}
      className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Top: Name and Badges */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
              {company.name}
            </h3>

            {/* Quiet unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
              <span>{company.categories.join(", ")}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span>{company.size_class ? company.size_class.value : "규모 확인 불가"}</span>
              {company.region && (
                <>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{company.region.value}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Badges cluster */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
            {company.is_sample && <SampleDataBadge />}
            {company.hidden_badge && (
              <HiddenChampionBadge reason={company.hidden_badge_reason} />
            )}
            {company.verified && <VerifiedBadge />}
          </div>
        </div>

        {/* Search Match Highlights */}
        {matches && matches.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-sky-950/40 border border-sky-800/40 flex flex-wrap gap-1.5 items-center text-[11px]">
            <span className="text-sky-300 font-semibold">검색 일치:</span>
            {matches.map((m, idx) => (
              <span
                key={idx}
                className="bg-sky-900/60 text-sky-200 px-2 py-0.5 rounded text-[10px]"
              >
                {m.field} {m.viaKeyword ? `(관련어: ${m.viaKeyword})` : `("${m.matchedText}")`}
              </span>
            ))}
          </div>
        )}

        {/* One Line Summary */}
        {company.one_line_summary ? (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 line-clamp-2">
            {company.one_line_summary.value}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-3">확인된 기업 요약 없음</p>
        )}

        {/* Tier / Supply Chain Position with Evidence */}
        {primaryTier && (
          <div className="mb-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>공급망 위치: {primaryTier.level} 협력사</span>
              </span>
              {primaryTier.status === "confirmed" ? (
                <ConfirmedBadge />
              ) : (
                <EstimatedBadge evidence={primaryTier.evidence} />
              )}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              근거: {primaryTier.evidence}
            </p>
          </div>
        )}

        {/* Key Customers & Products preview */}
        <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800/60">
          {company.customers.length > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 shrink-0 text-[11px]">주요 납품처:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {company.customers.slice(0, 3).map((cust, i) => (
                  <span key={i} className="text-slate-300 font-medium">
                    {cust.name}
                    {cust.status === "estimated" && (
                      <span className="text-amber-400 text-[10px] ml-0.5">(추정)</span>
                    )}
                    {i < Math.min(company.customers.length, 3) - 1 ? ", " : ""}
                  </span>
                ))}
                {company.customers.length > 3 && (
                  <span className="text-[10px] text-slate-400">
                    외 {company.customers.length - 3}곳
                  </span>
                )}
              </div>
            </div>
          )}

          {company.products.length > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 shrink-0 text-[11px]">대표 제품:</span>
              <span className="text-slate-300 truncate">
                {company.products.map((p) => p.name).slice(0, 2).join(", ")}
                {company.products.length > 2 ? ` 외 ${company.products.length - 2}개` : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Detail Link */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 group-hover:text-sky-300">
        <span className="text-[11px] text-slate-400">
          기준 갱신: {company.updated_at}
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <span>상세 정보 및 출처 확인</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
