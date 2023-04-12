export type AuthApiService = {
    getToken(token: string): Promise<any>;
}
