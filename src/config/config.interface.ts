export interface ApiConfigProps {
  apiServerDomain: string;
  httpTimeout: number;
}

export interface MongodbConfigProps {
  connectionString: string;
  databaseName: string;
}

export interface TokenInterface {
  key: string;
  expiresIn: string;
}

export interface TokenInfoInterface {
  access: TokenInterface;
  refresh: TokenInterface;
}

export interface ConfigProps {
  port: number;
  api: ApiConfigProps;
  mongodb: {
    database: MongodbConfigProps;
  },
  tokenInfo: TokenInfoInterface;
}
