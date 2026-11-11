/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INQUIRY_API_ENDPOINT?: string;
  readonly DEV?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

