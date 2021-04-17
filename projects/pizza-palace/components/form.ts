import { $ } from '@skintest';
import { env } from '@my/pizza-palace';

export const form = {
  url: env.url

  , next_step: $<HTMLElement>('.next-step')

  , pie_size_handle: $<HTMLElement>('.noUi-handle')
  , pizza: (name: string) => $<HTMLElement>(`#${name}`)

  , confirm_addres: $<HTMLButtonElement>('.confirm-address')
  , phone: $<HTMLInputElement>('#phone-input')
  , map_zoom_in: $<HTMLButtonElement>('button[title="Zoom in"]')

  , complete_order: $<HTMLButtonElement>('.complete-order')
};