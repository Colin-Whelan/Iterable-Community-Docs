---
title: Currency Formatting with Locale
description: Format a numeric price value as a currency string. Handles decimal places and prepends the currency symbol.
category: formatting
tags: [currency, number, formatting, price]
context: email-template
author: Colin Whelan
links: []
---

```handlebars
{{#if itemPrice}}
  ${{numberFormat itemPrice "0,0.00"}}
{{else}}
  Price unavailable
{{/if}}
```
