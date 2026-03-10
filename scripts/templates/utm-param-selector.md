---
title: UTM Parameter Selector
description: Adds a safe UTM parameter selector to the Iterable Drag-and-Drop and HTML editors for faster, error-free link tagging.
category: Templates
tags: [utm, links, analytics, productivity]
context: template-editor
author: Colin Whelan
links:
  - label: Script Source
    url: https://raw.githubusercontent.com/Colin-Whelan/userscripts/refs/heads/main/scripts/sites/iterable/templates/Link%20Param%20Helper.js
---

## Overview

UTM Parameter Selector adds a simple interface inside the Iterable template editor that makes it easy to add or update UTM parameters on links.

Instead of manually editing URLs and worrying about syntax errors, the tool provides a quick selector for common tracking parameters such as `utm_term` and `utm_id`. It ensures parameters are added safely and consistently across your email templates.

The selector works in both the **Drag-and-Drop editor (BEE)** and the **HTML editor**, appearing directly next to the link URL field.

## User Features

- **One-Click UTM Selection:** Quickly apply predefined UTM values directly from the link editor.

- **Works in Both Editors:** Appears in the Drag-and-Drop editor and the HTML link dialog.

- **Organized Term Categories:** Terms can be grouped into categories such as campaigns, channels, products, or promotions.

- **Recent Values:** Recently used terms are stored for quick reuse.

- **Custom Values:** Enter a custom parameter value if it is not listed.

- **Multi-Parameter Support:** Switch between different parameter types (for example `utm_term`, `utm_id`, etc.).

- **Configurable Terms:** All categories and terms can be customized through a configuration panel.

## Built-in Safeguards

The script prevents common URL mistakes that frequently occur when manually editing tracking links.

- **Prevents Duplicate Parameters:** Existing parameters are replaced instead of duplicated.

- **Correct Query Handling:** Automatically determines whether to use `?` or `&`.

- **Fixes Broken URL Patterns:** Prevents malformed URLs like  
  `?term1=abc?term2=123`, `&term1=abc&term2=123`, or duplicated query separators.

- **Safe Parameter Updates:** If the parameter already exists in the URL, the value is updated rather than appended again.

## How It Works

1. When editing a link inside the template editor, a **“Add Param”** button appears next to the URL field.

2. Clicking the button opens a dropdown containing available parameter values.

3. Selecting a value automatically inserts or updates the parameter in the URL.

4. The script ensures the link remains properly formatted and free of duplicate parameters.

5. The updated URL is immediately applied in the editor.

## Typical Use Cases

- Adding **consistent UTM tagging** across marketing campaigns with sharable configs for teammates to stay in sync.
- Preventing broken tracking links during email production  
- Speeding up link setup when building large templates  
- Standardizing campaign parameters across a team