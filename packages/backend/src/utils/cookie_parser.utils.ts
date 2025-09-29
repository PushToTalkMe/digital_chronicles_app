export class CookieParser<T extends Record<string, string> = Record<string, string>> {
  rawCookie: string = '';
  cookies: T = {} as T;

  constructor() {}

  parsing(rawCookie: string | undefined): T | undefined {
    if (!rawCookie) {
      return undefined;
    }
    this.rawCookie = rawCookie;
    this.cookies = rawCookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        acc[name as keyof T] = decodeURIComponent(value) as T[keyof T];
      }
      return acc;
    }, {} as T);
    return this.cookies;
  }
}
