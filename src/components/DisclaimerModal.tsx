/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MetaInfo } from "../types.ts";
import { X, ShieldAlert, FileText, ExternalLink, GitBranch } from "lucide-react";
import { GITHUB_CONFIG, isGitHubConfigured } from "../config.ts";

interface DisclaimerModalProps {
  meta: MetaInfo;
  onClose: () => void;
}

export function DisclaimerModal({ meta, onClose }: DisclaimerModalProps) {
  const repoUrl = isGitHubConfigured()
    ? `https://github.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <h3 className="text-base sm:text-lg text-white">서비스 안내 및 법적 면책</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200">
            <strong className="text-white block mb-1 text-sm">공식 면책 고지:</strong>
            <p className="leading-relaxed text-xs sm:text-sm">{meta.disclaimer}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">서비스 핵심 운영 방침</h4>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-400">
              <li>취업준비생의 시야를 넓히기 위한 순수 비영리 읽기 전용 정보 제공 목적입니다.</li>
              <li>중소기업은 수록하지 않으며, 공식 근거가 있는 대기업·중견기업만 확정 수록합니다.</li>
              <li>근거가 불충분한 기업은 기본 목록에서 제외하고 '검토 대기' 탭에만 분리 보관합니다.</li>
              <li>채용공고를 자체 수집하지 않으며 공식 채용 페이지 링크로만 직결합니다.</li>
              <li>6개월 이상 경과한 출처 정보에는 '오래된 정보' 경고 배지를 자동 부착합니다.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">데이터 버전:</span>
              <span className="font-mono text-slate-200">{meta.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">최종 데이터 갱신일:</span>
              <span className="text-slate-200 font-semibold">{meta.updated_at}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-700/40">
              <span className="text-slate-400">데이터 저장소:</span>
              {repoUrl ? (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>{GITHUB_CONFIG.OWNER}/{GITHUB_CONFIG.REPO}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-amber-400 font-medium">저장소 미연동 (config.ts TODO)</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
