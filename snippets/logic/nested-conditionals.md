---
title: Nested Conditional with Fallback
description: Demonstrates nested if/else logic with a safe fallback value when user profile fields may be missing.
category: logic
tags: [conditional]
context: email-template
author: Colin Whelan
links:
  - label: Iterable Handlebars Reference
    url: https://support.iterable.com/hc/en-us/articles/205480365
---

```handlebars
{{#if userProfile.preferredCategory}}
  {{#if (eq userProfile.preferredCategory "electronics")}}
    Check out our latest gadgets!
  {{else if (eq userProfile.preferredCategory "clothing")}}
    New arrivals in fashion just for you.
  {{else}}
    Explore what's trending in {{userProfile.preferredCategory}}.
  {{/if}}
{{else}}
  Discover something new today!
{{/if}}
```
