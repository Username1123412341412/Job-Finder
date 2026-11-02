/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Company, KeywordEntry } from "../types.ts";
import { Wrench, Tag, ArrowRight } from "lucide-react";
import { CompanyCard } from "./CompanyCard.tsx";

interface ExploreFromProductProps {
  companies: Company[];
  keywordsDict: KeywordEntry[];
  onSelectCompany: (company: Company) => void;
  onSearchKeyword: (kw: string) => void;
}

export function ExploreFromProduct({
  companies,
  keywordsDict,
  onSelectCompany,
  onSearchKeyword,
}: ExploreFromProductProps) {
  // Aggregate all unique products with companies
  const productList: { name: string; easy_description: string; companyName: string; company: Company }[] = [];
  companies.forEach((company) => {
    company.products.forEach((prod) => {
      productList.push({
        name: prod.name,
        easy_description: prod.easy_description,
        companyName: company.name,
        company,
      });
    });
  });

  const [activeTab, setActiveTab] = useState<"products" | "keywords">("products");

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              부품 및 기술 키워드에서 출발하기
            </h2>
            <p className="text-xs text-slate-400">
              관심 있는 부품명이나 공정 기술을 선택해 해당 영역을 제조하는 강소 기업을 찾습니다.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === "products"
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            등록 부품 목록 ({productList.length}건)
          </button>
          <button
            onClick={() => setActiveTab("keywords")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === "keywords"
                ? "bg-indigo-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            기술 및 부품 사전 키워드 ({keywordsDict.length}개)
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === "products" ? (
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-200">
            실제 제조 부품 및 쉬운 설명
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCompany(item.company)}
                className="group p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-600/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {item.companyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.easy_description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 group-hover:text-emerald-300">
                  <span>제조사 상세 및 출처 보기</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-200">
            키워드 사전 (클릭 시 해당 분야의 기업 검색)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {keywordsDict.map((k) => (
              <div
                key={k.keyword}
                onClick={() => onSearchKeyword(k.keyword)}
                className="group p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-600/60 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-sm text-white group-hover:text-indigo-300">
                      {k.keyword}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {k.aliases.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-400">동의어: </span>
                    <span>{k.aliases.join(", ")}</span>
                  </div>
                )}

                {k.related_terms.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-400">관련 기술: </span>
                    <span>{k.related_terms.slice(0, 4).join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
