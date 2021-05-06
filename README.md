skintest

# skintest
ui automatization framework

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
### todo 

* skintest.io
* cli tool
* setup eslint for project and core
* time travel
* fill supporting of asserts
* https://www.chaijs.com/plugins/chai-webdriver/
* https://www.chaijs.com/plugins/chai-dom/
* has.state 'visible|checked|disabled|editable|enabled|hidden'
* better exception managment
* stubs support
* keyboard keys to lowercase and type checking
* multiple selector strategy, data-test-id, search by the text
* deal with translations?
* timeout, headless setting from the user
* file upload/download
* playwright typical functions like 'type'
* drag and drop
* recipe library (oauth etc)
* use value from the selector like `I.fill(todos.what, todos.user)`
* and inspect to dbg in .debug

### questions

* how to store secrets?
* do we need special waiters for angular/react/view etc.
* introduce roles for writing features/recipes
* __prefix for the dev steps
* do we really need check step
* schema concept? strict, not strict versions? 
* recipe type `assert`



### code style

* project page_objects, and field_names there
* project recipe_names

* api ClassNames and InterfaceNames
* api CONSTANT_NAMES and SYMBOL_NAMES
* api functionNames and instanceNamess






