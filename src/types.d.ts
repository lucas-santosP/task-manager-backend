declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      ACCESS_TOKEN_SECRET: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
    }
  }
}

declare namespace Express {
  interface Request {
    userId: string;
  }
}
