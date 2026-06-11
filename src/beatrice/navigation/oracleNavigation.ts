import type { NavigateFunction } from "react-router-dom";

export const ORACLE_QUERY_PARAM = "q";

export function buildOracleHref(prompt?: string) {
  const trimmed = prompt?.trim();
  if (!trimmed) return "/oracle";
  return `/oracle?${ORACLE_QUERY_PARAM}=${encodeURIComponent(trimmed)}`;
}

export function navigateToOracle(navigate: NavigateFunction, prompt?: string) {
  navigate(buildOracleHref(prompt));
}
