/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Company } from "../types.ts";
import { Building2, ArrowRight, Layers, CheckCircle2, AlertTriangle } from "lucide-react";
import { CompanyCard } from "./CompanyCard.tsx";

interface ExploreFromCustomerProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

export function ExploreFromCustomer({
  companies,
  onSelectCompany,
}: ExploreFromCustomerProps) {
  // Extract all unique customers from companies data
  const customerMap = new Map<string, { total: number; confirmed: number; estimated: number }>();

  companies.forEach((company) => {
    company.customers.forEach((c) => {
      const existing = customerMap.get(c.name) || { total: 0, confirmed: 0, estimated: 0 };
      existing.total += 1;
      if (c.status === "confirmed") existing.confirmed += 1;
      else existing.estimated += 1;
      customerMap.set(c.name, existing);
    });
  });

  const customerList = Array.from(customerMap.entries()).sort(
    (a, b) => b[1].total - a[1].total
  );

  const [selectedCustomer, setSelectedCustomer] = useState<string>(
    customerList[0]?.[0] || ""
  );

  // Filter suppliers that have this customer
  const suppliers = selectedCustomer
    ? companies.filter((c) =>
        c.customers.some((cust) => cust.name === selectedCustomer)
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              아는 회사(완성차·1차 고객사)에서 출발하기
            </h2>
            <p className="text-xs text-slate-400">
              우리가 잘 아는 완성차 및 대형 고객사를 고르면, 그곳에 납품하는 B2B 협력사를 확인합니다.
            </p>
          </div>
        </div>

        {/* Customer Buttons */}
        {customerList.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            {customerList.map(([name, stats]) => {
              const isSelected = selectedCustomer === name;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedCustomer(name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-500 shadow-md"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>{name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-blue-800 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    협력사 {stats.total}개
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            현재 데이터에 등록된 납품처 정보가 없습니다.
          </div>
        )}
      </div>

      {/* Suppliers List for Selected Customer */}
      {selectedCustomer && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-200">
              <span className="text-blue-400 font-extrabold">{selectedCustomer}</span> 납품 부품사 목록 ({suppliers.length}개사)
            </h3>
            <span className="text-xs text-slate-400">
              데이터 기준일 및 출처 기반
            </span>
          </div>

          {suppliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suppliers.map((company) => {
                const customerRelation = company.customers.find(
                  (c) => c.name === selectedCustomer
                );
                return (
                  <div key={company.id} className="relative">
                    <CompanyCard
                      company={company}
                      onSelect={onSelectCompany}
                      matches={[
                        {
                          field: "납품처",
                          matchedText: `${selectedCustomer} (${
                            customerRelation?.status === "confirmed" ? "확인됨" : "추정"
                          })`,
                        },
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-xs text-slate-400">
              해당 고객사에 납품하는 것으로 등록된 기업이 아직 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
