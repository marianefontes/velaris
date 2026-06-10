function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export type ApiConfigSource =
  | "VITE_ORACLE_API_URL"
  | "VITE_API_BASE_URL"
  | "vite_proxy";

export interface ApiConfiguration {
  apiBaseUrl: string;
  chatUrl: string;
  configuredValue: string | null;
  healthUrl: string;
  source: ApiConfigSource;
}

export function getApiConfiguration(): ApiConfiguration {
  const oracleEndpoint = import.meta.env.VITE_ORACLE_API_URL?.trim();
  if (oracleEndpoint) {
    const chatUrl = trimTrailingSlash(oracleEndpoint);
    const apiBaseUrl = chatUrl.endsWith("/chat")
      ? chatUrl.slice(0, -5)
      : chatUrl;
    return {
      apiBaseUrl,
      chatUrl,
      configuredValue: oracleEndpoint,
      healthUrl: `${apiBaseUrl}/health`,
      source: "VITE_ORACLE_API_URL",
    };
  }

  const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBase) {
    const normalized = trimTrailingSlash(configuredBase);
    const apiBaseUrl = normalized.endsWith("/api")
      ? normalized
      : `${normalized}/api`;
    return {
      apiBaseUrl,
      chatUrl: `${apiBaseUrl}/chat`,
      configuredValue: configuredBase,
      healthUrl: `${apiBaseUrl}/health`,
      source: "VITE_API_BASE_URL",
    };
  }

  return {
    apiBaseUrl: "/api",
    chatUrl: "/api/chat",
    configuredValue: null,
    healthUrl: "/api/health",
    source: "vite_proxy",
  };
}

export function getApiBaseUrl(): string {
  return getApiConfiguration().apiBaseUrl;
}

export function getChatApiUrl(): string {
  return getApiConfiguration().chatUrl;
}

export function getHealthApiUrl(): string {
  return getApiConfiguration().healthUrl;
}
