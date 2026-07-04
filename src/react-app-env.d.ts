/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_URL: string;
    // добавляй сюда другие REACT_APP_* переменные по мере необходимости
  }
}