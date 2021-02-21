declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
}

declare namespace Express {
  interface Request {
    userId: string;
  }
}
