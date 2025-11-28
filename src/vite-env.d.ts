/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APM_SERVER_URL?: string;
  readonly VITE_APM_SERVICE_NAME?: string;
  readonly VITE_APM_ENV?: string;
  readonly VITE_APM_SERVICE_VERSION?: string;
  readonly VITE_APM_DISTRIBUTED_TRACING_ORIGINS?: string;
  readonly VITE_APM_LOG_LEVEL?: string;
  readonly VITE_APM_ACTIVE?: string;
  readonly VITE_APM_TRANSACTION_SAMPLE_RATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
