import { Injectable, TemplateRef } from '@angular/core';

@Injectable()
export class TemplateCacheService {
  private readonly cache: Map<string, TemplateRef<unknown>> = new Map();

  get(key: string): TemplateRef<unknown> {
    return this.cache.get(key);
  }

  set(key: string, templateRef: TemplateRef<unknown>): void {
    this.cache.set(key, templateRef);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}