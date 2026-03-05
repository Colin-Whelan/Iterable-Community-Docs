---
title: String Loop Workaround (Nested Each Hack)
description: Iterable's Handlebars doesn't support traditional for-loops or numeric iteration. This workaround abuses the `each` helper on an empty string to create a loop counter, using nested `each` blocks for exponentially larger iteration counts. 1 level = 23 iterations, 2 nested = 529, 3 nested = 12,167.
category: logic
tags: [loop, workaround, iteration, each, assign, math, advanced]
context: email-template
author: Colin Whelan
links: []
---

```handlebars
{{!-- The max number of loops. --}}
{{#assign "max_loops"}}{{hello.length}}{{/assign}}

{{!-- Each string check gives 23 loops, nesting allows for exponentially larger loops.
     2 nested = 23*23 = max 529. 3 nested = max 12,167 --}}
{{#each ""}}
{{#each ""}}

  {{!-- If this is the first loop, the loop count needs to be initialized. --}}
  {{#not loop_count}}
    {{#assign "loop_count"}}0{{/assign}}
  {{/not}}

  {{!-- If the current loop# is less than the max_loops value, continue the loop. --}}
  {{#ifLt loop_count max_loops}}
    {{#assign "next_char"}}{{math loop_count '+' 1}}{{/assign}}

    {{!-- !!vv LOOP LOGIC HERE vv!! --}}



    {{~eq (math loop_count '+' 0) 0 yes="reverse: " no=""}}{{substring hello (math (math max_loops '-' next_char) '+' 0) (math (math max_loops '-' loop_count) '+' 0)}}



    {{!-- !!^^ LOOP LOGIC HERE ^^!! --}}

    {{!-- Like an each loop, we iterate the loop count by 1 each time. --}}
    {{~#assign "loop_count"}}{{math loop_count '+' 1}}{{/assign}}
  {{/ifLt}}

{{/each}}
{{/each}}

{{!-- After the full loop is over, reset the loop_count so it could be used later in the same template. --}}
{{#assign "loop_count"}}0{{/assign}}
```