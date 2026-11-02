/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GITHUB_CONFIG, getRawGitHubUrl, isGitHubConfigured } from "./config.ts";
import { SAMPLE_COMPANIES, SAMPLE_KEYWORDS, SAMPLE_META } from "./data/sampleData.ts";
import {
  CompaniesArraySchema,
  CompanySchema,
  KeywordsArraySchema,
  MetaInfoSchema,
} from "./schemas.ts";
import { Company, DataValidationError, KeywordEntry, MetaInfo } from "./types.ts";

export interface DataFetchResult {
  mode: "github_live" | "cached" | "sample_unconfigured" | "sample_fallback" | "local_preview";
  companies: Company[];
  keywords: KeywordEntry[];
  meta: MetaInfo;
  validationErrors: DataValidationError[];
  cachedDate?: string;
  errorMessage?: string;
  fetchedAt: string;
}

const CACHE_KEYS = {
  COMPANIES: "auto_b2b_companies_cache_v1",
  KEYWORDS: "auto_b2b_keywords_cache_v1",
  META: "auto_b2b_meta_cache_v1",
  TIMESTAMP: "auto_b2b_cache_timestamp_v1",
  VERSION: "auto_b2b_cache_version_v1",
};

/**
 * 6개월 이상 지난 기준일인지 검사하는 유틸리티
 * 현재 기준일: 2026-11-01 (시스템 환경 기준)
 */
export function isDateOlderThan6Months(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return false;
    const now = new Date("2026-11-01T23:16:45");
    const diffMs = now.getTime() - target.getTime();
    const sixMonthsMs = 182.5 * 24 * 60 * 60 * 1000;
    return diffMs > sixMonthsMs;
  } catch {
    return false;
  }
}

/**
 * Zod 검증을 통해 Company 배열을 정제하고, 오류가 발생한 레코드는 분리 수집
 */
export function validateCompanies(rawArray: unknown[]): {
  validCompanies: Company[];
  errors: DataValidationError[];
} {
  const validCompanies: Company[] = [];
  const errors: DataValidationError[] = [];

  rawArray.forEach((item, index) => {
    const parseResult = CompanySchema.safeParse(item);
    if (parseResult.success) {
      validCompanies.push(parseResult.data as Company);
    } else {
      const itemObj = (item && typeof item === "object") ? (item as Record<string, unknown>) : {};
      errors.push({
        index,
        id: typeof itemObj.id === "string" ? itemObj.id : undefined,
        name: typeof itemObj.name === "string" ? itemObj.name : undefined,
        issues: parseResult.error.issues.map(
          (issue) => `${issue.path.join(".") || "root"}: ${issue.message}`
        ),
      });
    }
  });

  return { validCompanies, errors };
}

/**
 * localStorage에 성공한 데이터 캐싱
 */
function saveToCache(companies: Company[], keywords: KeywordEntry[], meta: MetaInfo) {
  try {
    localStorage.setItem(CACHE_KEYS.COMPANIES, JSON.stringify(companies));
    localStorage.setItem(CACHE_KEYS.KEYWORDS, JSON.stringify(keywords));
    localStorage.setItem(CACHE_KEYS.META, JSON.stringify(meta));
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, new Date().toISOString());
    localStorage.setItem(CACHE_KEYS.VERSION, meta.version);
  } catch (e) {
    console.warn("로컬 캐시 저장 실패:", e);
  }
}

/**
 * localStorage로부터 캐시된 데이터 읽기
 */
function readFromCache(): {
  companies: Company[];
  keywords: KeywordEntry[];
  meta: MetaInfo;
  cachedDate: string;
} | null {
  try {
    const companiesRaw = localStorage.getItem(CACHE_KEYS.COMPANIES);
    const keywordsRaw = localStorage.getItem(CACHE_KEYS.KEYWORDS);
    const metaRaw = localStorage.getItem(CACHE_KEYS.META);
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);

    if (!companiesRaw || !keywordsRaw || !metaRaw || !timestamp) {
      return null;
    }

    const companies = JSON.parse(companiesRaw) as Company[];
    const keywords = JSON.parse(keywordsRaw) as KeywordEntry[];
    const meta = JSON.parse(metaRaw) as MetaInfo;

    return { companies, keywords, meta, cachedDate: timestamp };
  } catch (e) {
    console.warn("로컬 캐시 읽기 실패:", e);
    return null;
  }
}

/**
 * 데이터 로더 메인 함수
 */
export async function loadAppletData(forceRefresh = false): Promise<DataFetchResult> {
  const nowStr = new Date().toISOString();

  // 1. GitHub 저장소가 미설정된 경우 -> 즉시 내장 샘플 데이터 제공
  if (!isGitHubConfigured()) {
    const { validCompanies, errors } = validateCompanies(SAMPLE_COMPANIES);
    return {
      mode: "sample_unconfigured",
      companies: validCompanies,
      keywords: SAMPLE_KEYWORDS,
      meta: SAMPLE_META,
      validationErrors: errors,
      fetchedAt: nowStr,
    };
  }

  // 2. 강제 새로고침이 아니고 캐시가 유효한 경우, 빠른 캐시 확인
  if (!forceRefresh) {
    const cached = readFromCache();
    if (cached) {
      return {
        mode: "cached",
        companies: cached.companies,
        keywords: cached.keywords,
        meta: cached.meta,
        validationErrors: [],
        cachedDate: cached.cachedDate,
        fetchedAt: nowStr,
      };
    }
  }

  // 3. GitHub 원격 파일 요청
  try {
    const [companiesRes, keywordsRes, metaRes] = await Promise.all([
      fetch(getRawGitHubUrl("companies.json"), { cache: "no-cache" }),
      fetch(getRawGitHubUrl("keywords.json"), { cache: "no-cache" }),
      fetch(getRawGitHubUrl("meta.json"), { cache: "no-cache" }),
    ]);

    if (!companiesRes.ok || !keywordsRes.ok || !metaRes.ok) {
      throw new Error(
        `GitHub 파일 불러오기 실패 (상태 코드: companies=${companiesRes.status}, keywords=${keywordsRes.status}, meta=${metaRes.status})`
      );
    }

    const [companiesJson, keywordsJson, metaJson] = await Promise.all([
      companiesRes.json(),
      keywordsRes.json(),
      metaRes.json(),
    ]);

    // 스키마 검증
    const parsedCompaniesRaw = CompaniesArraySchema.parse(companiesJson);
    const { validCompanies, errors } = validateCompanies(parsedCompaniesRaw);
    const validKeywords = KeywordsArraySchema.parse(keywordsJson);
    const validMeta = MetaInfoSchema.parse(metaJson);

    // 성공 시 캐시 저장
    saveToCache(validCompanies, validKeywords, validMeta);

    return {
      mode: "github_live",
      companies: validCompanies,
      keywords: validKeywords,
      meta: validMeta,
      validationErrors: errors,
      fetchedAt: nowStr,
    };
  } catch (error) {
    console.error("GitHub 데이터 요청 실패:", error);
    const errorMessage = error instanceof Error ? error.message : "네트워크 오류 발생";

    // 캐시가 존재하면 캐시로 우아하게 대체
    const cached = readFromCache();
    if (cached) {
      return {
        mode: "cached",
        companies: cached.companies,
        keywords: cached.keywords,
        meta: cached.meta,
        validationErrors: [],
        cachedDate: cached.cachedDate,
        errorMessage: `${errorMessage} (저장된 로컬 캐시를 표시합니다)`,
        fetchedAt: nowStr,
      };
    }

    // 캐시도 없으면 내장 샘플 데이터로 폴백
    const { validCompanies, errors } = validateCompanies(SAMPLE_COMPANIES);
    return {
      mode: "sample_fallback",
      companies: validCompanies,
      keywords: SAMPLE_KEYWORDS,
      meta: SAMPLE_META,
      validationErrors: errors,
      errorMessage,
      fetchedAt: nowStr,
    };
  }
}

/**
 * 개발·검수용 로컬 JSON 미리보기 파서
 */
export function parseLocalJsonPreview(
  companiesRaw: unknown,
  keywordsRaw?: unknown,
  metaRaw?: unknown
): {
  companies: Company[];
  keywords: KeywordEntry[];
  meta: MetaInfo;
  validationErrors: DataValidationError[];
} {
  const parsedCompaniesRaw = Array.isArray(companiesRaw) ? companiesRaw : [];
  const { validCompanies, errors } = validateCompanies(parsedCompaniesRaw);

  let keywords: KeywordEntry[] = SAMPLE_KEYWORDS;
  if (keywordsRaw) {
    const kResult = KeywordsArraySchema.safeParse(keywordsRaw);
    if (kResult.success) {
      keywords = kResult.data;
    }
  }

  let meta: MetaInfo = SAMPLE_META;
  if (metaRaw) {
    const mResult = MetaInfoSchema.safeParse(metaRaw);
    if (mResult.success) {
      meta = mResult.data;
    }
  }

  return {
    companies: validCompanies,
    keywords,
    meta,
    validationErrors: errors,
  };
}
