---
title: Profile Editor
description: Enables direct editing of Iterable user profile fields directly from the UI without needing external API tools.
category: Profiles
tags: [productivity, user-profiles, editing, custom-ui]
context: user-profile
author: Colin Whelan
links:
  - label: Script Source
    url: https://raw.githubusercontent.com/Colin-Whelan/userscripts/refs/heads/main/scripts/sites/iterable/Profile%20Editor.js
---

## Overview

The Profile Editor is a productivity tool that enhances the Iterable user profile interface by enabling direct field manipulation, eliminating the need to use separate API tools to update user data.

This script injects editing controls directly into the JSON view of a user's profile page on `app.iterable.com`. It allows you to modify existing fields, add new fields, or delete data, all while respecting your workspace's API configuration.

## User Features

- **Inline Editing:** Adds an edit icon (✏️) next to every JSON field on the user profile page.

- **Add New Fields:** A dedicated **➕ Add New Field** button appears in the header, allowing you to quickly create custom profile attributes.

- **Multi-Space Support:** Configure different API keys for multiple Iterable workspaces through an integrated management modal.

- **Safe Data Handling:**
  - **Type Preservation:** Automatically attempts to maintain the original data type (e.g., boolean, number, string) during updates.
  - **Rollback Functionality:** Provides a way to revert changes to a field's original value if an error occurs.
  - **Merge Options:** Offers a toggle to safely merge nested objects rather than overwriting them entirely.

- **Real-time Validation:** Built-in form validation ensures that JSON or value formats are correct before the API request is sent.

- **System Awareness:** Automatically detects whether a field already exists in the system or if it is a new custom field.

---

## How to Use

### Editing an Existing Field

1. Navigate to a user's profile page.
2. Locate the field you wish to update and click the **✏️** icon next to the field name.
3. In the modal, modify the value.
4. Toggle **Merge nested objects** if you are updating part of a complex object.
5. Click **Save Changes**.

### Adding a New Field

1. Click the **➕ Add New Field** button located at the top of the profile data section.
2. Enter the **Field Name**. (The script will automatically detect if this is a known system field.)
3. Select the **Data Type** and enter the desired value.
4. Click **Add Field**.

## Important Notes

- **Security:** API keys are stored locally in your browser via the userscript manager.

- **Visibility:** Changes made via this script will reflect in the Iterable UI after refreshing the page.

- **Permissions:** Ensure your API key has the required `POST /api/users/update` permissions in Iterable.