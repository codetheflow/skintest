---
layout: guide
title: Architecture
date: 2021-06-25 11:43:53
---

* [Architecture](#Architecture)
* [Features and scenarios](#Features-and-scenarios)
* [Multi page support](#Multi-page-support)
* [Component's eyes and selectors](#Component-eyes)
* [Fluent asserts](#Fluent-asserts)
* [Cooking recipes](#Cooking-recipes)
* [The runner - skintest.ts](#The-runner)
* [Debugging](#Debugging)
* [Tag-filter](#Tag-filter)
* [Custom plugins](#Custom-plugins)
* [Test data](#Test-data)
* [Secrets and environment](#Secrets-and-environment)
* [Reporting](#Reporting)
* [Iframes](#Iframes)
* [Shadow dom](#Shadow-dom)
* [Parallel execution](#Parallel-execution)
* [Browser-support](#Browser-support)
* [CI\CD](#CI\CD)



<div class="guide__article">

## Architecture

Architecture (Latin architectura, from the Greek ἀρχιτέκτων arkhitekton "architect", from ἀρχι- "chief" and τέκτων "creator") is both the process and the product of planning, designing, and constructing buildings or other structures.[3] Architectural works, in the material form of buildings, are often perceived as cultural symbols and as works of art. Historical civilizations are often identified with their surviving architectural achievements.[4]

The practice, which began in the prehistoric era, has been used as a way of expressing culture for civilizations on all seven continents.[5] For this reason, architecture is considered to be a form of art. Texts on architecture have been written since ancient time. The earliest surviving text on architectural theory is the 1st century AD treatise De architectura by the Roman architect Vitruvius, according to whom a good building embodies firmitas, utilitas, and venustas (durability, utility, and beauty). Centuries later, Leon Battista Alberti developed his ideas further, seeing beauty as an objective quality of buildings to be found in their proportions. Giorgio Vasari wrote Lives of the Most Excellent Painters, Sculptors, and Architects and put forward the idea of style in the arts in the 16th century. In the 19th century, Louis Sullivan declared that "form follows function". "Function" began to replace the classical "utility" and was understood to include not only practical but also aesthetic, psychological and cultural dimensions. The idea of sustainable architecture was introduced in the late 20th century.

Architecture began as rural, oral vernacular architecture that developed from trial and error to successful replication. Ancient urban architecture was preoccupied with building religious structures and buildings symbolizing the political power of rulers until Greek and Roman architecture shifted focus to civic virtues. Indian and Chinese architecture influenced forms all over Asia and Buddhist architecture in particular took diverse local flavors. During the European Middle Ages, pan-European styles of Romanesque and Gothic cathedrals and abbeys emerged while the Renaissance favored Classical forms implemented by architects known by name. Later, the roles of architects and engineers became separated. Modern architecture began after World War I as an avant-garde movement that sought to develop a completely new style appropriate for a new post-war social and economic order focused on meeting the needs of the middle and working classes. Emphasis was put on modern techniques, materials, and simplified geometric forms, paving the way for high-rise superstructures. Many architects became disillusioned with modernism which they perceived as ahistorical and anti-aesthetic, and postmodern and contemporary architecture developed.

## Features and scenarios

Architecture (Latin architectura, from the Greek ἀρχιτέκτων arkhitekton "architect", from ἀρχι- "chief" and τέκτων "creator") is both the process and the product of planning, designing, and constructing buildings or other structures.[3] Architectural works, in the material form of buildings, are often perceived as cultural symbols and as works of art. Historical civilizations are often identified with their surviving architectural achievements.

  <div class="overflow">

```typescript
  .scenario(‘ check the list has all added items’
    , I.do(add_todo, ‘learn testing’)
    , I.do(add_todo, ‘be cool’)
    , I.test(‘list contains added items’)
    , I.see(todos.list, has.lenght, 2)
    , I.see(todos.item_label_at(0), has.text, ‘learn testing’)
    , I.see(todos.item_label_at(1), has.text, ‘be cool’)
  )
```
  </div>

## Multi page support 

Architecture (Latin architectura, from the Greek ἀρχιτέκτων arkhitekton "architect", from ἀρχι- "chief" and τέκτων "creator") is both the process and the product of planning, designing, and constructing buildings or other structures.[3] Architectural works, in the material form of buildings, are often perceived as cultural symbols and as works of art. Historical civilizations are often identified with their surviving architectural achievements.

  <div class="overflow">

```typescript
  .scenario(‘ check the list has all added items’
    , I.do(add_todo, ‘learn testing’)
    , I.do(add_todo, ‘be cool’)
    , I.test(‘list contains added items’)
    , I.see(todos.list, has.lenght, 2)
    , I.see(todos.item_label_at(0), has.text, ‘learn testing’)
    , I.see(todos.item_label_at(1), has.text, ‘be cool’)
  )
```
  </div>
</div>