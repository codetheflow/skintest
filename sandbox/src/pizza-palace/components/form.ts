import { $ } from '@skintest/api';
import { env } from '../project';

export const form = {
  url: env.url

  , next_step: (id: number) => $<HTMLElement>(`#step${id} .next-step`)

  , pie_size_handle: $<HTMLElement>('.noUi-handle')
  , pizza: (name: string) => $<HTMLElement>(`label[for="${name}"]`)

  , confirm_addres: $<HTMLButtonElement>('.confirm-address')
  , phone: $<HTMLInputElement>('#phone-input')
  , map_zoom_in: $<HTMLButtonElement>('button[title="Zoom in"]')

  , complete_order: $<HTMLButtonElement>('.complete-order')
};