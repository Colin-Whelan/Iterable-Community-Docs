---
title: Generic for-loop
description: Iterable's Handlebars doesn't support traditional for-loops or numeric iteration. This workaround abuses the `each` helper on an empty string to create a loop counter, using nested `each` blocks for exponentially larger iteration counts. 1 level = 23 iterations, 2 nested = 529, 3 nested = 12,167.
category: logic
tags: [loop, workaround, advanced]
context: email-template
author: Colin Whelan
---

For unknown reasons, `{{#each ""}}` results in 23 loops. By nesting repeated 'each' blocks, the number of loops is multiplied by 23. 2 nested blocks is 529 max loops, 3 nested blocks is 12,167 max loops. 

The value of `max_loops` can be set abritrarily, either inline with a static value or using a dynamic data field such as profile or event data.

```handlebars
{{!-- The max number of loops. --}}
{{#assign "max_loops"}}33{{/assign}}

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

    {{!-- !!vv LOOP LOGIC HERE vv!! --}}



    {{#assign "next_char"}}{{math loop_count '+' 1}}{{/assign}}
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

> Output:
> reverse: 32 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0