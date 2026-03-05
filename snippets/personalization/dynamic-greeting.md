---
title: Dynamic Greeting by Time of Day
description: Shows morning, afternoon, or evening greeting based on the current hour at send time. Uses dateFormat to extract the hour and conditional logic to branch.
category: personalization
tags: [time, greeting, conditional, dateFormat]
context: email-template
author: Colin Whelan
links:
  - label: Iterable Date Functions
    url: https://support.iterable.com/hc/en-us/articles/205480365-Date-and-Time-Formatting
---

```handlebars
{{#if (greaterThan (toInteger (dateFormat currentDate "H")) 17)}}
  Good evening, {{firstName}}!
{{else if (greaterThan (toInteger (dateFormat currentDate "H")) 11)}}
  Good afternoon, {{firstName}}!
{{else}}
  Good morning, {{firstName}}!
{{/if}}
```
