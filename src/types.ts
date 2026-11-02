/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category =
  | "완성차"
  | "1차 부품사"
  | "2차 부품사"
  | "전장·SW"
  | "소재"
  | "정비·서비스"
  | "모빌리티";

export interface SourcedValue<T> {
  value: T;
  source_url: string;
  source_date: string; // YYYY-MM-DD
}

export interface Tier {
  level: "OEM" | "1차" | "2차" | "3차 이상";
  status: "confirmed" | "estimated";
  evidence: string;
  source_url: string;
  source_date: string;
}

export interface Product {
  name: string;
  easy_description: string;
  source_url: string;
  source_date: string;
}

export interface Customer {
  name: string;
  status: "confirmed" | "estimated";
  source_url: string;
  source_date: string;
}

export interface CareerLink {
  type: "official";
  url: string;
  checked_at: string;
}

export interface Company {
  id: string;
  name: string;
  is_sample: boolean;
  verified: boolean; // 사람이 모든 출처를 확인했는지 여부
  hidden_badge: boolean; // 운영자 수동 지정 숨은 기업
  hidden_badge_reason?: string;
  categories: Category[];
  one_line_summary?: SourcedValue<string>;
  size_class?: SourcedValue<"대기업" | "중견기업">;
  region?: SourcedValue<string>;
  founded_year?: SourcedValue<number>;
  employee_count?: SourcedValue<number>;
  revenue_krw_100m?: SourcedValue<number>; // 매출액 (단위: 억원)
  tiers: Tier[];
  products: Product[];
  tech_keywords?: SourcedValue<string[]>;
  customers: Customer[];
  job_roles?: SourcedValue<string[]>;
  career_links: CareerLink[];
  updated_at: string;
}

export interface KeywordEntry {
  keyword: string; // 대표 키워드
  aliases: string[]; // 동의어 및 표기 변형
  related_terms: string[]; // 관련 용어
}

export interface MetaInfo {
  version: string;
  updated_at: string;
  hidden_badge_criteria: string;
  category_definitions: Record<Category, string>;
  disclaimer: string;
}

export type SearchScope =
  | "all"
  | "name"
  | "product"
  | "tech_keyword"
  | "customer"
  | "region"
  | "job_role";

export interface SearchMatchDetail {
  field: string;
  matchedText: string;
  viaKeyword?: string;
}

export interface SearchResultItem {
  company: Company;
  matches: SearchMatchDetail[];
}

export interface FilterState {
  sizeClass: "all" | "대기업" | "중견기업";
  region: string;
  hiddenOnly: boolean;
  verifiedOnly: boolean;
  category: "all" | Category;
  tier: "all" | "OEM" | "1차" | "2차" | "3차 이상";
}

export interface DataValidationError {
  index: number;
  id?: string;
  name?: string;
  issues: string[];
}
