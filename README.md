skintest

# skintest
complete e2e testing tool

### how to run

first terminal:
```bash
cd api 
npm run build:watch
```

second terminal:
```bash
cd sandbox
npm run start
```

### questions

* reuse scenarios - is it good? how to implement?
* scenarios are sequantial or standalone?
* how to store secrets?
* sync feature name and file name
* how to wait when angular/react/view etc. is loaded?
* think about cli
* eslint is very important
* time travel?
* better asserts

### names

* skintest
* quaken/quakken
* testik
* testmaster
* testbar
* teststory/teststoriya
* testpage
* testsprint
* testscene/testskin
* skintest

### code thoughts

* rename select to `$`, selectAll to `$$`

### code style

* project page_objects
* project function_names

* api ClassNames and InterfaceNames
* api CONSTANT_NAMES and SYMBOL_NAMES
* api functionNames 

### functions
function rename to reciept

### misc
get rid of index.ts in functions and components
think about try/catch in scene.play
roles (scenarios/components | functions/project)

introduce fixture(mocks) -> mock envirnoment, api calls etc (rename current fixture to something)
in typescript

rename spec to integration?

Key should be type checked

think about assertion lib
hasClass

assertion
first argument is always selector?
what about file download?
new function type assert?
https://www.chaijs.com/plugins/chai-webdriver/
https://www.chaijs.com/plugins/chai-dom/
is and has?
array vs single element
data-test-id
has.state 'visible|checked|disabled|editable|enabled|hidden'


https://www.youtube.com/watch?v=9vq6ZUQ4lok&ab_channel=AlfaDigital

how to use in scenario?