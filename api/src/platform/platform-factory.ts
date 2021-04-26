import { Platform } from './platform';
import { NodePlatform } from './node-platform';

export function platform(): Platform {
  return new NodePlatform();
}
