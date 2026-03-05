---
title: Loop Through Data Feed Items
description: Iterate over a data feed collection to render product cards or list items dynamically. Includes an index counter and empty-state fallback.
category: data-feeds
tags: [loop, each, data-feed, iteration, products]
context: email-template
author: Colin Whelan
links:
  - label: Iterable Data Feeds
    url: https://support.iterable.com/hc/en-us/articles/360033361192
---

```handlebars
{{#if dataFeedItems}}
  {{#each dataFeedItems}}
    <div class="product-card">
      <img src="{{this.imageUrl}}" alt="{{this.name}}" />
      <h3>{{this.name}}</h3>
      <p>${{numberFormat this.price "0.00"}}</p>
      {{#if this.onSale}}
        <span class="badge">Sale</span>
      {{/if}}
    </div>
  {{/each}}
{{else}}
  <p>Check back soon for new recommendations!</p>
{{/if}}
```
