/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Company, SourcedValue } from "../types.ts";
import {
  VerifiedBadge,
  HiddenChampionBadge,
  SampleDataBadge,
  EstimatedBadge,
  ConfirmedBadge,
  OutdatedBadge,
  NoDataNotice,
  SourceLinkButton,
} from "./Badges.tsx";
import { getGitHubNewIssueUrl, isGitHubConfigured } from "../config.ts";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Briefcase,
  Layers,
  Wrench,
  Cpu,
  ExternalLink,
  ShieldAlert,
  GitPullRequestDraft,
  Search,
} from "lucide-react";

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
  onOpenSuggestEditModal: (company: Company) => void;
}

export function CompanyDetail({
  company,
  onBack,
  onOpenSuggestEditModal,
}: CompanyDetailProps) {
  const formatRevenue = (rev?: SourcedValue<number>) => {
    if (!rev || rev.value === undefined || rev.value === null) {
      return null;
    }
    const val = rev.value;
    if (val >= 10000) {
      const jo = Math.floor(val / 10000);
      const uk = val % 10000;
      return uk > 0 ? `${jo}조 ${uk.toLocaleString()}억원` : `${jo}조원`;
    }
    return `${val.toLocaleString()}억원`;
  };

  const handleEditProposal = () => {
    if (isGitHubConfigured()) {
      const url = getGitHubNewIssueUrl({ companyName: company.name });
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      onOpenSuggestEditModal(company);
    }
  };

  const officialCareerLink = company.career_links.find((l) => l.type === "official");
  const autoSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${company.name} 채용`
  )}`;
  const autoSearchNaverUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(
    `${company.name} 채용`
  )}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>목록으로 돌아가기</span>
        </button>

        <button
          onClick={handleEditProposal}
          className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors px-3 py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-950/70 border border-sky-800/60"
        >
          <GitPullRequestDraft className="w-3.5 h-3.5" />
          <span>정보 수정 제안 (GitHub Issue)</span>
        </button>
      </div>

      {/* 1. Header: Name, Badges, Category */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight break-keep">
              {company.name}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-2 flex-wrap">
              <span className="font-semibold text-sky-400">
                {company.categories.join(" · ")}
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span>최종 검토 갱신: {company.updated_at}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {company.is_sample && <SampleDataBadge />}
            {company.hidden_badge && (
              <HiddenChampionBadge reason={company.hidden_badge_reason} />
            )}
            {company.verified && <VerifiedBadge />}
          </div>
        </div>

        {/* Hidden Champion Reason Callout if applicable */}
        {company.hidden_badge && company.hidden_badge_reason && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-300 block mb-1">
              ✨ 숨은 강자 선정 사유 (운영진 검토 근거):
            </span>
            {company.hidden_badge_reason}
          </div>
        )}

        {/* 2. One-Line Summary */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            기업 요약
          </span>
          {company.one_line_summary ? (
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {company.one_line_summary.value}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <OutdatedBadge date={company.one_line_summary.source_date} />
                <SourceLinkButton
                  url={company.one_line_summary.source_url}
                  date={company.one_line_summary.source_date}
                />
              </div>
            </div>
          ) : (
            <NoDataNotice />
          )}
        </div>
      </div>

      {/* 3. Supply Chain Position (Tier Visualization) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              공급망 공급 위치 (Tier 구조)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            총 {company.tiers.length}개 공급망 관계
          </span>
        </div>

        {company.tiers.length > 0 ? (
          <div className="space-y-3">
            {company.tiers.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-sky-300">
                      {t.level} 협력사 위치
                    </span>
                    {t.status === "confirmed" ? (
                      <ConfirmedBadge />
                    ) : (
                      <EstimatedBadge evidence={t.evidence} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <OutdatedBadge date={t.source_date} />
                    <SourceLinkButton url={t.source_url} date={t.source_date} />
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  <strong className="text-slate-400 block mb-0.5">판단 근거:</strong>
                  {t.evidence}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoDataNotice label="확인된 공급망 위치 정보 없음" />
        )}
      </div>

      {/* 4. Key Customers (납품처) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              주요 납품처 및 고객사
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {company.customers.length}개사 연계
          </span>
        </div>

        {company.customers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {company.customers.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">
                      {c.name}
                    </span>
                    {c.status === "confirmed" ? (
                      <ConfirmedBadge />
                    ) : (
                      <EstimatedBadge />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <OutdatedBadge date={c.source_date} />
                  <SourceLinkButton url={c.source_url} date={c.source_date} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoDataNotice label="확인된 납품처 정보 없음" />
        )}
      </div>

      {/* 5. Key Products with Easy Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Wrench className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              주요 부품 및 제품 (쉬운 설명)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {company.products.length}건
          </span>
        </div>

        {company.products.length > 0 ? (
          <div className="space-y-3">
            {company.products.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-sm text-emerald-300">
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <OutdatedBadge date={p.source_date} />
                    <SourceLinkButton url={p.source_url} date={p.source_date} />
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {p.easy_description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <NoDataNotice label="확인된 제품 정보 없음" />
        )}
      </div>

      {/* 6. Tech Keywords */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              기술 및 공정 키워드
            </h2>
          </div>
          {company.tech_keywords && (
            <div className="flex items-center gap-2">
              <OutdatedBadge date={company.tech_keywords.source_date} />
              <SourceLinkButton
                url={company.tech_keywords.source_url}
                date={company.tech_keywords.source_date}
              />
            </div>
          )}
        </div>

        {company.tech_keywords && company.tech_keywords.value.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {company.tech_keywords.value.map((kw, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/50 text-indigo-200 border border-indigo-800/60 text-xs font-medium"
              >
                #{kw}
              </span>
            ))}
          </div>
        ) : (
          <NoDataNotice label="확인된 기술 키워드 정보 없음" />
        )}
      </div>

      {/* 7. Basic Corporate Info (규모, 소재지, 설립연도, 직원 수, 매출) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300">
            <Building2 className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            기업 기본 재무 및 현황 (공식 출처 필수)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 기업 규모 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">규모 구분</span>
            <div className="my-1.5">
              {company.size_class ? (
                <span className="text-base font-bold text-white">
                  {company.size_class.value}
                </span>
              ) : (
                <NoDataNotice label="규모 구분 확인 불가" />
              )}
            </div>
            {company.size_class && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                <OutdatedBadge date={company.size_class.source_date} />
                <SourceLinkButton
                  url={company.size_class.source_url}
                  date={company.size_class.source_date}
                />
              </div>
            )}
          </div>

          {/* 매출액 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">연간 매출액</span>
            <div className="my-1.5">
              {company.revenue_krw_100m ? (
                <span className="text-base font-bold text-emerald-400 tabular-nums">
                  {formatRevenue(company.revenue_krw_100m)}
                </span>
              ) : (
                <NoDataNotice />
              )}
            </div>
            {company.revenue_krw_100m && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                <OutdatedBadge date={company.revenue_krw_100m.source_date} />
                <SourceLinkButton
                  url={company.revenue_krw_100m.source_url}
                  date={company.revenue_krw_100m.source_date}
                />
              </div>
            )}
          </div>

          {/* 직원 수 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">임직원 수</span>
            <div className="my-1.5">
              {company.employee_count ? (
                <span className="text-base font-bold text-white tabular-nums">
                  {company.employee_count.value.toLocaleString()}명
                </span>
              ) : (
                <NoDataNotice />
              )}
            </div>
            {company.employee_count && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                <OutdatedBadge date={company.employee_count.source_date} />
                <SourceLinkButton
                  url={company.employee_count.source_url}
                  date={company.employee_count.source_date}
                />
              </div>
            )}
          </div>

          {/* 설립연도 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">설립 연도</span>
            <div className="my-1.5">
              {company.founded_year ? (
                <span className="text-base font-bold text-white tabular-nums">
                  {company.founded_year.value}년
                </span>
              ) : (
                <NoDataNotice />
              )}
            </div>
            {company.founded_year && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                <OutdatedBadge date={company.founded_year.source_date} />
                <SourceLinkButton
                  url={company.founded_year.source_url}
                  date={company.founded_year.source_date}
                />
              </div>
            )}
          </div>

          {/* 본사 소재지 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between sm:col-span-2">
            <span className="text-[11px] text-slate-400 font-medium">본사 소재지</span>
            <div className="my-1.5">
              {company.region ? (
                <span className="text-base font-bold text-white">
                  {company.region.value}
                </span>
              ) : (
                <NoDataNotice />
              )}
            </div>
            {company.region && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                <OutdatedBadge date={company.region.source_date} />
                <SourceLinkButton
                  url={company.region.source_url}
                  date={company.region.source_date}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 8. Job Roles */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              주요 채용 직무 유형
            </h2>
          </div>
          {company.job_roles && (
            <div className="flex items-center gap-2">
              <OutdatedBadge date={company.job_roles.source_date} />
              <SourceLinkButton
                url={company.job_roles.source_url}
                date={company.job_roles.source_date}
              />
            </div>
          )}
        </div>

        {company.job_roles && company.job_roles.value.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {company.job_roles.value.map((role, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        ) : (
          <NoDataNotice label="확인된 직무 정보 없음" />
        )}
      </div>

      {/* 9. Overall Sources List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
          <ShieldAlert className="w-4 h-4 text-sky-400" />
          <span>정보 출처 및 데이터 검증 안내</span>
        </div>
        <p className="leading-relaxed">
          본 화면에 표기된 모든 사실 정보는 공식 공시, 사업보고서 및 기업 공개 채널의 출처를
          기반으로 합니다. 출처 URL 및 기준일이 없는 정보는 일체 표시하지 않고 [확인된 정보 없음]으로
          표기합니다.
        </p>
      </div>

      {/* 10. Suggest Edit Button */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white">정보 수정 또는 최신 내용 제안</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            기업 정보 오류를 발견하셨거나 새로운 공식 출처가 있다면 누구나 GitHub Issue를 통해 수정을 제안할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleEditProposal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
        >
          <GitPullRequestDraft className="w-4 h-4 text-sky-400" />
          <span>수정 제안하기</span>
        </button>
      </div>

      {/* 11. Career Links at the very bottom (Strict Rule 6 compliance) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-sky-900/80 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block mb-1">
            채용 연계 안내 (직접 수집하지 않으며 공식 채널로만 연결합니다)
          </span>
          <h3 className="text-lg font-bold text-white">
            {company.name} 채용 정보 바로가기
          </h3>
        </div>

        {officialCareerLink ? (
          <div className="space-y-2">
            <a
              href={officialCareerLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30 transition-all"
            >
              <span>기업 공식 채용 사이트 이동하기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-slate-400 text-center">
              최종 링크 유효성 확인일: {officialCareerLink.checked_at}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
              <strong className="text-slate-300 block mb-1">
                공식 채용 페이지 정보 없음
              </strong>
              데이터베이스에 등록된 공식 채용 URL이 없습니다. 아래의 자동 생성 포털 검색 링크를 통해 실시간 공고를 확인하실 수 있습니다.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={autoSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>[자동 생성] Google 채용 검색</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={autoSearchNaverUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>[자동 생성] 네이버 채용 검색</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
