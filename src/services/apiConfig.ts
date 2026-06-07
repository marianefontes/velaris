function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBase) {
    const normalized = trimTrailingSlash(configuredBase);
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
  }

  const oracleEndpoint = import.meta.env.VITE_ORACLE_API_URL?.trim();
  if (oracleEndpoint) {
    const normalized = trimTrailingSlash(oracleEndpoint);
    if (normalized.endsWith("/api/chat")) return normalized.slice(0, -5);
    if (normalized.endsWith("/chat")) return normalized.slice(0, -5);
  }

  return "/api";
}
