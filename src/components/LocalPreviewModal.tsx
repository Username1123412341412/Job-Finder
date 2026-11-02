/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Upload, FileCode, AlertOctagon, CheckCircle2, RotateCcw } from "lucide-react";
import { DataValidationError } from "../types.ts";
import { parseLocalJsonPreview } from "../dataClient.ts";
import { GITHUB_CONFIG, isGitHubConfigured } from "../config.ts";

interface LocalPreviewModalProps {
  validationErrors: DataValidationError[];
  onApplyLocalData: (result: ReturnType<typeof parseLocalJsonPreview>) => void;
  onResetToDefault: () => void;
  onClose: () => void;
  isLocalMode: boolean;
}

export function LocalPreviewModal({
  validationErrors,
  onApplyLocalData,
  onResetToDefault,
  onClose,
  isLocalMode,
}: LocalPreviewModalProps) {
  const [tab, setTab] = useState<"upload" | "errors" | "config">("upload");
  const [jsonText, setJsonText] = useState("");
  const [parseStatus, setParseStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        const parsed = JSON.parse(text);
        const result = parseLocalJsonPreview(parsed);
        onApplyLocalData(result);
        setParseStatus(
          `성공: 유효한 기업 ${result.companies.length}건 불러옴 (오류 ${result.validationErrors.length}건)`
        );
      } catch (err) {
        setParseStatus(`파싱 실패: ${err instanceof Error ? err.message : "JSON 형식 오류"}`);
      }
    };
    reader.readAsText(file);
  };

  const handleTextApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const result = parseLocalJsonPreview(parsed);
      onApplyLocalData(result);
      setParseStatus(
        `성공: 유효한 기업 ${result.companies.length}건 적용됨 (오류 ${result.validationErrors.length}건)`
      );
    } catch (err) {
      setParseStatus(`파싱 실패: ${err instanceof Error ? err.message : "JSON 문법 오류"}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <FileCode className="w-5 h-5" />
            <h3 className="text-base sm:text-lg text-white">
              데이터 검수 및 로컬 JSON 미리보기
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800 shrink-0 text-xs">
          <button
            onClick={() => setTab("upload")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              tab === "upload"
                ? "bg-indigo-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            로컬 JSON 파일 업로드
          </button>
          <button
            onClick={() => setTab("errors")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              tab === "errors"
                ? "bg-rose-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>검증 실패 오류 목록 ({validationErrors.length})</span>
          </button>
          <button
            onClick={() => setTab("config")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              tab === "config"
                ? "bg-slate-700 text-white"
                : "bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            저장소 설정 상태
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-slate-300">
          {tab === "upload" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200 text-xs leading-relaxed">
                운영자 및 데이터 기여자를 위한 검수 기능입니다. 작성한 <code>companies.json</code>을
                선택하면 서버에 전송이나 저장 없이 브라우저 메모리상에서 즉시 렌더링하여 데이터
                구조와 출처 표기를 검토할 수 있습니다.
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-200 mb-1">
                  companies.json 파일 선택
                </p>
                <p className="text-xs text-slate-400 mb-3">
                  (JSON 형식, 스키마 검증 자동 수행)
                </p>
                <label className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer transition-colors shadow">
                  <span>내 컴퓨터에서 파일 열기</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  또는 JSON 텍스트 직접 붙여넣기:
                </label>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder="[ { id: '...', name: '...', categories: [...] } ]"
                  className="w-full h-32 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleTextApply}
                  disabled={!jsonText.trim()}
                  className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl"
                >
                  입력된 JSON 즉시 적용
                </button>
              </div>

              {parseStatus && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-sky-300">
                  {parseStatus}
                </div>
              )}

              {isLocalMode && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-300">
                    현재 로컬 미리보기 모드가 활성화되어 있습니다.
                  </span>
                  <button
                    onClick={onResetToDefault}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>기본 데이터로 되돌리기</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "errors" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Zod 스키마 검증(출처 URL 누락, 잘못된 날짜 형식, 필수 필드 결측 등)에 실패한
                레코드입니다. 오류 레코드는 화면에 렌더링되지 않고 이곳에 격리됩니다.
              </p>

              {validationErrors.length > 0 ? (
                <div className="space-y-3">
                  {validationErrors.map((err, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-xs text-rose-300">
                        <span>
                          [{err.index + 1}번 레코드] {err.name || "기업명 없음"}{" "}
                          {err.id ? `(${err.id})` : ""}
                        </span>
                        <span className="text-[10px] bg-rose-900/60 px-1.5 py-0.5 rounded text-rose-200">
                          {err.issues.length}개 규칙 위반
                        </span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-200/90 font-mono">
                        {err.issues.map((issue, j) => (
                          <li key={j}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="text-xs font-semibold">
                    검증 실패 데이터 오류가 없습니다. 모든 레코드가 스키마를 만족합니다.
                  </span>
                </div>
              )}
            </div>
          )}

          {tab === "config" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">
                  현재 GitHub 원격 설정 (src/config.ts):
                </span>
                <div className="font-mono text-xs text-slate-300 space-y-1 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>OWNER: {GITHUB_CONFIG.OWNER || '"" (미설정 - TODO)'}</div>
                  <div>REPO: {GITHUB_CONFIG.REPO || '"" (미설정 - TODO)'}</div>
                  <div>BRANCH: "{GITHUB_CONFIG.BRANCH}"</div>
                  <div>DATA_PATH: "{GITHUB_CONFIG.DATA_PATH}"</div>
                </div>
                <div className="text-xs text-slate-400 pt-1">
                  상태:{" "}
                  {isGitHubConfigured() ? (
                    <span className="text-emerald-400 font-semibold">
                      연동 활성화됨 (raw.githubusercontent.com 자동 호출)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold">
                      비워 둠 (TODO) — 안전하게 가상 샘플 데이터 모드로 동작
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed space-y-2">
                <p>
                  <strong>운영 시작 방법:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>GitHub에 새 공개(Public) 저장소를 생성합니다.</li>
                  <li><code>data/companies.json</code>, <code>keywords.json</code>, <code>meta.json</code> 파일을 업로드합니다.</li>
                  <li><code>src/config.ts</code>의 <code>OWNER</code>와 <code>REPO</code> 변수를 저장소 값으로 지정합니다.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
