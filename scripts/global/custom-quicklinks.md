---
title: Custom Quicklinks
description: Adds a customizable shortcut menu to the Iterable navigation bar for instant access to your most-used pages.
category: UI Enhancement
tags: [productivity, shortcuts, navigation, custom-ui]
context: app-navigation
author: Colin Whelan
links:
  - label: Script Source
    url: https://raw.githubusercontent.com/Colin-Whelan/userscripts/refs/heads/main/scripts/sites/iterable/Custom%20Quicklinks.js
---

### Overview

**Custom Quicklinks** allows you to tailor the Iterable navigation bar to your specific workflow. By adding direct links to specific pages—like certain Lists, Segment definitions, or the User Lookup tool—you can bypass multiple clicks and deep-link directly into your work.

### User Features

* **Custom Navigation Items:** Add your own text and links directly to the top-level Iterable menu.
* **In-App Configuration UI:** Manage your links through a dedicated popup window within the Iterable interface—no coding required to add or remove shortcuts.
* **Relative Path Support:** Use simple paths like `/lists` or `/users/lookup` to stay within your current project.
* **Native Look and Feel:** Custom links are styled to match Iterable’s official navigation buttons, including hover states and typography.
* **Persistent Storage:** Your custom links are saved to your browser and will remain available every time you log in.
* **Visual Separation:** Includes a subtle vertical divider to distinguish your custom shortcuts from standard Iterable menu items.

---

### How to Configure Your Links

1.  **Open Settings:** Click on the **Tampermonkey icon** in your browser extension bar.
2.  **Select Command:** Find "Custom Quicklinks" and click **Configure Quicklinks**.
3.  **Manage Links:**
    * **Add:** Click the green **+ Add New Quicklink** button.
    * **Edit:** Change the "Display Name" (what you see in the bar) or the "URL".
    * **Remove:** Click the red **✕** next to any link.
4.  **Save:** Click **Save Changes** to immediately update your navigation bar.



### Common Shortcut Ideas

| Display Name | URL (Relative Path) |
| :--- | :--- |
| **All Lists** | `/lists` |
| **Lookup** | `/users/lookup` |
| **Campaigns** | `/campaigns` |
| **Workflows** | `/workflows` |