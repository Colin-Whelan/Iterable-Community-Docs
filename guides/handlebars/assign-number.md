---
title: Assign as Number
description: Special code for working with numbers in {{#assign}}
category: logic
tags: [math, logic]
context: email-template
author: Colin Whelan
links: []
---

```handlebars
{{!-- CONFIG --}}
{{#assign "outlook_width"}}560{{/assign}} {{!-- For legacy outlook --}}
{{#assign "progress_percent"}}65{{/assign}} {{!-- percentage as a whole number --}}
{{#assign "color"}}#4A90D9{{/assign}} {{!-- Any valid CSS color --}}

{{!-- AUTO-CONFIG --}}
{{#assign "progress_remaining_percent"}}{{math 100 '-' progress_percent}}{{/assign}}
{{#assign "outlook_filled_width"}}{{math outlook_width '*' (math progress_percent '/' 100)}}{{/assign}}
{{#assign "outlook_remaining_width"}}{{math outlook_width '-' outlook_filled_width}}{{/assign}}

<!-- Label row -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="left" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#333333; padding-bottom:8px;">
      Your Progress
    </td>
    <td align="right" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#333333; padding-bottom:8px;">
      {{progress_percent}}%
    </td>
  </tr>
</table>

<!-- Bar -->
<!--[if mso]>
<table role="presentation" width="{{outlook_width}}" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="{{outlook_filled_width}}" style="background-color:{{color}}; height:12; font-size:0; line-height:0;">&nbsp;</td>
    <td width="{{outlook_remaining_width}}" style="background-color:#e0e0e0; height:12; font-size:0; line-height:0;">&nbsp;</td>
  </tr>
</table>
<![endif]-->
<!--[if !mso]><!-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:6px; overflow:hidden;">
  <tr>
    <td width="{{progress_percent}}%" style="background-color:{{color}}; height:12px; font-size:0; line-height:0; border-radius:6px 0 0 6px;">&nbsp;</td>
    <td width="{{progress_remaining_percent}}%" style="background-color:#e0e0e0; height:12px; font-size:0; line-height:0; border-radius:0 6px 6px 0;">&nbsp;</td>
  </tr>
</table>
<!--<![endif]-->
```
