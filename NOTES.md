### todo 

# m.1
* skintest runner, cli, bin, ts-node support(debugging)?
* feature name /scenario name uniq constraint
* define the final folder structure
* add `feature`, `component`, `recipe` postfixes? - already in the experimental branch
* better assert recipe, test effect - 'break', 'continue', 'exit'?
* default launch.json
* define final data, till and iif APIs, index in `data`, `till` fn?
* add skintest.dev.ts to modify volatile data, add it to git ignore?
* experiment with route intersection api, test data in ops and global navigation events
* config to define multi-browsers
* one project or multiple projects?

# m.2
* better reporting UX
* add comments to the ego, selectors, recipes and keyboard keys
* skintest.io
* stripe integration
* azure account
* CI/CD integration
* LICENSE
* CODE_OF_CONDUCT
* CONTRIBUTING
* BUG REPORTING
* CODE_STYLE

# m.next
* `__pause` is frozen sometimes ??
* check stack trace file path on error
* better code parsing in the `meta.ts`
* add `secret` function to show `***` instead of value
* dialog support, alert(), confirm(), prompt()
* https://playwright.dev/docs/api/class-dialog
* multi browsers launch options
* global navigation event
* read csv\excel\json\yml
* file system predicates
* email reporting
* test data in operators
* drag and drop
* telegram, slack reporting
* wrike, jira integration
* cancel run on fail
* run failed specs first
* pauseOnFail
* retryFailed
* screenshot\video on fail
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