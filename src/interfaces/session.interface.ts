export interface Session {
    SessionID: string;
    UserID: string;
    Token: string;
    LastActiveAt: Date;
    CreatedAt: Date;
    ExpiresAt: Date;
    IsRevoked: boolean;
}