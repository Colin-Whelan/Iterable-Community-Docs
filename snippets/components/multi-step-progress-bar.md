---
title: Multi-Step Progress Bar with Labels (Outlook Safe)
description: A segmented step-based progress bar with custom labels per step (up to 6).
category: components
tags: [progress-bar, steps, email-component]
context: email-template
author: Colin Whelan
links: []
---

A segmented step-based progress bar with custom labels per step (up to 6). Supports configurable active/inactive colors, dynamic step count, and MSO conditional rendering for Outlook. Steps auto-hide based on total_steps so unused segments don't render.

Customize the labels below as needed. Remove `{{#assign "label_#"}}Label{{/assign}}` as needed. Add more (up to 6) and the output auto-adjusts.


![Multi-step Progress Bar](assets/images/multi-step-progress-bar.png)


```handlebars
{{!-- CONFIG --}}
{{!-- outlook_width -> For legacy outlook --}}
{{!-- current_step -> Current Segment (up to 6) --}}
{{!-- active_color -> Any valid CSS color --}}
{{!-- inactive_color -> Any valid CSS color --}}
{{!-- progress_title -> Optional title for bar --}}

{{!-- CUSTOM LABELS --}}
{{#assign "label_1"}}Ordered{{/assign}}
{{#assign "label_2"}}Preparing{{/assign}}
{{#assign "label_3"}}Shipped{{/assign}}
{{#assign "label_4"}}In Transit{{/assign}}
{{#assign "label_5"}}Delivered{{/assign}}


{{#if label_6}}
    {{#assign "total_steps"}}6{{/assign}}
{{else if label_5}}
    {{#assign "total_steps"}}5{{/assign}}
{{else if label_4}}
    {{#assign "total_steps"}}4{{/assign}}
{{else if label_3}}
    {{#assign "total_steps"}}3{{/assign}}
{{else if label_2}}
    {{#assign "total_steps"}}2{{/assign}}
{{else if label_1}}
    {{#assign "total_steps"}}1{{/assign}}
{{/if}}

{{!-- AUTO-CONFIG --}}
{{#assign "segment_width_percent"}}{{math 100 '/' total_steps}}{{/assign}}
{{#assign "outlook_segment"}}{{math outlook_usable '/' total_steps}}{{/assign}}


{{#if progress_title}}
<!-- Title -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#333333; padding-bottom:8px;">
      {{progress_title}}
    </td>
  </tr>
</table>
{{/if}}

<!-- Segmented bar -->
<!--[if mso]>
<table role="presentation" width="{{outlook_width}}" cellpadding="0" cellspacing="0" border="0">
  <tr>
    {{#ifGte current_step 1}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 2}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 3}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 4}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 5}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 6}}<td width="{{outlook_segment}}" style="background-color:{{active_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{outlook_segment}}" style="background-color:{{inactive_color}}; height:10; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
  </tr>
</table>
<![endif]-->

<!--[if !mso]><!-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:6px; overflow:hidden;">
  <tr>
    {{#ifGte current_step 1}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 2}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 3}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 4}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 5}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
    {{#ifGte current_step 6}}<td width="{{segment_width_percent}}%" style="background-color:{{active_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{else}}<td width="{{segment_width_percent}}%" style="background-color:{{inactive_color}}; height:10px; font-size:0; line-height:0;">&nbsp;</td>{{/ifGte}}
  </tr>
</table>
<!--<![endif]-->

<!-- Step labels -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#ifGte current_step 1}}color:{{active_color}};{{else}}color:#999999;{{/ifGte}}">
      {{label_1}}
    </td>
    {{#if label_2}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#ifGte current_step 2}}color:{{active_color}};{{else}}color:#999999;{{/ifGte}}">
      {{label_2}}
    </td>{{/if}}
    {{#if label_3}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#ifGte current_step 3}}color:{{active_color}};{{else}}color:#999999;{{/ifGte}}">
      {{label_3}}
    </td>{{/if}}
    {{#if label_4}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#ifGte current_step 4}}color:{{active_color}};{{else}}color:#999999;{{/ifGte}}">
      {{label_4}}
    </td>{{/if}}
    {{#if label_5}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#ifGte current_step 6}}color:{{active_color}};{{else}}color:#999999;{{/ifGte}}">
      {{label_5}}
    </td>{{/if}}
    {{#if label_6}}<td width="{{segment_width_percent}}%" align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; padding-top:6px; {{#ifGte current_step 6}}color:{{active_color}};{{else}}color:#999999;{{/ifGte}}">
      {{label_6}}
    </td>{{/if}}
  </tr>
</table>
```

Save as a snippet with 'CONFIG' options as variables:

```handlebars
{{{ snippet "Module - Progress Bar - Multi-Step" outlook_width current_step active_color inactive_color progress_title }}}

Usage:
{{{ snippet "Module - Progress Bar - Multi-Step" 560 4 "indigo" "red" "Order Status" }}} 
```