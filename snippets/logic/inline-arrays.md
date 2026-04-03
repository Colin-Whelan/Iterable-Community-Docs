---
title: Handling Inline Arrays in Handlebars Email Templates
description: A comprehensive guide to implementing custom inline array logic within Iterable email templates using Handlebars, including a workaround for parsing numeric and alphanumeric strings without native JSON support.
category: logic
tags: [loop, workaround, advanced]
context: email-template
author: colin-whelan
links:
  - label: Iterable Handlebars Documentation
    url: https://support.iterable.com/hc/en-us/articles/360048125974-Handlebars-Templates-for-Emails
---

# Handling Inline Arrays in Handlebars Email Templates

This guide details an advanced workaround for processing inline arrays within Iterable's Handlebars email templates. While standard JSON array syntax is often supported, this method provides a solution for simple numeric and alphanumeric inline arrays.

## Overview

The core challenge addressed here is the need to define and iterate over an array of values (numbers and strings) directly within the template logic without relying on external data sources. The solution involves:
1.  Defining a raw string representation of an array.
2.  Creating a custom snippet (`return_array_value`) to parse this string character-by-character.
3.  Utilizing nested loops and conditional logic to extract values by index.

## Implementation Strategy

### 1. Array Definition
The array is defined as a string variable using the `assign` helper. 

```handlebars
{{#assign "test_cases"}}[2.23,test,,0,-9.20,-4]{{/assign}}
```

### 2. The Parsing Snippet: `return_array_value`
The logic relies on a reusable snippet named `return_array_value` with 2 variables `z_myArray` and `return_index`. `z_myArray` will be the plaintext array, `return_index` is the index to return or the size of the array if "size" is passed. This snippet iterates through every character of the plaintext array, identifying commas as delimiters to isolate individual values.

**Snippet Logic Breakdown:**
*   **Preprocessing:** Removes brackets `[` and `]` and appends a trailing comma to ensure the last element is captured correctly.
*   **Character Looping:** Uses nested loops to traverse the string one character at a time.
*   **Delimiter Detection:** When a comma `,` is encountered, the current accumulated value is finalized.
*   **Index Matching:** If the current loop iteration matches the requested `return_index`, the value is returned; otherwise, it continues parsing.

```handlebars
{{!-- Prepping Array Format For Looping --}}
{{#assign "zz_myArray"}}{{replace z_myArray "[" ""}}{{/assign}}
{{#assign "zz_myArray"}}{{replace zz_myArray "]" ""}}{{/assign}}
{{#assign "zz_myArray"}}{{zz_myArray}},{{/assign}}

{{!-- Max chars in the array --}}
{{#assign "max_index"}}999{{/assign}}

{{!-- Outer Loop: Test Cases --}}
{{#assign "t"}}0{{/assign}}
{{#each ""}}
{{#ifLt t max_index}}
  
  {{#assign "currentVal"}}{{/assign}}
  {{#assign "found"}}{{/assign}}
  
  {{!-- handles ~500 char array max --}}
  {{#each ""}}
  {{#each ""}}
    {{#unless found}}
      {{#assign "char"}}{{substring zz_myArray 0 1}}{{/assign}}
      
      {{#ifEq char ","}}
        {{#assign "found"}}true{{/assign}}
      {{else}}
        {{#assign "currentVal"}}{{currentVal}}{{char}}{{/assign}}
      {{/ifEq}}
      
      {{!-- Move the queue forward by 1 char --}}
      {{#assign "zz_myArray"}}{{substring zz_myArray 1}}{{/assign}}
    {{/unless}}
  {{/each}}
  {{/each}}

  {{!-- Output the result --}}
  {{#assign "arrayValue"}}{{defaultIfEmpty currentVal "0"}}{{/assign}}
  
  {{!-- ignore out of bounds --}}
    {{#ifContainsStr arrayValue "0101010101010101010101010101010101010101010101010101010101010101"}}
    {{else}}
        {{!-- dont't return any value when asking for 'size' --}}
        {{#ifEq return_index "size"}}
        {{else}}
            {{!-- if the current index matches the return_index, output that value --}}
            {{#ifEq t return_index}}
                    {{arrayValue}}
            {{/ifEq}}
        {{/ifEq}}
    
      {{!-- Sets the max size of the array before out of bounds. --}}  
      {{#assign "z_array_size"}}{{t}}{{/assign}}
    {{/ifContainsStr}}
    
    {{!-- iterate the test --}}
    {{#assign "t"}}{{math t "+" 1}}{{/assign}}
{{/ifLt}}
{{/each}}
```

### 3. Template Execution Flow

The following code block demonstrates how to integrate this logic into an email template:

```handlebars
{{!-- Step 1: Create inline array --}}
{{#assign "test_cases"}}[2.23,test,,0,-9.20,-4]{{/assign}}

{{!-- Step 2: Initialize 'z_array_size' by calling the snippet with "size" flag --}}
{{{ snippet "return_array_value" test_cases "size" }}}

{{!-- Step 3: Loop over a large range (e.g., 23 iterations) to cover potential array sizes --}}
{{#each ""}}
    {{!-- Step 4: Check if the current index is within the calculated array size --}}
    {{#ifLt @index z_array_size}}
        
        {{!-- Step 5: Assign the specific array value to a variable '_value' --}}
        {{#assign "_value"}}{{{ snippet "return_array_value" test_cases @index }}}{{/assign}}
        
        {{!-- Step 6: Render the output using the extracted value --}}
        Test {{@index}} == {{_value}} <br>
    {{/ifLt}}
{{/each}}
```

## Expected Output

Given the input array `[2.23,test,,0,-9.20,-4]`, the template renders the following output:

| Index | Value | Notes |
| :--- | :--- | :--- |
| 0 | `2.23` | Numeric value |
| 1 | `test` | Alphanumeric string |
| 2 | `0` | Empty string in source treated as "0" via default logic |
| 3 | `-9.20` | Negative decimal |
| 4 | `-4` | Integer |


## Key Considerations & Limitations

When implementing this workaround, keep the following constraints in mind:

*   **Character Support:** This method supports basic numbers and alphanumeric strings.
*   **Invalid Characters:** Commas `,`, single quotes `'`, and double quotes `"` will cause parsing issues if included within a value itself.
*   **Performance:** The solution uses nested loops (`each` inside `each`) to simulate character-by-character processing. For very large arrays, ensure the loop limit (e.g., 23 iterations) is sufficient for your data volume.
*   **Empty Values:** Empty slots in the array (e.g., between commas like `, ,`) are handled by defaulting to "0" or an empty string depending on the `defaultIfEmpty` logic applied in the snippet.

## Conclusion

This approach provides a flexible, code-driven method for handling dynamic lists within email templates where standard JSON parsing might be insufficient. By leveraging Handlebars' assignment and looping capabilities alongside custom snippets, developers can create highly dynamic content structures directly within the template layer.