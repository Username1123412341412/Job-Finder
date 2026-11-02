/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertCircle, RefreshCw, Database, FileCode, CheckCircle2 } from "lucide-react";
import { DataFetchResult } from "../dataClient.ts";

interface DataStatusBannerProps {
  dataState: DataFetchResult;
  onRefresh: () => void;
  onOpenLocalPreview: () => void;
  onOpenDataErrors: () => void;
  isRefreshing?: boolean;
}

export function DataStatusBanner({
  dataState,
  onRefresh,
  onOpenLocalPreview,
  onOpenDataErrors,
  isRefreshing = false,
}: DataStatusBannerProps) {
  const { mode, cachedDate, errorMessage, validationErrors } = dataState;

  return (
    <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur text-xs px-3 sm:px-4 py-2">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {mode === "sample_unconfigured" && (
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                저장소 미설정 상태 — 엄격한 사실 검증 원칙에 따라 <strong>가상 샘플 데이터</strong>가
                표시됩니다.
              </span>
            </span>
          )}

          {mode === "cached" && (
            <span className="inline-flex items-center gap-1.5 text-sky-300">
              <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>
                캐시된 데이터 (저장일:{" "}
                {cachedDate ? new Date(cachedDate).toLocaleDateString("ko-KR") : "확인 불가"})
              </span>
            </span>
          )}

          {mode === "github_live" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>GitHub 원격 저장소 최신 동기화 완료</span>
            </span>
          )}

          {mode === "sample_fallback" && (
            <span className="inline-flex items-center gap-1.5 text-rose-300">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>
                저장소 요청 실패 ({errorMessage || "네트워크 오류"}) — 안전 모드로 샘플 표시 중
              </span>
            </span>
          )}

          {mode === "local_preview" && (
            <span className="inline-flex items-center gap-1.5 text-indigo-300 font-medium">
              <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>로컬 JSON 검수 미리보기 모드 (저장되지 않는 임시 렌더링)</span>
            </span>
          )}

          {validationErrors.length > 0 && (
            <button
              onClick={onOpenDataErrors}
              className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors"
            >
              <span>스키마 오류 {validationErrors.length}건</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onOpenLocalPreview}
            className="text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60"
            title="로컬 JSON 파일을 업로드하여 스키마 검증 및 미리보기"
          >
            로컬 JSON 검수
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50"
            title="원격 저장소에서 데이터 다시 불러오기"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>새로고침</span>
          </button>
        </div>
      </div>
    </div>
  );
}
