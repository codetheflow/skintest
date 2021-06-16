### todo 

0.0.1:
* $ should wait - done
* timeout, headless setting from the user (as a plugin) - done* setup eslint for project and core - done
* use attempt in the scene not in the step - done
* better tagging support - done
* copy/paste support - done
* __prefix for the dev steps - done
* playwright typical functions like 'type' - done
* better plugin support - done
* multi-page scenarios - done
* tagFilter - add option to execute all if tags were not found in the project - done
* handle `Ctrl+A`, `Ctrl+C` shortcuts etc. - done

0.0.9:
* better fails/exception management - done
* better stacktrace of exceptions - done
* typescript stacktrace - done
* use `mark` as checked\unchecked - done
* errors namespace - done
* has.state 'visible|checked|disabled|editable|enabled|hidden' - done
* full assert supports - done
* https://www.chaijs.com/plugins/chai-webdriver/
* force user to use <> in $ and $$ - done
* stay with has.text for both innerText and value -done
* move playwright to the plugins - done
* use literal templates in $ and $$ - done
* add has.no - done
* one feature per file constraint - done
* summary report - done
* options from launcher - done
* launch.json for debugging -
* fix yarn build - done
* github lint workflow - done
* starter github repository - done
* publish version 1.0.0.alpha - done
* exercise:watch command - done
* copy/paste as recipe example - done
* playwright in the plugins - done
* https://github.com/microsoft/playwright/issues/2511

0.0.10:
* add `exists` state - done
* escape arguments inside the $,$$ functions - done
* add methods to the ClientElement - done
* custom assert recipes - done
* remove logs from the playwright errors - done
* file download - done
* file upload - done
* https://playwright.dev/docs/api/class-download
* https://playwright.dev/docs/api/class-filechooser
* till, iif - done
* wait - done
* waitSelector doesn't take into account page's timeout - done
* propagate tagName - done
* I.fill(input, stamp `my job #e2e-${stamp.time}`) - done
* session and local storages through the evaluate function - done

0.0.11
* `__pause` is frozen sometimes ??
* add fail\error hook in the scenario as a debug option, or add pause on fail plugin
* feature name /scenario name uniq constraint
* drag and drop
* and inspect to dbg in .debug, better debugging experience
* playwright logs, verbose reporting, file logs, integration longs e. with allure
* https://playwright.dev/docs/api/class-logger
* dialog support, alert(), confirm(), prompt()
* https://playwright.dev/docs/api/class-dialog
* video and screenshots support
* https://playwright.dev/docs/ci
* multiple test data for particular scenario like in cucumber | | | with @test decorator?
* define the final folder structure
* add `feature`, `component`, `recipe` postfixes? - already in the experimental branch
* better assert recipe

next
* skintest.io
* add max time that scenario could take (for `till` operations)
* add `secret` function to show `***` instead of value
* has.state doesn't trigger type checking, because string is extendable from the string
* better code parsing in the `meta.ts`
* add comments to the ego, selectors, recipes and keyboard keys
* remove redundant new lines in tty-report and tty-pause
* show fail/error solutions/links to solutions
* slowMo settings in camelCase - lint warning
* stubs/network intersection support
* start writing unit tests
* better reporting UX
* CI
* multiple selector strategy in $ and $$, data-test-id, search by the text
* CODE_REVIEW, CODING_STANDARDS https://github.com/angular/components

### questions

* add playwright plugin to make things like pw(async p => await p.evaluate...);
* example of using value from the selector like `I.fill(todos.what, as, todos.user)* maybe it should be a recipe?
* add script/feature error zone?
* recipe types `assert`, `query`?
* cli tool
* time 
* own inspector
* own chrome extension for codegen?, look for the extensions
* https://playwright.dev/docs/cli
* how to store secrets?
* propagate options to driver methods(like delay in dblcick)? through the global config?
* add recipes package? (oauth, copy/paste etc.)
* deal with translations?
* do we need special waiters for angular/react/view etc.
* introduce roles for writing features/recipes?
* schema concept? strict, not strict versions? 
* websockets?
* auth
* https://playwright.dev/docs/auth
* device emulation
* browser console messages? error catching?
* https://playwright.dev/docs/verification
* own browser instance for each feature/scenario/before.scenario?
* https://playwright.dev/docs/test-runners
* browser and node runners?
* https://gist.github.com/vzaidman/ef6e4b772b311ffb98368da5f7a9582a#file-codecept-example-js

### code style

* project page_objects, and field_names there
* project recipe_names
* feature, scenario, assert text should be in a lower case

* api ClassNames and InterfaceNames
* api CONSTANT_NAMES and SYMBOL_NAMES
* api functionNames and instanceNames

### ideas

```typescript
  .scenario('check getting value'
    , I.do(add_todo, 'send a letter')
    , I.fill(todos.what, from.text, todos.item_at(0)) // from.text
    , I.test('input contains text from the first todo')
    , I.see(todos.what, has.value, 'send a letter')
  )
```

```typescript
  .scenario('check complete button completes only checked items'
    , I.do(add_todo, 'send a letter')
    , I.do(add_todo, 'do exercise')
    , I.mark(todos.item_at(0), as, 'checked')
    , I.mark(todos.item_at(1), as, 'unchecked')
    , I.click(todos.complete)
    , I.test('todos list contains only the second item')
    , I.see(todos.item_at(0), has.text, 'do exercise')
  )
```

```typescript
async function navigate(product: string, item: string): Promise<Recipe> {
  return recipe(
    evaluate(`remove survey monkey`
      , serialize({})
      , function () {
        const { body } = document;
        body.setAttribute('id', 'test');
      }
    ),

    perform('do navigation'
      , I.click(hub.menu)
      , I.click(hub.menu_link(product))
      , I.do(wait_navigation)
      , iif(`not already on the product page`)
      , I.see(nav.title, has.no.text, product)
    ),
    
    perform(`navigation to the ${item}`
      , I.click(hub.sub_menu_link(item))
    ),
    
    perform('remove item'
      , I.hover(todos.item_label_at(0))
      , I.click(todos.item_remove_at(0))
      , till('list has items')
      , I.see(todos.list, has.length.above, 0)
    ),
  );
}
```

```typescript
  @test.data({ map: 'data.csv', to: my_model, })
  @test.run({ timeout: 5000 })
  .scenario('#now check the list supports many todos'
    , I.do(generate_todos, my_model)
    , I.test('list contains all the items')
    , I.see(todos.list, has.length, 10)
  )
```