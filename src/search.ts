/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, KeywordEntry, SearchMatchDetail, SearchResultItem, SearchScope } from "./types.ts";

/**
 * 한글 초성 추출 유틸리티 (외부 라이브러리 없이 순수 알고리즘 구현)
 */
const CHOSUNG_LIST = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

export function getChosung(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      result += CHOSUNG_LIST[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

/**
 * 문자열 정규화 (공백 제거, 소문자화)
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

/**
 * 부분 일치 또는 초성 일치 검사
 */
export function isTextMatch(target: string, query: string): boolean {
  if (!target || !query) return false;
  const normTarget = normalizeText(target);
  const normQuery = normalizeText(query);

  if (normTarget.includes(normQuery)) return true;

  // 쿼리가 초성으로만 구성된 경우 초성 매칭
  const isQueryChosung = /^[ㄱ-ㅎ]+$/.test(normQuery);
  if (isQueryChosung) {
    const targetChosung = getChosung(normTarget);
    return targetChosung.includes(normQuery);
  }

  return false;
}

/**
 * 키워드 사전(keywords.json)을 통한 질의어 확장
 * 입력어와 일치하는 대표 키워드, 동의어(aliases), 관련어(related_terms) 목록을 반환
 */
export function expandQueryWithKeywords(
  query: string,
  keywordsDict: KeywordEntry[]
): { term: string; via?: string }[] {
  const normQuery = normalizeText(query);
  const expanded: Map<string, string | undefined> = new Map();

  // 원본 검색어 우선 추가
  expanded.set(query.trim(), undefined);

  for (const entry of keywordsDict) {
    const matchesKeyword = isTextMatch(entry.keyword, normQuery);
    const matchedAlias = entry.aliases.find((alias) => isTextMatch(alias, normQuery));
    const matchedRelated = entry.related_terms.find((rel) => isTextMatch(rel, normQuery));

    if (matchesKeyword || matchedAlias || matchedRelated) {
      const canonical = entry.keyword;
      // 대표 키워드 추가
      if (!expanded.has(canonical)) {
        expanded.set(canonical, canonical);
      }
      // 동의어 추가
      for (const alias of entry.aliases) {
        if (!expanded.has(alias)) {
          expanded.set(alias, canonical);
        }
      }
      // 관련어 추가
      for (const rel of entry.related_terms) {
        if (!expanded.has(rel)) {
          expanded.set(rel, canonical);
        }
      }
    }
  }

  return Array.from(expanded.entries()).map(([term, via]) => ({
    term,
    via: via && normalizeText(via) !== normQuery ? via : undefined,
  }));
}

/**
 * 기업 데이터에 대해 지정된 범위(Scope)와 확장 키워드로 검색 수행
 * 규칙 9 준수: 데이터에 존재하는 기업만 반환, AI 추론이나 임의 추천 없음
 */
export function searchCompanies(
  companies: Company[],
  query: string,
  scope: SearchScope,
  keywordsDict: KeywordEntry[]
): SearchResultItem[] {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const expansionTerms = expandQueryWithKeywords(cleanQuery, keywordsDict);
  const results: SearchResultItem[] = [];

  for (const company of companies) {
    const matches: SearchMatchDetail[] = [];
    const seenMatchKeys = new Set<string>();

    const recordMatch = (field: string, matchedText: string, viaKeyword?: string) => {
      const key = `${field}:${matchedText}`;
      if (!seenMatchKeys.has(key)) {
        seenMatchKeys.add(key);
        matches.push({ field, matchedText, viaKeyword });
      }
    };

    for (const { term, via } of expansionTerms) {
      if (!term) continue;

      // 1. 기업명 (scope === 'all' || 'name')
      if (scope === "all" || scope === "name") {
        if (isTextMatch(company.name, term)) {
          recordMatch("기업명", company.name, via);
        }
      }

      // 2. 한 줄 요약 (scope === 'all')
      if (scope === "all") {
        if (company.one_line_summary && isTextMatch(company.one_line_summary.value, term)) {
          recordMatch("기업 요약", company.one_line_summary.value, via);
        }
      }

      // 3. 제품·부품 (scope === 'all' || 'product')
      if (scope === "all" || scope === "product") {
        for (const prod of company.products) {
          if (isTextMatch(prod.name, term) || isTextMatch(prod.easy_description, term)) {
            recordMatch("제품명", prod.name, via);
          }
        }
      }

      // 4. 기술 키워드 (scope === 'all' || 'tech_keyword')
      if (scope === "all" || scope === "tech_keyword") {
        if (company.tech_keywords?.value) {
          for (const kw of company.tech_keywords.value) {
            if (isTextMatch(kw, term)) {
              recordMatch("기술 키워드", kw, via);
            }
          }
        }
      }

      // 5. 주요 납품처 (scope === 'all' || 'customer')
      if (scope === "all" || scope === "customer") {
        for (const cust of company.customers) {
          if (isTextMatch(cust.name, term)) {
            recordMatch("납품처", cust.name, via);
          }
        }
      }

      // 6. 소재지 / 지역 (scope === 'all' || 'region')
      if (scope === "all" || scope === "region") {
        if (company.region && isTextMatch(company.region.value, term)) {
          recordMatch("지역", company.region.value, via);
        }
      }

      // 7. 채용 직무 (scope === 'all' || 'job_role')
      if (scope === "all" || scope === "job_role") {
        if (company.job_roles?.value) {
          for (const role of company.job_roles.value) {
            if (isTextMatch(role, term)) {
              recordMatch("채용 직무", role, via);
            }
          }
        }
      }
    }

    if (matches.length > 0) {
      results.push({ company, matches });
    }
  }

  // 정렬: 일치 항목 수 내림차순 -> 검증 완료 여부 -> 이름 가나다순
  results.sort((a, b) => {
    if (b.matches.length !== a.matches.length) {
      return b.matches.length - a.matches.length;
    }
    if (a.company.verified !== b.company.verified) {
      return a.company.verified ? -1 : 1;
    }
    return a.company.name.localeCompare(b.company.name, "ko");
  });

  return results;
}

/**
 * 검색창 자동완성 제안 목록 생성 (데이터에 실존하는 명칭 기준)
 */
export function getAutocompleteSuggestions(
  query: string,
  companies: Company[],
  keywordsDict: KeywordEntry[]
): { text: string; type: "company" | "product" | "keyword" }[] {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const suggestions: { text: string; type: "company" | "product" | "keyword" }[] = [];
  const seen = new Set<string>();

  // 1. 기업명 일치
  for (const c of companies) {
    if (isTextMatch(c.name, cleanQuery) && !seen.has(c.name)) {
      seen.add(c.name);
      suggestions.push({ text: c.name, type: "company" });
    }
    if (suggestions.length >= 6) break;
  }

  // 2. 키워드 사전 일치
  for (const k of keywordsDict) {
    if (isTextMatch(k.keyword, cleanQuery) && !seen.has(k.keyword)) {
      seen.add(k.keyword);
      suggestions.push({ text: k.keyword, type: "keyword" });
    }
    if (suggestions.length >= 8) break;
  }

  // 3. 제품명 일치
  for (const c of companies) {
    for (const p of c.products) {
      if (isTextMatch(p.name, cleanQuery) && !seen.has(p.name)) {
        seen.add(p.name);
        suggestions.push({ text: p.name, type: "product" });
      }
      if (suggestions.length >= 10) break;
    }
  }

  return suggestions.slice(0, 8);
}
