/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2, Sparkles, TestTube2, AlertTriangle, HelpCircle, ExternalLink } from "lucide-react";
import { isDateOlderThan6Months } from "../dataClient.ts";

export function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-md"
      title="운영진이 공시 및 출처 자료를 교차 확인한 정보입니다"
    >
      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
      <span>검증 완료</span>
    </span>
  );
}

export function HiddenChampionBadge({ reason }: { reason?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/50 border border-amber-700/60 px-2 py-0.5 rounded-md"
      title={reason || "운영진 기준에 따라 선정된 B2B 숨은 강자 기업"}
    >
      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
      <span>숨은 기업</span>
    </span>
  );
}

export function SampleDataBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-950/50 border border-purple-700/60 px-2 py-0.5 rounded-md"
      title="실제 기업 정보가 아닌 시연용 가상 샘플 데이터입니다"
    >
      <TestTube2 className="w-3 h-3 text-purple-400 shrink-0" />
      <span>샘플 데이터</span>
    </span>
  );
}

export function EstimatedBadge({ evidence }: { evidence?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/70 px-2 py-0.5 rounded-md"
      title={evidence ? `추정 근거: ${evidence}` : "공식 직납 공시가 아닌 보도자료/정황 기반 추정치입니다"}
    >
      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
      <span>추정</span>
    </span>
  );
}

export function ConfirmedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300 bg-blue-950/40 border border-blue-800/60 px-2 py-0.5 rounded-md">
      <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
      <span>확인됨</span>
    </span>
  );
}

export function OutdatedBadge({ date }: { date: string }) {
  if (!isDateOlderThan6Months(date)) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-300 bg-rose-950/40 border border-rose-800/60 px-1.5 py-0.5 rounded"
      title={`기준일(${date})로부터 6개월 이상 경과한 정보입니다. 최신 여부를 공식 채널에서 확인하세요.`}
    >
      <AlertTriangle className="w-2.5 h-2.5 text-rose-400 shrink-0" />
      <span>오래된 정보 ({date})</span>
    </span>
  );
}

export function NoDataNotice({ label = "확인된 정보 없음" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 italic">
      <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export function SourceLinkButton({
  url,
  date,
  label = "출처",
}: {
  url?: string;
  date?: string;
  label?: string;
}) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-400 transition-colors bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 px-1.5 py-0.5 rounded"
      title={`출처 링크 열기 (기준일: ${date || "미기재"})`}
      onClick={(e) => e.stopPropagation()}
    >
      <span>{label}</span>
      {date && <span className="text-[10px] text-slate-400">· {date}</span>}
      <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
    </a>
  );
}
