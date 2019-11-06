declare namespace NodeJS {
  export interface ProcessEnv {
    APP_ENV: 'development' | 'test' | 'acceptation' | 'production';
    PUBLIC_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}
