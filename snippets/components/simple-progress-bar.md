---
title: Simple Progress Bar (Outlook Safe)
description: A percentage-based progress bar with configurable color and width.
category: components
tags: [progress-bar, email-component]
context: email-template
author: Colin Whelan
links: []
---

A percentage-based progress bar with configurable color and width. Uses MSO conditional comments for Outlook compatibility with fixed-width fallback, and fluid percentage widths for modern clients. Includes a label row showing the percentage value.

![Simple Progress Bar](assets/images/simple-progress-bar.png)

```handlebars
{{!-- CONFIG --}}
{{!-- outlook_width -> For legacy outlook --}}
{{!-- bar_percent -> percentage as a whole number --}}
{{!-- bar_color -> Any valid CSS color --}}
{{!-- bar_title -> Text for left side above bar --}}

{{!-- AUTO-CONFIG --}}
{{#assign "progress_remaining_percent"}}{{math 100 '-' bar_percent}}{{/assign}}
{{#assign "outlook_filled_width"}}{{math outlook_width '*' (math bar_percent '/' 100)}}{{/assign}}
{{#assign "outlook_remaining_width"}}{{math outlook_width '-' outlook_filled_width}}{{/assign}}

<!-- Label row -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="left" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#333333; padding-bottom:8px;">
      {{bar_title}}
    </td>
    <td align="right" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#333333; padding-bottom:8px;">
      {{bar_percent}}%
    </td>
  </tr>
</table>

<!-- Bar -->
<!--[if mso]>
<table role="presentation" width="{{outlook_width}}" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="{{outlook_filled_width}}" style="background-color:{{bar_color}}; height:12; font-size:0; line-height:0;">&nbsp;</td>
    <td width="{{outlook_remaining_width}}" style="background-color:#e0e0e0; height:12; font-size:0; line-height:0;">&nbsp;</td>
  </tr>
</table>
<![endif]-->
<!--[if !mso]><!-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:6px; overflow:hidden;">
  <tr>
    <td width="{{bar_percent}}%" style="background-color:{{bar_color}}; height:12px; font-size:0; line-height:0; border-radius:6px 0 0 6px;">&nbsp;</td>
    <td width="{{progress_remaining_percent}}%" style="background-color:#e0e0e0; height:12px; font-size:0; line-height:0; border-radius:0 6px 6px 0;">&nbsp;</td>
  </tr>
</table>
<!--<![endif]-->
```

Save as a snippet with 'CONFIG' options as variables:

```handlebars
{{{ snippet "Module - Progress Bar - Simple" outlook_width bar_percent bar_color bar_title }}}

Usage:
{{{ snippet "Module - Progress Bar - Simple" 560 25 "red" "Progress to next tier" }}}
```
