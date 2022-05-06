# NOTES

### hmr
* ops, NO_IO - check/assert/dev/info, 
** mov: op NO_IO - nothing, IO - if between oldIndex and newIndex there are only NO_IO steps - nothing, else exit


* if op.index < step
** del: op`NO_IO - nothing, IO - exit
** add: op`NO_IO - nothing, IO - exit

* if op.oldIndex < step
** mov: op`NO_IO - if newIndex is greater or eq than step then append, else nothing, IO - if between oldIndex and newIndex there are only NO_IO steps - nothing, else exit

* if op.oldIndex > step
** mov: invalid operation

* if op.oldIndex == step
** mov: op`NO_IO - if newIndex is greater than step then append, else nothing, IO - if between oldIndex and newIndex there are only NO_IO steps - nothing, else exit

* if op > step
** del: invalid operation
** add: append to the current steps

* if op == step
** del: op`NO_IO - nothing, IO - exit if cmd was CLIENT and succeed 
** add: nothing

a    a     
b    c
c    d
     b  

[c, d]
[d]

a   c
b 
c

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


```typescript

export const clear_todos = (I: Actor, mode: 'up' | 'down') => 
  tap(async () => console.log(`I'm in clear_todos task`),

  perform('open clear todos pages'
    , I.open('clear_todos.com')
  ),

  perform('remove first item'
    , I.hover($todos.item_label_at(0))
    , I.click($todos.item_remove_at(0))
  ),

  till('there are items'
    , I.see($todos.list, has.length.above, 0)
    , perform('remove first item'
        , I.hover($todos.item_label_at(0))
        , I.click($todos.item_remove_at(0)
      )  
  )

  // how to implement forEach?

);

export async function clear_todos(I: Actor): Promise<Task> {
  return task(

    perform('remove items'
      , I.hover($todos.item_label_at(0))
      , I.click($todos.item_remove_at(0))
      , till('list has items')
      , I.see($todos.list, has.length.above, 0)
    ),

    perform('remove items'
      , I.do(clear_todos)
      , iif('list has items')
      , I.see($todos.list, has.length.above, 0)
    ),

    perform('remove items' 
      , I.do('remove items')
      , I.see(that_list_has_items)
      , I.wait('download', )
    )

    iif('list has items'
      , I.see($todos.list, has.length.above, 0)
      , I.say('remove items')
      , I.do(clear_todos)
    )

    when('list has one item'
      ,  I.see($todos.list, has.length, 1)
      
      ,  perform('remove first item'
          , I.hover($todos.item_label_at(0))
          , I.click($todos.item_remove_at(0))
      )
    )

    till('list has items'
      , I.see($todos.list, has.length.above, 0)
      
      , perform('remove top item'
          , I.hover($todos.item_label_at(0))
          , I.click($todos.item_remove_at(0))
      )
    ),

    // till , continue and break
    // when - skip, skip.if, nested if, nested loop

    // test($todos.list, has.length
    //   , when(0)
    //   , perform()
    //   , when
    // )
    //   , I.test($todos.list, has.length ,{
    //     0: perform()
    //   })
    // )

    perform('export csv file'
      , I.click('')
      , I.click('')
    ),

    handle('download csv file'
      , I.wait('download')
    
      , perform('export csv file'
          , I.click('export button')
      ),
    )
    
  );
}
```