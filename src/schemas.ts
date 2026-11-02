/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from "zod";

export const CategorySchema = z.enum([
  "완성차",
  "1차 부품사",
  "2차 부품사",
  "전장·SW",
  "소재",
  "정비·서비스",
  "모빌리티",
]);

export function createSourcedValueSchema<T extends z.ZodTypeAny>(valueSchema: T) {
  return z.object({
    value: valueSchema,
    source_url: z.string().min(1, "출처 URL(source_url)이 비어 있습니다."),
    source_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "기준일(source_date)은 YYYY-MM-DD 형식이어야 합니다."),
  });
}

export const TierSchema = z.object({
  level: z.enum(["OEM", "1차", "2차", "3차 이상"]),
  status: z.enum(["confirmed", "estimated"]),
  evidence: z.string().min(1, "티어 근거 문구(evidence)가 필요합니다."),
  source_url: z.string().min(1, "출처 URL이 필요합니다."),
  source_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "기준일은 YYYY-MM-DD 형식이어야 합니다."),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "제품명이 필요합니다."),
  easy_description: z.string().min(1, "쉬운 제품 설명이 필요합니다."),
  source_url: z.string().min(1, "출처 URL이 필요합니다."),
  source_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "기준일은 YYYY-MM-DD 형식이어야 합니다."),
});

export const CustomerSchema = z.object({
  name: z.string().min(1, "납품처명이 필요합니다."),
  status: z.enum(["confirmed", "estimated"]),
  source_url: z.string().min(1, "출처 URL이 필요합니다."),
  source_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "기준일은 YYYY-MM-DD 형식이어야 합니다."),
});

export const CareerLinkSchema = z.object({
  type: z.literal("official"),
  url: z.string().url("유효한 URL이어야 합니다."),
  checked_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "확인일은 YYYY-MM-DD 형식이어야 합니다."),
});

export const CompanySchema = z.object({
  id: z.string().min(1, "기업 ID가 필요합니다."),
  name: z.string().min(1, "기업명이 필요합니다."),
  is_sample: z.boolean(),
  verified: z.boolean(),
  hidden_badge: z.boolean(),
  hidden_badge_reason: z.string().optional(),
  categories: z.array(CategorySchema).min(1, "최소 1개 이상의 카테고리가 필요합니다."),
  one_line_summary: createSourcedValueSchema(z.string()).optional(),
  size_class: createSourcedValueSchema(z.enum(["대기업", "중견기업"])).optional(),
  region: createSourcedValueSchema(z.string()).optional(),
  founded_year: createSourcedValueSchema(z.number().int()).optional(),
  employee_count: createSourcedValueSchema(z.number().int()).optional(),
  revenue_krw_100m: createSourcedValueSchema(z.number()).optional(),
  tiers: z.array(TierSchema).default([]),
  products: z.array(ProductSchema).default([]),
  tech_keywords: createSourcedValueSchema(z.array(z.string())).optional(),
  customers: z.array(CustomerSchema).default([]),
  job_roles: createSourcedValueSchema(z.array(z.string())).optional(),
  career_links: z.array(CareerLinkSchema).default([]),
  updated_at: z.string(),
});

export const CompaniesArraySchema = z.array(z.unknown());

export const KeywordEntrySchema = z.object({
  keyword: z.string().min(1, "대표 키워드가 필요합니다."),
  aliases: z.array(z.string()).default([]),
  related_terms: z.array(z.string()).default([]),
});

export const KeywordsArraySchema = z.array(KeywordEntrySchema);

export const MetaInfoSchema = z.object({
  version: z.string(),
  updated_at: z.string(),
  hidden_badge_criteria: z.string(),
  category_definitions: z.record(CategorySchema, z.string()),
  disclaimer: z.string(),
});
