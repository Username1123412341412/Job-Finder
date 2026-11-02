/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Layers, HelpCircle, ArrowDown } from "lucide-react";

export function EducationalDiagram() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              취준생을 위한 상식: "n차 벤더(Tier)가 뭔가요?"
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              자동차 공급망(Supply Chain)의 계층 구조와 직납의 의미 이해하기
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={isExpanded}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            자동차 한 대에는 약 3만 개의 부품이 들어갑니다. 완성차 제조사가 모든 부품을 직접 만들지 않고,
            피라미드 형태의 다단계 공급 협력사 네트워크(Tier System)를 통해 부품을 조달합니다.
          </p>

          {/* Visual Step Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1: 완성차 (OEM) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-900/40 relative">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                최종 생산자
              </span>
              <h4 className="font-extrabold text-white text-sm mb-1.5">
                완성차 (OEM)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                차량 전체 컨셉 기획, 디자인, 엔진/차체 프레스·도장, 최종 의장 조립 및 판매를 담당하는 기업입니다.
              </p>
            </div>

            {/* Step 2: 1차 협력사 (Tier 1) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-900/40 relative">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                직납 부품사
              </span>
              <h4 className="font-extrabold text-white text-sm mb-1.5">
                1차 협력사 (Tier 1)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                샤시, 시트, 제동, 바디제어기 등 서브 부품들을 묶은 <strong>'모듈(Module)'</strong> 단위로
                완성차 공장에 직접 납품(직납)합니다.
              </p>
            </div>

            {/* Step 3: 2차/3차 협력사 (Tier 2/3) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                정밀가공 / 서브부품
              </span>
              <h4 className="font-extrabold text-white text-sm mb-1.5">
                2·3차 협력사 (Tier 2/3)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                1차사에 단조 기어, 모터용 코일, 특수 사출물, 표면 도금 가공품 등을 납품하는 탄탄한 기술력의 B2B 제조사입니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300">
            💡 <strong>취업 팁:</strong> 일반 소비자에게 덜 알려졌어도, 완성차에 직납하는 1차 협력사나 독보적 단품 기술을 가진 2차 협력사는 대기업·알짜 중견기업이 많아 안정성과 성장성이 뛰어납니다.
          </div>
        </div>
      )}
    </div>
  );
}
