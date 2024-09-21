import { z } from 'zod';
import { SchemaRefs } from './types';

export class ApiClient {
  private baseUrls: Record<string, string>;
  private headers: Record<string, string>;
  private validateResponse: boolean;

  constructor(
    baseUrls: Record<string, string>,
    headers: Record<string, string> = {},
    validateResponse: boolean = false,
  ) {
    this.baseUrls = baseUrls;
    this.headers = headers;
    this.validateResponse = validateResponse;
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }
}
