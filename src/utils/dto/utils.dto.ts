export interface UserContextPayload {
    iat: number;
    exp: number;
    email: string; 
    id: string;
    role: string;
}

export interface HeadersContextPayload {
    authorization: string;
}

export interface ContextPayload {
    user: UserContextPayload
    header: HeadersContextPayload
    baseUrl: string
}