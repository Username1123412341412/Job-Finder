/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Copy, Check, GitPullRequestDraft, ExternalLink } from "lucide-react";
import { Company } from "../types.ts";
import { GITHUB_CONFIG, isGitHubConfigured, getGitHubNewIssueUrl } from "../config.ts";

interface SuggestEditModalProps {
  company: Company;
  onClose: () => void;
}

export function SuggestEditModal({ company, onClose }: SuggestEditModalProps) {
  const [copied, setCopied] = useState(false);

  const issueTitle = `[정보 수정 제안] ${company.name}`;
  const issueBody = [
    `### 🏢 대상 기업명: ${company.name} (ID: ${company.id})`,
    `### ✏️ 수정/보완 요청 항목: (예: 매출액, 주요 고객사 납품 관계, 티어 변경, 신규 부품 추가 등)`,
    `### 🔗 공식 출처 URL (필수): https://...`,
    `### 📅 출처 기준일 (필수): YYYY-MM-DD`,
    `### 📝 수정 제안 상세 내용:`,
    `- 변경 전: `,
    `- 변경 후: `,
    `### 💡 확인 근거 문구 (공시 원문 또는 보도자료 핵심 인용):`,
    `> `,
    `---`,
    `*본 제안은 '숨은 강자 - 자동차 B2B 기업 탐험' 웹앱을 통해 작성되었습니다.*`,
  ].join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(`${issueTitle}\n\n${issueBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const configured = isGitHubConfigured();
  const directIssueUrl = configured
    ? getGitHubNewIssueUrl({ companyName: company.name })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <GitPullRequestDraft className="w-5 h-5" />
            <h3 className="text-base sm:text-lg text-white">정보 수정 제안 템플릿</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-800/40 text-sky-200 text-xs leading-relaxed">
            모든 사실 정보는 <strong>공식 출처 URL</strong>과 <strong>기준일</strong>이 검증된 경우에만
            반영됩니다. GitHub Issue로 템플릿을 등록해 주시면 운영진이 확인 후 데이터 저장소에 반영합니다.
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400">
                이슈 제목 및 본문 템플릿:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>템플릿 복사</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {issueTitle}
              {"\n\n"}
              {issueBody}
            </pre>
          </div>

          {!configured && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/50 text-xs text-amber-300">
              현재 저장소 정보(<code>config.ts</code>의 <code>OWNER</code>, <code>REPO</code>)가
              TODO 상태입니다. 저장소 개설 후 해당 GitHub의 Issues 탭에 위 템플릿으로 작성하시면 됩니다.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            닫기
          </button>

          {directIssueUrl ? (
            <a
              href={directIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <span>GitHub 이슈 작성 페이지로 이동</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>템플릿 복사하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
