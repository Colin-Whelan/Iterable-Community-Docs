---
title: Persistent User Lookup Bar
description: Adds a global search interface to the Iterable navigation bar for quickly finding users by Email or User ID without leaving your current page.
category: UI Enhancement
tags: [navigation, user-profile, workflow, search]
context: app-navigation
author: Colin Whelan
links:
  - label: Script Source
    url: https://raw.githubusercontent.com/Colin-Whelan/userscripts/refs/heads/main/scripts/sites/iterable/User%20Lookup%20Bar.js
---

### Overview

The **User Lookup Bar** is a productivity sctipt that injects a search interface directly into the top navigation of the Iterable application. It eliminates the need to navigate to the "User Lookup" menu item every time you need to check a different user profile.

### User Features

* **Global Navigation Search:** Perform lookups from any screen (Campaigns, Journeys, Templates, etc.) via the top navbar.
* **Email & User ID Toggle:** Easily switch between searching by **Email** or **UserId** using a dedicated toggle switch.
* **Automatic Redirection:** If a user is found, the script automatically navigates your browser to that specific user's profile page.
* **In-App Notifications:** Receive instant feedback directly under the search bar if a user is not found or if there is a connection error.
* **Keyboard Shortcuts:** Supports the **Enter** key to trigger a search immediately after typing.
* **Persistent Interface:** The bar is designed to stay pinned to your navigation even as you click through different areas of the Iterable platform.

---

### How to Use

| Task | Action |
| :--- | :--- |
| **Search by Email** | Ensure the toggle is on the left (**Email**), type the address, and hit Enter. |
| **Search by User ID** | Click the toggle to the right (**UserId**), type the ID, and hit Enter. |
| **Clear Results** | Errors and success messages clear automatically after a few seconds. |