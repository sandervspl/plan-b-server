export interface DatabaseConnectDetails {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Interface for the class that holds secret info and is ignored by GIT
export interface SecretInfo {
  readonly databaseInfo: DatabaseConnectDetails;
  readonly jwtSecret: string;
}

export interface BlizzardInfo {
  readonly publicKey: string;
  readonly privateKey: string;
}