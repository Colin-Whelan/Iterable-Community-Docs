---
title: Multi-Step Progress Bar with Labels (Outlook Safe)
description: A segmented step-based progress bar with custom labels per step (up to 6). Supports configurable active/inactive colors, dynamic step count, and MSO conditional rendering for Outlook. Steps auto-hide based on total_steps so unused segments don't render.
category: components
tags: [progress-bar, steps, email-component]
context: email-template
author: Colin Whelan
links: []
---

```handlebars
{{!-- CONFIG --}}
{{#assign "outlook_width"}}560{{/assign}} {{!-- For legacy outlook --}}
{{#assign "total_steps"}}5{{/assign}} {{!-- Total Segments (up to 6) --}}
{{#assign "current_step"}}2{{/assign}} {{!-- Current Segment (up to 6) --}}
{{#assign "active_color"}}#2ECC71{{/assign}} {{!-- Any valid CSS color --}}
{{#assign "inactive_color"}}#e0e0e0{{/assign}} {{!-- Any valid CSS color --}}
{{!-- CUSTOM LABELS --}}
{{#assign "label_1"}}Ordered{{/assign}}
{{#assign "label_2"}}Preparing{{/assign}}
{{#assign "label_3"}}Shipped{{/assign}}
{{#assign "label_4"}}In Transit{{/assign}}
{{#assign "label_5"}}Delivered{{/assign}}

{{!-- AUTO-CONFIG --}}
{{#assign "segment_width_percent"}}{{math 100 '/' total_steps}}{{/assign}}
{{#assign "outlook_usable"}}{{math outlook_width '-' (math total_gaps '*' gap_width)}}{{/assign}}
{{#assign "outlook_segment"}}{{math outlook_usable '/' total_steps}}{{/assign}}

<!-- Title -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#333333; padding-bottom:8px;">
      Order Status
    </td>
  </tr>
</table>

<!-- Segmented bar -->
<!--[if mso]>
<table role="presentation" width="{{outlook_width}}" cellpadding="0" cellspacing="0" border="0">
  <tr>
    {{#gte (math current_step '+' 0) 1}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 2}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 3}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 4}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 5}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 6}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
  </tr>
</table>
<![endif]-->

<!--[if !mso]><!-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:6px; overflow:hidden;">
  <tr>
    {{#gte (math current_step '+' 0) 1}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 2}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 3}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 4}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 5}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
    {{#gte (math current_step '+' 0) 6}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/gte}}
  </tr>
</table>
<!--<![endif]-->

<!-- Step labels -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#gte (math current_step '+' 0) 1}}color:{{active_color}};{{else}}color:#999999;{{/gte}}">
      {{label_1}}
    </td>
    {{#gte (math total_steps '+' 0) 2}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#gte (math current_step '+' 0) 2}}color:{{active_color}};{{else}}color:#999999;{{/gte}}">
      {{label_2}}
    </td>{{/gte}}
    {{#gte (math total_steps '+' 0) 3}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#gte (math current_step '+' 0) 3}}color:{{active_color}};{{else}}color:#999999;{{/gte}}">
      {{label_3}}
    </td>{{/gte}}
    {{#gte (math total_steps '+' 0) 4}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#gte (math current_step '+' 0) 4}}color:{{active_color}};{{else}}color:#999999;{{/gte}}">
      {{label_4}}
    </td>{{/gte}}
    {{#gte (math total_steps '+' 0) 5}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#gte (math current_step '+' 0) 5}}color:{{active_color}};{{else}}color:#999999;{{/gte}}">
      {{label_5}}
    </td>{{/gte}}
    {{#gte (math total_steps '+' 0) 6}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#gte (math current_step '+' 0) 6}}color:{{active_color}};{{else}}color:#999999;{{/gte}}">
      {{label_6}}
    </td>{{/gte}}
  </tr>
</table>
```
