---
title: Image Path Selector
description: Replaces Iterable’s default image picker with a faster folder-based selector designed for image-only email workflows.
category: Templates
tags: [images, templates, productivity, asset-management]
context: template-editor
author: Colin Whelan
links:
  - label: Script Source
    url: https://raw.githubusercontent.com/Colin-Whelan/userscripts/refs/heads/main/scripts/sites/iterable/templates/Image%20Path%20Selector.js
---

## Overview

Image Path Selector improves the image selection experience inside the Iterable template editor. The default asset picker can be slow and inefficient when building **image-only emails**, especially when working with structured image folders.

This script replaces the standard selection workflow with a **folder-style navigator and visual image selector**, allowing you to browse assets and insert image paths more quickly.

## User Features

- **Folder-Based Navigation:** Browse images using their path structure, making it easier to locate assets organized in folders.

- **Persistent Settings:** Preferences and cached data are stored locally using the userscript manager. Image Path Selector will always open the last viewed location.

## Installation

1. **Install a Userscript Manager:** Install Tampermonkey or Greasemonkey in your browser.

2. **Install the Script:** Use the link below to install the latest version.

3. **Open the Template Editor:** Navigate to the Iterable template editor. **In some cases, the page may need to be refreshed to show initially.**

4. **Use the Image Selector:** When selecting or inserting an image, the enhanced image browser will appear.

## How It Works

1. The script connects to Iterable’s internal asset management endpoints.

2. It retrieves images stored in the workspace asset manager and mimics the file+folder structure.

3. A modal interface displays the images and allows quick navigation.

4. Clicking an image copies the selected asset path into the clipboard.


## Important Notes
- **Performance:** Large asset libraries may take a moment to load initially, but navigation becomes much faster once loaded.