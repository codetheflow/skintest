### todo 

m1
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

m2
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

m3
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
* copy/paste - done

m4
* multiple test data for particular scenario like in cucumber | | | - done
* schema concept? strict, not strict versions - done

m5
* ts-node support
* `__pause` is frozen sometimes ??
* error file path is incorrect
* feature name /scenario name uniq constraint
* define the final folder structure
* add `feature`, `component`, `recipe` postfixes? - already in the experimental branch
* better assert recipe
* test effect

m6
* better reporting UX
* better code parsing in the `meta.ts`
* add `secret` function to show `***` instead of value
* dialog support, alert(), confirm(), prompt()
* https://playwright.dev/docs/api/class-dialog
* add comments to the ego, selectors, recipes and keyboard keys
* multi browsers launch options
* global navigation event
* launch.json
* index in `data` fn
* support index in `till` operator

m7
* skintest.io
* stripe integration
* azure account
* read csv\excel\json\yml
* file system predicates

m8
* email reporting
* ci/cd integration
* test.data in operators
* drag and drop

m9
* telegram, slack reporting
* wrike, jira integration
* cancel run on fail
* run failed specs first
* pauseOnFail
* retryFailed
* screenshot\video on fail

next
* oauth logins
* custom timeout?
* playwright logs, verbose reporting, file logs, integration longs e. with allure
* https://playwright.dev/docs/api/class-logger
* video and screenshots support
* https://playwright.dev/docs/ci
* multiple selector strategy in $ and $$, data-test-id, search by the text
* add fail\error hook in the scenario as a debug option, or add pause on fail plugin
* and inspect to dbg in .debug, better debugging experience* add max time that scenario could take (for `till` operations)
* has.state doesn't trigger type checking, because string is extendable from the string
* remove redundant new lines in tty-report and tty-pause
* show fail/error solutions/links to solutions
* slowMo settings in camelCase - lint warning
* stubs/network intersection support
* start writing unit tests
* CODE_REVIEW, CODING_STANDARDS https://github.com/angular/components
* in pause access to the components
* add playwright plugin to make things like pw(async p => await p.evaluate...);
* example of using value from the selector like `I.fill(todos.what, as, todos.user)* maybe it should be a recipe?
* add script/feature error zone?
* recipe type  `query`?
* cli tool
* time 
* own inspector
* own chrome extension for codegen?, look for the extensions
* https://playwright.dev/docs/cli
* how to store secrets?
* propagate options to driver methods(like delay in dblcick)? through the global config?
* deal with translations?
* do we need special waiters for angular/react/view etc.
* introduce roles for writing features/recipes?
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