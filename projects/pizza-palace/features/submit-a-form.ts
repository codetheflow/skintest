import { feature, I } from '@skintest';
import { form } from '@my/pizza-palace/components';

feature('submit a form')

  .before('feature'
    , I.amOnPage(form.url)
  )

  .scenario('successfull complete'

    // , I.say('automatically dismiss dialog boxes')
    // , I.setNativeDialogHandler(() => true)

    , I.say('drag the pizza size slider')
    , I.drag(form.pie_size_handle, 100, 0)

    , I.say('select the toppings')
    , I.click(form.next_step)
    , I.click(form.pizza('pepperoni'))
    , I.click(form.next_step)

    , I.say('fill the address form')
    , I.click(form.confirm_addres)
    , I.fill(form.phone, '+1-541-754-3001')
    , I.click(form.next_step)

    , I.say('zoom into the iframe map')
    //, I.switchToIframe('.restaurant-location iframe')
    , I.click(form.map_zoom_in)

    , I.say('submit the order')
    //, I.switchToMainWindow()
    , I.click(form.complete_order)
  )