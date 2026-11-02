/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 공개 GitHub 데이터 저장소 설정
 *
 * 절대 규칙:
 * 1. OWNER, REPO, BRANCH, DATA_PATH는 실제 운영 저장소가 결정되기 전까지 비워 두고 TODO로 관리합니다.
 * 2. 임의의 실존 저장소나 개인 계정을 채워 넣지 마십시오.
 * 3. OWNER와 REPO가 비어있는 경우 앱은 안전한 내장 가상 샘플 모드로 동작합니다.
 */
export const GITHUB_CONFIG = {
  // TODO: GitHub 사용자명 또는 조직명 (예: "your-organization")
  OWNER: "",

  // TODO: GitHub 저장소명 (예: "automotive-b2b-data")
  REPO: "",

  // TODO: 데이터가 위치한 브랜치명 (기본값: "main")
  BRANCH: "main",

  // TODO: 저장소 내 JSON 데이터 디렉토리 경로 (예: "data")
  DATA_PATH: "data",
};

/**
 * 저장소가 설정되어 있는지 확인
 */
export function isGitHubConfigured(): boolean {
  return (
    typeof GITHUB_CONFIG.OWNER === "string" &&
    GITHUB_CONFIG.OWNER.trim().length > 0 &&
    typeof GITHUB_CONFIG.REPO === "string" &&
    GITHUB_CONFIG.REPO.trim().length > 0
  );
}

/**
 * GitHub 파일 raw 다운로드 URL 생성
 */
export function getRawGitHubUrl(fileName: string): string {
  const cleanPath = GITHUB_CONFIG.DATA_PATH.replace(/^\/+|\/+$/g, "");
  return `https://raw.githubusercontent.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/${GITHUB_CONFIG.BRANCH}/${cleanPath}/${fileName}`;
}

/**
 * GitHub Issues 새 이슈 생성 URL 생성 (정보 수정 제안용)
 */
export function getGitHubNewIssueUrl(params: {
  companyName: string;
  fieldToEdit?: string;
  sourceUrl?: string;
  reason?: string;
}): string {
  if (!isGitHubConfigured()) {
    return "";
  }

  const title = `[정보 수정 제안] ${params.companyName}`;
  const body = [
    `### 🏢 기업명: ${params.companyName}`,
    `### ✏️ 수정 요청 항목: ${params.fieldToEdit || "예: 매출액, 납품처, 티어, 대표 제품 등"}`,
    `### 🔗 공식 출처 URL: ${params.sourceUrl || "https://..."}`,
    `### 📅 출처 기준일: YYYY-MM-DD`,
    `### 📝 수정 제안 내용 및 근거:`,
    `${params.reason || "공식 공시 자료 또는 보도자료 근거를 기술해 주세요."}`,
    `---`,
    `*본 제안은 '숨은 강자 - 자동차 B2B 기업 탐험' 웹앱을 통해 제출되었습니다.*`,
  ].join("\n\n");

  return `https://github.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/issues/new?title=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(body)}&labels=${encodeURIComponent("data-edit-proposal")}`;
}
