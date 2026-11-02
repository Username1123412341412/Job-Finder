/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Category,
  Company,
  DataValidationError,
  FilterState,
  KeywordEntry,
  MetaInfo,
  SearchScope,
} from "./types.ts";
import { DataFetchResult, loadAppletData, parseLocalJsonPreview } from "./dataClient.ts";
import { searchCompanies } from "./search.ts";
import { DataStatusBanner } from "./components/DataStatusBanner.tsx";
import { SearchBar } from "./components/SearchBar.tsx";
import { KeywordChips } from "./components/KeywordChips.tsx";
import { CategoryGrid } from "./components/CategoryGrid.tsx";
import { CompanyCard } from "./components/CompanyCard.tsx";
import { CompanyDetail } from "./components/CompanyDetail.tsx";
import { FilterBar } from "./components/FilterBar.tsx";
import { EducationalDiagram } from "./components/EducationalDiagram.tsx";
import { TodayHiddenChampion } from "./components/TodayHiddenChampion.tsx";
import { ExploreFromCustomer } from "./components/ExploreFromCustomer.tsx";
import { ExploreFromProduct } from "./components/ExploreFromProduct.tsx";
import { CriteriaModal } from "./components/CriteriaModal.tsx";
import { DisclaimerModal } from "./components/DisclaimerModal.tsx";
import { LocalPreviewModal } from "./components/LocalPreviewModal.tsx";
import { SuggestEditModal } from "./components/SuggestEditModal.tsx";
import {
  Home,
  Search as SearchIcon,
  Layers,
  Compass,
  Building2,
  HelpCircle,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  GitPullRequestDraft,
} from "lucide-react";

type MainView =
  | "home"
  | "search"
  | "category"
  | "explore_customer"
  | "explore_product"
  | "detail";

export default function App() {
  // 1. Data state
  const [dataState, setDataState] = useState<DataFetchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);

  // 2. Navigation / View state
  const [currentView, setCurrentView] = useState<MainView>("home");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  // 3. Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");

  // 4. Filter state
  const [filters, setFilters] = useState<FilterState>({
    sizeClass: "all",
    region: "all",
    hiddenOnly: false,
    verifiedOnly: false,
    category: "all",
    tier: "all",
  });
  const [sortOrder, setSortOrder] = useState<"name" | "updated">("name");
  const [activeTab, setActiveTab] = useState<"main" | "pending">("main");

  // 5. Modals state
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showLocalPreviewModal, setShowLocalPreviewModal] = useState(false);
  const [editProposalTarget, setEditProposalTarget] = useState<Company | null>(null);

  // Initial load
  useEffect(() => {
    loadAppletData().then((res) => {
      setDataState(res);
      setIsLoading(false);
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const res = await loadAppletData(true);
    setDataState(res);
    setIsLocalMode(false);
    setIsRefreshing(false);
  };

  const handleApplyLocalData = (result: ReturnType<typeof parseLocalJsonPreview>) => {
    setDataState({
      mode: "local_preview",
      companies: result.companies,
      keywords: result.keywords,
      meta: result.meta,
      validationErrors: result.validationErrors,
      fetchedAt: new Date().toISOString(),
    });
    setIsLocalMode(true);
    setShowLocalPreviewModal(false);
  };

  const handleResetToDefault = () => {
    handleRefresh();
    setShowLocalPreviewModal(false);
  };

  // Companies & metadata from current state
  const companies = dataState?.companies || [];
  const keywordsDict = dataState?.keywords || [];
  const meta = dataState?.meta;

  // Extract all unique regions for filtering
  const allRegions = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.region?.value) {
        set.add(c.region.value);
      }
    });
    return Array.from(set).sort();
  }, [companies]);

  // Handle Search Submission
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentView("search");
  };

  // Handle Category Click
  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
    setCurrentView("category");
  };

  // Handle Company Selection
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search Results evaluation
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCompanies(companies, searchQuery, searchScope, keywordsDict);
  }, [companies, searchQuery, searchScope, keywordsDict]);

  // Main filtered companies list (Separating confirmed size vs pending review)
  const { mainList, pendingList } = useMemo(() => {
    // 1. Separate based on whether size_class is valid and has source
    const hasSizeClass = (c: Company) =>
      c.size_class !== undefined &&
      c.size_class.value !== undefined &&
      c.size_class.source_url.length > 0;

    // Filter application
    const applyFilters = (list: Company[]) => {
      return list.filter((c) => {
        // Category filter
        if (filters.category !== "all" && !c.categories.includes(filters.category)) {
          return false;
        }
        // Size filter
        if (filters.sizeClass !== "all" && c.size_class?.value !== filters.sizeClass) {
          return false;
        }
        // Tier filter
        if (filters.tier !== "all") {
          const hasTier = c.tiers.some((t) => t.level === filters.tier);
          if (!hasTier) return false;
        }
        // Region filter
        if (filters.region !== "all" && c.region?.value !== filters.region) {
          return false;
        }
        // Hidden only
        if (filters.hiddenOnly && !c.hidden_badge) {
          return false;
        }
        // Verified only
        if (filters.verifiedOnly && !c.verified) {
          return false;
        }
        return true;
      });
    };

    // Sort application
    const applySort = (list: Company[]) => {
      return [...list].sort((a, b) => {
        if (sortOrder === "updated") {
          return b.updated_at.localeCompare(a.updated_at);
        }
        return a.name.localeCompare(b.name, "ko");
      });
    };

    const confirmedCompanies = companies.filter(hasSizeClass);
    const unconfirmedCompanies = companies.filter((c) => !hasSizeClass(c));

    return {
      mainList: applySort(applyFilters(confirmedCompanies)),
      pendingList: applySort(applyFilters(unconfirmedCompanies)),
    };
  }, [companies, filters, sortOrder]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* 1. Global Data Status & Cache Notification Banner */}
      {dataState && (
        <DataStatusBanner
          dataState={dataState}
          onRefresh={handleRefresh}
          onOpenLocalPreview={() => setShowLocalPreviewModal(true)}
          onOpenDataErrors={() => setShowLocalPreviewModal(true)}
          isRefreshing={isRefreshing}
        />
      )}

      {/* 2. Top Header (Strict 3-zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Wordmark */}
          <div
            onClick={() => {
              setCurrentView("home");
              setSelectedCompany(null);
            }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
              숨은 강자
            </span>
          </div>

          {/* Zone 2: Desktop Navigation Links (Clean single-line text with subtle hover) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
            <button
              onClick={() => {
                setCurrentView("home");
                setSelectedCompany(null);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === "home" ? "text-sky-400 font-bold" : ""
              }`}
            >
              홈
            </button>
            <button
              onClick={() => {
                setCurrentView("search");
                setSelectedCompany(null);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === "search" ? "text-sky-400 font-bold" : ""
              }`}
            >
              기업 검색
            </button>
            <button
              onClick={() => {
                setCurrentView("explore_customer");
                setSelectedCompany(null);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === "explore_customer" ? "text-sky-400 font-bold" : ""
              }`}
            >
              아는 회사에서 출발
            </button>
            <button
              onClick={() => {
                setCurrentView("explore_product");
                setSelectedCompany(null);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === "explore_product" ? "text-sky-400 font-bold" : ""
              }`}
            >
              부품에서 출발
            </button>
          </nav>

          {/* Zone 3: 1 Primary contextual action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDisclaimerModal(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">서비스 안내 · 면책</span>
              <span className="sm:hidden">면책</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-slate-900 rounded-2xl w-full border border-slate-800" />
            <div className="h-36 bg-slate-900 rounded-3xl w-full border border-slate-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-40 bg-slate-900 rounded-2xl border border-slate-800" />
              <div className="h-40 bg-slate-900 rounded-2xl border border-slate-800" />
              <div className="h-40 bg-slate-900 rounded-2xl border border-slate-800" />
            </div>
          </div>
        ) : (
          <>
            {/* VIEW: Company Detail */}
            {currentView === "detail" && selectedCompany && (
              <CompanyDetail
                company={selectedCompany}
                onBack={() => {
                  setSelectedCompany(null);
                  setCurrentView("home");
                }}
                onOpenSuggestEditModal={(comp) => setEditProposalTarget(comp)}
              />
            )}

            {/* VIEW: Home Screen */}
            {currentView === "home" && (
              <div className="space-y-8 pb-16">
                {/* Hero / Mission Statement */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block">
                    자동차 산업 취업준비생을 위한 B2B 나침반
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight break-keep">
                    일반인은 몰라도, 완성차가 찾는 숨은 강자를 발견하세요.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    철저한 사실 출처(공시·사업보고서)와 기준일을 갖춘 자동차 분야 중견·대기업만 수록합니다.
                    생성형 AI의 임의 추측 없이 검증된 B2B 공급망 정보만 제공합니다.
                  </p>
                </div>

                {/* Top Search Bar & Scope */}
                <div className="space-y-3">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={handleSearchSubmit}
                    scope={searchScope}
                    onScopeChange={setSearchScope}
                    companies={companies}
                    keywordsDict={keywordsDict}
                  />
                  <KeywordChips
                    onSelectKeyword={(kw) => {
                      setSearchQuery(kw);
                      setCurrentView("search");
                    }}
                    selectedKeyword={searchQuery}
                  />
                </div>

                {/* Today's Hidden Champion */}
                <TodayHiddenChampion
                  companies={companies}
                  onSelectCompany={handleSelectCompany}
                  onOpenCriteria={() => setShowCriteriaModal(true)}
                />

                {/* 3 Exploration Entry Banners */}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-3">
                    어디서부터 탐색할까요?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Path 1: Start from Known OEM */}
                    <div
                      onClick={() => setCurrentView("explore_customer")}
                      className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-600/60 cursor-pointer transition-all shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-3">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                          아는 회사에서 출발
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          우리가 이미 잘 아는 완성차(OEM) 및 1차 고객사를 선택해, 그곳에 납품하는 1·2차 협력사를 단계별로 확인합니다.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                        <span>협력사 네트워크 보기</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Path 2: Start from Parts / Products */}
                    <div
                      onClick={() => setCurrentView("explore_product")}
                      className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-600/60 cursor-pointer transition-all shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-3">
                          <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                          부품 및 기술에서 출발
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          로어암, 바디제어기, 감속기어 등 실제 제조 부품의 쉬운 설명과 공정 키워드를 통해 기업을 발견합니다.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                        <span>부품 사전 및 제조사 보기</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7 Categories Grid */}
                {meta && (
                  <CategoryGrid
                    companies={companies}
                    meta={meta}
                    onSelectCategory={handleSelectCategory}
                    selectedCategory={selectedCategory}
                  />
                )}

                {/* Educational Diagram: "n차 벤더가 뭔가요?" */}
                <EducationalDiagram />
              </div>
            )}

            {/* VIEW: Search Results */}
            {currentView === "search" && (
              <div className="space-y-6 pb-16">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    키워드 검색 결과
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    키워드 사전을 통한 동의어·관련어 확장 매칭 (데이터에 실존하는 기업만 표시)
                  </p>
                </div>

                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearchSubmit}
                  scope={searchScope}
                  onScopeChange={setSearchScope}
                  companies={companies}
                  keywordsDict={keywordsDict}
                />

                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                  <span>
                    검색어 <strong className="text-sky-300">"{searchQuery || "전체"}"</strong> 일치 기업:{" "}
                    <strong className="text-white">{searchResults.length}건</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentView("home");
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    검색 초기화
                  </button>
                </div>

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map(({ company, matches }) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        matches={matches}
                        onSelect={handleSelectCompany}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-200">
                      일치하는 기업이 없습니다.
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      "숨은 강자"는 허위 정보를 방지하기 위해 데이터에 등록되지 않은 기업을 임의로 추천하거나 생성하지 않습니다.
                      다른 부품명이나 상위 키워드로 검색해 보세요.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: Category & General Directory List */}
            {currentView === "category" && (
              <div className="space-y-6 pb-16">
                <div>
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
                    <span onClick={() => setCurrentView("home")} className="cursor-pointer hover:underline">
                      홈
                    </span>
                    <span>&gt;</span>
                    <span>분야별 기업 목록</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {filters.category === "all" ? "전체 등록 기업 목록" : `${filters.category} 기업 탐험`}
                  </h1>
                  {meta && filters.category !== "all" && (
                    <p className="text-xs text-slate-400 mt-1">
                      {meta.category_definitions[filters.category]}
                    </p>
                  )}
                </div>

                {/* Filter and Tab Bar */}
                <FilterBar
                  filters={filters}
                  onFilterChange={setFilters}
                  regions={allRegions}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  mainCount={mainList.length}
                  pendingCount={pendingList.length}
                />

                {/* Notice for Pending Tab */}
                {activeTab === "pending" && (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 leading-relaxed">
                    <strong>⚠️ 검토 대기 탭 안내:</strong> 공식 출처(공시, 공인 기관 증빙)를 통해
                    규모 구분(대기업/중견기업)이 확정되지 않은 기업입니다. 철저한 데이터 신뢰성 원칙에
                    따라 기본 목록에서 분리되어 표시됩니다.
                  </div>
                )}

                {/* Company Cards List */}
                {(() => {
                  const currentDisplayList = activeTab === "main" ? mainList : pendingList;
                  if (currentDisplayList.length === 0) {
                    return (
                      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                        <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                        <h3 className="text-base font-bold text-slate-200">
                          아직 등록된 기업이 없습니다.
                        </h3>
                        <p className="text-xs text-slate-400">
                          해당 조건의 기업이 데이터베이스에 등록되지 않았습니다. 필터를 변경해 보세요.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentDisplayList.map((company) => (
                        <CompanyCard
                          key={company.id}
                          company={company}
                          onSelect={handleSelectCompany}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* VIEW: Start from Known Customer */}
            {currentView === "explore_customer" && (
              <div className="pb-16">
                <ExploreFromCustomer
                  companies={companies}
                  onSelectCompany={handleSelectCompany}
                />
              </div>
            )}

            {/* VIEW: Start from Component / Product */}
            {currentView === "explore_product" && (
              <div className="pb-16">
                <ExploreFromProduct
                  companies={companies}
                  keywordsDict={keywordsDict}
                  onSelectCompany={handleSelectCompany}
                  onSearchKeyword={(kw) => {
                    setSearchQuery(kw);
                    setCurrentView("search");
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. Mobile Bottom Navigation Bar (Pattern 1 from Mobile touch app reference) */}
      <nav
        aria-label="모바일 하단 네비게이션"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 h-16 pb-safe"
      >
        <div className="grid grid-cols-4 items-center h-full max-w-md mx-auto">
          {/* Tab 1: Home */}
          <button
            type="button"
            onClick={() => {
              setCurrentView("home");
              setSelectedCompany(null);
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentView === "home" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 tracking-tight">홈</span>
          </button>

          {/* Tab 2: Search */}
          <button
            type="button"
            onClick={() => {
              setCurrentView("search");
              setSelectedCompany(null);
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentView === "search" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <SearchIcon className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 tracking-tight">검색</span>
          </button>

          {/* Tab 3: Category */}
          <button
            type="button"
            onClick={() => {
              setCurrentView("category");
              setSelectedCompany(null);
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentView === "category" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 tracking-tight">카테고리</span>
          </button>

          {/* Tab 4: Explore */}
          <button
            type="button"
            onClick={() => {
              setCurrentView("explore_customer");
              setSelectedCompany(null);
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentView === "explore_customer" || currentView === "explore_product"
                ? "text-sky-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 tracking-tight">탐색</span>
          </button>
        </div>
      </nav>

      {/* 5. Modals */}
      {showCriteriaModal && meta && (
        <CriteriaModal meta={meta} onClose={() => setShowCriteriaModal(false)} />
      )}

      {showDisclaimerModal && meta && (
        <DisclaimerModal meta={meta} onClose={() => setShowDisclaimerModal(false)} />
      )}

      {showLocalPreviewModal && dataState && (
        <LocalPreviewModal
          validationErrors={dataState.validationErrors}
          onApplyLocalData={handleApplyLocalData}
          onResetToDefault={handleResetToDefault}
          onClose={() => setShowLocalPreviewModal(false)}
          isLocalMode={isLocalMode}
        />
      )}

      {editProposalTarget && (
        <SuggestEditModal
          company={editProposalTarget}
          onClose={() => setEditProposalTarget(null)}
        />
      )}
    </div>
  );
}
