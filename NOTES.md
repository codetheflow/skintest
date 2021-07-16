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