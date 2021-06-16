import { Injectable, TemplateRef } from '@angular/core';

@Injectable()
export class TemplateCacheService {
  private readonly cache: Map<string, TemplateRef<any>> = new Map();

  get(key: string): TemplateRef<any> {
    return this.cache.get(key);
  }

  set(key: string, templateRef: TemplateRef<any>): void {
    this.cache.set(key, templateRef);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}