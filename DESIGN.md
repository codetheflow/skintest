# skintest
ui automatization framework

### todo 

0.1.0:
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

0.2.0:
* better fails/exception management - done
* better stacktrace of exceptions - done
* full assert supports
* https://www.chaijs.com/plugins/chai-webdriver/
* https://www.chaijs.com/plugins/chai-dom/
* has.state 'visible|checked|disabled|editable|enabled|hidden'
* launch.json for debugging
* has.text and has.value are very similar, for inputs maybe make only value available or stay only with has.text
* waitSelector doesn't take into account page's timeout
* and inspect to dbg in .debug, better debugging experience
* total report
* fix yarn build
* starter github repository
* publish version 0.0.1

0.3.0:
* use value from the selector like `I.fill(todos.what, from.value, todos.user)`
* add comments to the ego, selectors and recipes
* show fail/error solutions/links to solutions
* better code parsing in the `meta.ts`
* file upload/download, how to assert results?
* slowMo settings in camelCase - lint warning
* start:watch command
* stubs/network intersection support
* keyboard keys - documentation

next
* reporting UX
* CI
* multiple selector strategy in $ and $$, data-test-id, search by the text
* https://playwright.dev/docs/api/class-download
* https://playwright.dev/docs/api/class-filechooser
* drag and drop
* playwright logs, verbose reporting, file logs, integration longs e. with allure
* https://playwright.dev/docs/api/class-logger
* add documentation
* https://playwright.dev/docs/selectors
* dialog support, alert(), confirm(), prompt()
* https://playwright.dev/docs/api/class-dialog
* video and screenshots support
* https://playwright.dev/docs/ci
* copy/paste as recipe example
* https://github.com/microsoft/playwright/issues/2511


### questions
* $$ should wait?
* add `feature`, `component`, `recipe` postfixes?
* recipe type `assert`?
* skintest.io
* cli tool
* time 
* own inspector
* own chrome extension for codegen?, look for the extensions
* https://playwright.dev/docs/cli
* how to store secrets?
* propagate options to driver methods(like delay in dblcick)? through the global config?
* recipe library (oauth, copy/paste etc.)
* deal with translations?
* do we need special waiters for angular/react/view etc.
* introduce roles for writing features/recipes
* do we really need `test` step? - yes
* schema concept? strict, not strict versions? 
* websockets?
* auth, session and local storages?
* https://playwright.dev/docs/auth
* device emulation
* playwright as a plugin?
* browser console messages? error catching?
* https://playwright.dev/docs/verification
* own browser instance for each feature/scenario/before.scenario?
* https://playwright.dev/docs/test-runners
* browser and node runners?
* https://gist.github.com/vzaidman/ef6e4b772b311ffb98368da5f7a9582a#file-codecept-example-js
* press vs hit? press target?

### code style

* project page_objects, and field_names there
* project recipe_names
* feature, scenario, assert text should be in a lower case

* api ClassNames and InterfaceNames
* api CONSTANT_NAMES and SYMBOL_NAMES
* api functionNames and instanceNames

### ideas

```typescript
  .scenario('#now check getting value'
    , I.do(add_todo, 'send a letter')
    , I.fill(todos.what, from.text, todos.item_at(0)) // from.text
    , I.test('input contains text from the first todo')
    , I.see(todos.what, has.value, 'send a letter')
  )
```
