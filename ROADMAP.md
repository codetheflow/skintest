# ROAD-MAP

### m.1
* [done] another way to filter features and scenarios
* [done] better reporting UX (error showing and summary table)
* [done] azure account
* [done] skintest.io
* [done] single quotes, semicolon, #now lints

### m.2
* [done] get rid of the project node explorer
* [done] search features by `--` attribute
* [done] playwright custom code as a task operation
* [done] playwright middleware
* [done] config to define pw options: window size, browser, device emulation etc.
* skintest server
* [done] grep for feature explorer

### m.3
* better assert task, test effect('break', 'continue', 'exit')
* define final test data, till, iif and wait APIs, use Value<> in `till` fn.
* define tags for the future
  
# m.4
* skintest-server
* skintest-starter
* default launch.json in skintest-starter
* define skintest-dev.ts to modify local data without pushing to the git.

# m.5
* fill documentation
* LICENSE
* CODE_OF_CONDUCT
* CONTRIBUTING
* BUG REPORTING
* CODE_STYLE
* CODE_REVIEW, CODING_STANDARDS https://github.com/angular/components
 
# m.6
* define the final folder structure and naming convention
* [bug] `__pause` is frozen sometimes
* add comments to the ego, selectors, tasks and keyboard keys
* CI/CD integration
* parallel runs
  
# m.backlog
* multiple file download support api
* multiple selector strategy in $ and $$
* [alpha] HMR support
* and inspect to dbg in .debug, better debugging experience
* in debug pause access to the components
* possibility to setup a global suite level fn to intercept routing, page settings, session storage update, global navigation event etc.
* custom code between task operations
* tty-report verbose mode (show up task's steps)
* in multi-page scenarios show the tab near the step in tty-report
* skintest runner, cli, bin, ts-node support(debugging)?
* better code parsing in the `meta.ts`
* dialog support, alert(), confirm(), prompt()
* drag and drop
* add `secret` function to show `***` instead of value
* pauseOnFail
* retryFailed
* cancelOnFail
* runFailedFirst
* on failure show code pieces in tty report
* custom timeout?
* https://playwright.dev/docs/api/class-dialog
* test data in operators
* screenshot\video on fail
* playwright logs, verbose reporting, file logs, integration longs e. with allure
* https://playwright.dev/docs/api/class-logger
* video and screenshots support
* https://playwright.dev/docs/ci
* add fail\error hook in the scenario as a debug option
* has.state doesn't trigger type checking, because string is extendable from the string
* show fail/error solutions/links to solutions
* slowMo settings in camelCase - lint warning
* unit tests
* add playwright plugin to make things like pw(async p => await p.evaluate...);
* example of using value from the selector like `I.fill(todos.what, as, todos.user)* maybe it should be a task?
* add script/feature error zone?
* task type  `query`?
* cli tool
* time 
* own inspector
* own chrome extension for codegen?, look for the extensions
* https://playwright.dev/docs/cli
* how to store secrets?
* propagate options to driver methods(like delay in dblcick)? through the global config?
* deal with translations?
* do we need special waiters for angular/react/view etc.
* introduce roles for writing features/task?
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
* selector strategy - data-test-id, search by the text

# m.enterprise
* stripe integration
* read csv\excel\json\yml
* file system predicates
* email reporting
* wrike, jira integration
* telegram, slack reporting
* oauth logins
* test runner panel