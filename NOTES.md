# NOTES

### hmr

* use #hmr/#now tag in particular scenario to stop and continue
* `stop` is an end of the scenario or error in the scenario, browser and page are not closing
* only one #hmr/#now tag can be in the suite
* save `stop` location in memory
* watch file change in the scenario file and all it's imports
* on file change:
1. if not scenario file was changed(one of the imports) - hard rerun whole scenario
2. if scenario file was changed calculate scenario diff:
3. if `diff` is green(previous `stop` is bellow diff) - run diff steps
4. if `diff` is red(previous `stop` is above diff) - hard rerun whole scenario
5. if `no diff` - do nothing 
* if scenario name was changed - hard rerun whole suite

### cli

* yarn st

build --env-name?
update
add project
add feature
add component
add task

edit project

run once
run live

lint ?

* - action?: add | edit
* -- add:
* --- name?: project4
* --- deps?: [project1, project2, project3]
* -- edit:
* --- name?: [project1, project2, project3]
* --- deps?: [project1, project2, project3]

* yarn cli feature:
* -- project: [project1, project2, project3]