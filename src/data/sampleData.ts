/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, KeywordEntry, MetaInfo } from "../types.ts";

/**
 * 절대 규칙 준수:
 * 1. 실존 기업의 사실 정보를 임의로 생성하지 않음.
 * 2. 명백한 가상의 명칭 ("[샘플] 예시샤시공업 주식회사" 등 4개)만 사용.
 * 3. 모든 기업에 is_sample: true 및 명확한 샘플 표기 부여.
 * 4. 모든 사실 필드에 형식에 맞는 예시 출처 URL과 기준일 부여.
 */

export const SAMPLE_COMPANIES: Company[] = [
  {
    id: "sample-chassis-01",
    name: "[샘플] 예시샤시공업 주식회사",
    is_sample: true,
    verified: true,
    hidden_badge: true,
    hidden_badge_reason:
      "일반 소비자 인지도는 낮으나 고장력 서스펜션 암 및 서브프레임 분야에서 높은 기술 점유율을 보유한 부품사 예시입니다.",
    categories: ["1차 부품사"],
    one_line_summary: {
      value: "차량 하체 서스펜션 모듈 및 경량 서브프레임을 제조하는 1차 협력사 (가상 샘플)",
      source_url: "https://example.com/sources/sample-chassis-report-2026.html",
      source_date: "2026-05-10",
    },
    size_class: {
      value: "중견기업",
      source_url: "https://example.com/sources/sample-corp-classification-2026.html",
      source_date: "2026-04-01",
    },
    region: {
      value: "충청남도 아산시",
      source_url: "https://example.com/sources/sample-chassis-location.html",
      source_date: "2026-03-15",
    },
    founded_year: {
      value: 1988,
      source_url: "https://example.com/sources/sample-chassis-history.html",
      source_date: "2026-01-20",
    },
    employee_count: {
      value: 650,
      source_url: "https://example.com/sources/sample-employment-disclosure-2026.html",
      source_date: "2026-06-30",
    },
    revenue_krw_100m: {
      value: 3820, // 3,820억원
      source_url: "https://example.com/sources/sample-dart-financial-2025.html",
      source_date: "2026-03-31",
    },
    tiers: [
      {
        level: "1차",
        status: "confirmed",
        evidence: "국내외 완성차 공장에 직납하는 샤시 모듈 조립 협력사 등록 공시 확인",
        source_url: "https://example.com/sources/sample-tier1-certificate.html",
        source_date: "2026-02-15",
      },
    ],
    products: [
      {
        name: "경량 알루미늄 로어암",
        easy_description:
          "바퀴와 차체를 연결하여 충격을 흡수하고 조향을 안정시키는 핵심 하체 관절 부품입니다.",
        source_url: "https://example.com/sources/sample-product-catalog.html",
        source_date: "2026-02-10",
      },
      {
        name: "전기차 전용 후륜 서브프레임",
        easy_description:
          "무거운 배터리와 모터를 안정적으로 지지하는 하부 대형 골격 구조물입니다.",
        source_url: "https://example.com/sources/sample-product-catalog.html",
        source_date: "2026-02-10",
      },
    ],
    tech_keywords: {
      value: ["하체샤시", "서스펜션", "경량화", "알루미늄다이캐스팅", "서브프레임"],
      source_url: "https://example.com/sources/sample-rd-patent.html",
      source_date: "2026-04-18",
    },
    customers: [
      {
        name: "[예시] 한국완성차A",
        status: "confirmed",
        source_url: "https://example.com/sources/sample-supply-contract.html",
        source_date: "2026-01-15",
      },
      {
        name: "[예시] 글로벌완성차B",
        status: "estimated",
        source_url: "https://example.com/sources/sample-industry-press.html",
        source_date: "2026-04-20",
      },
    ],
    job_roles: {
      value: ["샤시 기구설계", "구조해석(CAE)", "스마트팩토리 공정기술", "품질보증(QA)"],
      source_url: "https://example.com/sources/sample-hiring-roles.html",
      source_date: "2026-05-01",
    },
    career_links: [
      {
        type: "official",
        url: "https://example.com/careers/sample-chassis",
        checked_at: "2026-09-01",
      },
    ],
    updated_at: "2026-10-15",
  },
  {
    id: "sample-electronics-02",
    name: "[샘플] 가상전장시스템 주식회사",
    is_sample: true,
    verified: true,
    hidden_badge: true,
    hidden_badge_reason:
      "일반 소비자에겐 생소하지만 차량용 도메인 제어기(DCU) 및 바디 컨트롤러 분야 선도 기업 예시입니다.",
    categories: ["전장·SW", "1차 부품사"],
    one_line_summary: {
      value: "차량용 스마트 정션박스 및 바디제어 모듈(BCM)을 공급하는 전장 전문 기업 (가상 샘플)",
      source_url: "https://example.com/sources/sample-electronics-disclosure.html",
      source_date: "2026-06-15",
    },
    size_class: {
      value: "대기업",
      source_url: "https://example.com/sources/sample-large-enterprise-list.html",
      source_date: "2026-05-01",
    },
    region: {
      value: "경기도 화성시",
      source_url: "https://example.com/sources/sample-electronics-hq.html",
      source_date: "2026-04-10",
    },
    founded_year: {
      value: 1999,
      source_url: "https://example.com/sources/sample-electronics-history.html",
      source_date: "2026-02-01",
    },
    employee_count: {
      value: 1200,
      source_url: "https://example.com/sources/sample-employment-data.html",
      source_date: "2026-06-30",
    },
    revenue_krw_100m: {
      value: 11500, // 1조 1,500억원
      source_url: "https://example.com/sources/sample-financials-2025.html",
      source_date: "2026-03-31",
    },
    tiers: [
      {
        level: "1차",
        status: "confirmed",
        evidence: "완성차 바디제어 시스템 주공급사 선정 감사보고서 공시",
        source_url: "https://example.com/sources/sample-tier-audit.html",
        source_date: "2026-03-10",
      },
    ],
    products: [
      {
        name: "통합 바디 도메인 제어기(BDC)",
        easy_description:
          "차량의 스마트키 인식, 조명 제어, 도어락, 와이퍼 등 바디 전장 부품을 한 컴퓨터로 통합 제어하는 두뇌 장치입니다.",
        source_url: "https://example.com/sources/sample-product-bdc.html",
        source_date: "2026-05-20",
      },
      {
        name: "차량용 통신 게이트웨이 모듈",
        easy_description:
          "CAN, 이더넷 등 차량 내부의 다양한 통신 규격을 고속으로 연결해 주는 통신 교환기입니다.",
        source_url: "https://example.com/sources/sample-product-gateway.html",
        source_date: "2026-05-20",
      },
    ],
    tech_keywords: {
      value: ["AUTOSAR", "임베디드SW", "차량용통신", "기능안전(ISO26262)", "OTA"],
      source_url: "https://example.com/sources/sample-tech-stack.html",
      source_date: "2026-05-15",
    },
    customers: [
      {
        name: "[예시] 한국완성차A",
        status: "confirmed",
        source_url: "https://example.com/sources/sample-contract-a.html",
        source_date: "2026-02-28",
      },
      {
        name: "[예시] 북미완성차C",
        status: "estimated",
        source_url: "https://example.com/sources/sample-news-export.html",
        source_date: "2026-07-11",
      },
    ],
    job_roles: {
      value: ["임베디드 C/C++ 개발", "AUTOSAR 아키텍처", "전장 회로설계(HW)", "기능안전 엔지니어"],
      source_url: "https://example.com/sources/sample-careers-role.html",
      source_date: "2026-08-01",
    },
    career_links: [
      {
        type: "official",
        url: "https://example.com/recruit/sample-electronics",
        checked_at: "2026-10-01",
      },
    ],
    updated_at: "2026-10-20",
  },
  {
    id: "sample-materials-03",
    name: "[샘플] 모형소재정밀 주식회사",
    is_sample: true,
    verified: false,
    hidden_badge: false,
    categories: ["소재", "2차 부품사"],
    one_line_summary: {
      value: "변속기 및 전기차 감속기용 정밀 단조 기어 소재를 가공하는 2차 협력사 (가상 샘플)",
      source_url: "https://example.com/sources/sample-materials-intro.html",
      source_date: "2025-11-20", // 6개월 초과 예시 (오래된 정보 배지 테스트용)
    },
    size_class: {
      value: "중견기업",
      source_url: "https://example.com/sources/sample-size-class.html",
      source_date: "2025-10-15",
    },
    region: {
      value: "경상남도 창원시",
      source_url: "https://example.com/sources/sample-plant-location.html",
      source_date: "2026-01-10",
    },
    founded_year: {
      value: 1994,
      source_url: "https://example.com/sources/sample-history.html",
      source_date: "2025-08-01",
    },
    employee_count: {
      value: 380,
      source_url: "https://example.com/sources/sample-employees.html",
      source_date: "2025-12-31",
    },
    revenue_krw_100m: {
      value: 1950, // 1,950억원
      source_url: "https://example.com/sources/sample-audit-2024.html",
      source_date: "2025-04-15",
    },
    tiers: [
      {
        level: "2차",
        status: "confirmed",
        evidence: "1차 구동계 모듈 부품사에 정밀 가공 기어 및 링 단조품 납품 확인",
        source_url: "https://example.com/sources/sample-supply-chain-doc.html",
        source_date: "2025-11-10",
      },
    ],
    products: [
      {
        name: "EV 감속기용 유성기어 세트",
        easy_description:
          "전기 모터의 초고속 회전수를 바퀴가 굴러갈 수 있는 적정 회전력으로 낮춰주는 정밀 금속 기어입니다.",
        source_url: "https://example.com/sources/sample-product-gear.html",
        source_date: "2025-10-05",
      },
    ],
    tech_keywords: {
      value: ["정밀단조", "열처리", "침탄강", "감속기어", "기어가공"],
      source_url: "https://example.com/sources/sample-process-tech.html",
      source_date: "2025-09-12",
    },
    customers: [
      {
        name: "[예시] 1차모듈사X",
        status: "confirmed",
        source_url: "https://example.com/sources/sample-vendor-list.html",
        source_date: "2025-11-05",
      },
    ],
    job_roles: {
      value: ["단조 금형설계", "열처리 공정기술", "정밀측정 및 품질관리"],
      source_url: "https://example.com/sources/sample-jobs.html",
      source_date: "2025-12-01",
    },
    // 공식 채용 URL 없는 경우 테스트 (자동 생성 검색 링크 보조 수단 확인용)
    career_links: [],
    updated_at: "2026-01-05",
  },
  {
    id: "sample-mobility-pending-04",
    name: "[샘플] 테스트모빌리티솔루션 주식회사",
    is_sample: true,
    verified: false,
    hidden_badge: false,
    categories: ["모빌리티"],
    one_line_summary: {
      value: "PBV(목적기반차량) 실내 플러그앤플레이 모듈 시스템을 연구하는 기업 (가상 샘플)",
      source_url: "https://example.com/sources/sample-pbv-concept.html",
      source_date: "2026-07-20",
    },
    // 공식 근거가 없는 기업 -> "규모 구분 확인 불가"로 분류되며 "검토 대기" 탭에서만 조회되는 예시
    size_class: undefined,
    region: {
      value: "대구광역시 달성군",
      source_url: "https://example.com/sources/sample-rd-center.html",
      source_date: "2026-06-01",
    },
    founded_year: {
      value: 2018,
      source_url: "https://example.com/sources/sample-founded.html",
      source_date: "2026-06-01",
    },
    employee_count: {
      value: 120,
      source_url: "https://example.com/sources/sample-headcount.html",
      source_date: "2026-07-01",
    },
    revenue_krw_100m: undefined, // 출처 없는 필드 -> 확인된 정보 없음으로 표시
    tiers: [
      {
        level: "2차",
        status: "estimated",
        evidence: "PBV 내장재 시제품 공동 프로젝트 참여 보도자료 기반 추정",
        source_url: "https://example.com/sources/sample-pbv-press.html",
        source_date: "2026-07-15",
      },
    ],
    products: [
      {
        name: "PBV 모듈형 퀵체인지 시트 레일",
        easy_description:
          "차량 실내 목적에 따라 좌석이나 짐칸 모듈을 손쉽게 탈착 및 재배치할 수 있는 스마트 레일 부품입니다.",
        source_url: "https://example.com/sources/sample-pbv-rail.html",
        source_date: "2026-07-10",
      },
    ],
    tech_keywords: {
      value: ["PBV", "실내모듈", "전동레일", "시트구조"],
      source_url: "https://example.com/sources/sample-keywords.html",
      source_date: "2026-07-10",
    },
    customers: [
      {
        name: "[예시] 한국완성차A",
        status: "estimated",
        source_url: "https://example.com/sources/sample-press-cooperation.html",
        source_date: "2026-07-15",
      },
    ],
    job_roles: undefined, // 확인된 정보 없음으로 표시
    career_links: [],
    updated_at: "2026-07-25",
  },
];

export const SAMPLE_KEYWORDS: KeywordEntry[] = [
  {
    keyword: "자율주행",
    aliases: ["AD", "ADAS", "autonomous", "오토파일럿"],
    related_terms: ["카메라", "레이더", "라이다", "도메인제어기", "영상인식", "센서퓨전"],
  },
  {
    keyword: "배터리",
    aliases: ["이차전지", "BMS", "battery", "배터리팩"],
    related_terms: ["배터리케이스", "열관리", "BMS", "고전압릴레이", "양극재", "냉각플레이트"],
  },
  {
    keyword: "도장",
    aliases: ["페인트", "코팅", "painting", "전착도장"],
    related_terms: ["방청", "실러", "표면처리", "외장도료"],
  },
  {
    keyword: "시트",
    aliases: ["좌석", "seat", "시트프레임"],
    related_terms: ["시트레일", "통풍시트", "럼버서포트", "액추에이터", "가죽트림"],
  },
  {
    keyword: "램프",
    aliases: ["헤드램프", "전조등", "후미등", "리어램프", "lamp", "lighting"],
    related_terms: ["LED", "매트릭스LED", "프로젝션", "렌즈", "주간주행등(DRL)"],
  },
  {
    keyword: "변속기",
    aliases: ["트랜스미션", "transmission", "감속기", "기어박스"],
    related_terms: ["유성기어", "클러치", "토크컨버터", "밸브바디", "디퍼렌셜"],
  },
  {
    keyword: "서스펜션",
    aliases: ["현가장치", "suspension", "쇼바", "쇼크업소버"],
    related_terms: ["로어암", "어퍼암", "서브프레임", "스테빌라이저", "스프링", "부시"],
  },
  {
    keyword: "소프트웨어",
    aliases: ["SW", "software", "임베디드", "제어기"],
    related_terms: ["AUTOSAR", "기능안전", "OTA", "CAN통신", "도메인제어기"],
  },
];

export const SAMPLE_META: MetaInfo = {
  version: "1.0.0-sample",
  updated_at: "2026-10-31",
  hidden_badge_criteria:
    "1) B2B 공급망에서 기술적 핵심 부품/모듈을 공급하거나 높은 시장 점유율을 보유함\n2) B2C 소비재 브랜드가 아니어서 취업준비생 및 일반 대중에게 기업 인지도가 상대적으로 낮음\n3) 공인된 매출액 또는 기술 인증 등 확인된 출처 근거가 존재함\n4) 운영자가 출처와 재무 상태를 직접 검토하여 수동으로 지정함 (알고리즘 자동 부여 배지 아님)",
  category_definitions: {
    완성차: "엔진, 모터, 샤시, 전장 등 수만 개의 부품을 종합하여 최종 차량을 조립·판매하는 기업",
    "1차 부품사": "완성차 제조사에 모듈 단위 또는 주요 핵심 부품을 직접 납품(Tier-1)하는 직납 협력사",
    "2차 부품사": "1차 협력사에 세부 단위 부품, 가공품 또는 서브 어셈블리를 공급하는 협력사",
    "전장·SW": "차량용 전자 제어기(ECU), 센서, 통신 장비 및 차량 제어 소프트웨어(AUTOSAR/임베디드)를 개발·공급하는 기업",
    소재: "차량 경량화, 배터리, 모터, 외장 및 샤시에 사용되는 특수강, 알루미늄, 엔지니어링 플라스틱, 복합소재 전문 기업",
    "정비·서비스": "차량 출고 후 유지보수, 순정부품 물류 및 보증 서비스를 지원하는 대규모 B2B 지원 기업",
    모빌리티: "목적기반차량(PBV), 자율주행 셔틀, 충전 인프라 등 미래 이동체 플랫폼 및 특장 시스템을 개발하는 기업",
  },
  disclaimer:
    "본 서비스는 공개 자료(사업보고서, 감사보고서, 공시, 공식 보도자료)를 사람이 확인해 정리한 참고용 정보이며, 티어·납품 관계는 추정일 수 있습니다. 최종 정보는 각 출처와 기업 공식 채널에서 직접 확인하시기 바랍니다.",
};
