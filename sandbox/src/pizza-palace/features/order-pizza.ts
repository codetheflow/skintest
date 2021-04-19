import { feature, I } from '@skintest/api';
import { order_form } from '../components';

feature('order pizza')

  .before('feature'
    , I.amOnPage(order_form.url)
  )

  .scenario('successfull complete'

    // , I.say('automatically dismiss dialog boxes')
    // , I.setNativeDialogHandler(() => true)

    , I.say('drag the pizza size slider')
    , I.drag(order_form.pie_size_handle, 100, 0)

    , I.say('select the toppings')
    , I.click(order_form.next_step(1))
    , I.click(order_form.pizza('pepperoni'))
    , I.click(order_form.next_step(2))

    , I.say('fill the address form')
    , I.click(order_form.confirm_addres)
    , I.fill(order_form.phone, '+1-541-754-3001')
    , I.click(order_form.next_step(3))

    //, I.say('zoom into the iframe map')
    //, I.switchToIframe('.restaurant-location iframe')
    , I.click(order_form.map_zoom_in)

    , I.say('submit the order')
    //, I.switchToMainWindow()
    , I.click(order_form.complete_order)
  )