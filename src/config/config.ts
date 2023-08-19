import { ConfigProps } from "./config.interface";

export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10),
  api: {
    apiServerDomain: process.env.API_SERVER_DOMAIN,
    httpTimeout: parseInt(process.env.HTTP_TIMEOUT, 10) || 10000
  },
  mongodb: {
    database: {
      connectionString: process.env.MONGODB_CONNECTION_STRING,
      databaseName: process.env.DB_NAME
    }
  },
  tokenInfo: {
    access: {
      key: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME
    },
    refresh: {
      key: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME
    }
  },
});
