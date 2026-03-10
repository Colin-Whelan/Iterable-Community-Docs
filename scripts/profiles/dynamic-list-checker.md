---
title: Dynamic List Checker
description: Checks which dynamic lists a user belongs to and displays the results directly inside the Iterable UI.
category: Profiles
tags: [profiles, segmentation, dynamic-lists, productivity, debugging]
context: user-profile
author: Colin Whelan
links:
  - label: Script Source
    url: https://raw.githubusercontent.com/Colin-Whelan/userscripts/refs/heads/main/scripts/sites/iterable/profiles/Dynamic%20List%20Checker.js
---

## Overview

Dynamic List Checker helps you quickly determine which **dynamic lists** an Iterable user belongs to. Instead of manually testing segment logic or querying lists individually, the script scans all dynamic lists and verifies membership for the currently viewed profile.

The results are displayed in a side panel within the Iterable interface, allowing you to instantly see list membership while reviewing a user profile.

## User Features

- **Automatic Dynamic List Detection:** Fetches all dynamic lists available to the current project and checks whether the viewed user belongs to them.

- **Inline Results Panel:** Displays results in a dedicated side panel beside the Lists table inside Iterable.

- **Progress Tracking:** Includes a progress bar and status updates while list checks are running.

- **Batch Processing:** Lists are checked in configurable batches to reduce API strain and improve reliability.

- **Caching System:** Results are cached locally for up to **14 days** to avoid repeating expensive checks.

- **Manual Refresh:** A **Check Dynamic Lists** button allows you to rerun the membership scan at any time.

- **Direct List Navigation:** Each result links directly to the corresponding segmentation page for that list.

- **Visual Timestamp Indicators:** Last check timestamps are color-coded to indicate how recent the data is.

## Installation

1. **Install a Userscript Manager:** Ensure Tampermonkey or Greasemonkey is installed in your browser.

2. **Install the Script:** Use the link below to install the latest version.

3. **Open a Profile Page:** Navigate to any user profile in `app.iterable.com`.

4. **Open Lists View:** When viewing the lists section for a profile, the Dynamic Lists panel will appear automatically.

## How It Works

1. The script extracts the **User ID** and **email address** from the profile page.

2. It retrieves all lists associated with the user account.

3. Only **dynamic lists** are filtered for membership checks.

4. Each dynamic list is tested using Iterable’s internal segmentation query API.

5. Lists where the user is present are displayed in the results panel.

## Configuration Options

Configuration options are available from the **Tampermonkey menu**.

- **Configure Batch Size:** Adjust how many lists are checked per batch (1–20). Larger batches run faster but may increase API load.

- **Toggle Auto Start:** Automatically run the list check when the lists page loads.

- **Clear Cache:** Remove cached results to force a fresh scan.

## Important Notes

- **API Usage:** The script uses Iterable’s internal segmentation query endpoint to verify membership.

- **Performance:** Accounts with many dynamic lists may take longer to process, especially with smaller batch sizes.

- **Caching:** Results are stored locally in your browser to reduce repeated API requests.

- **UI Integration:** The panel is dynamically injected into the Lists page layout and disappears when navigating away.