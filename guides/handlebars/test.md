---
title: Iterable Segmentation Logic: Handling Exclusions and Events
description: A guide on troubleshooting complex exclusion logic in Iterable, specifically regarding 'Any' vs 'All' groupings with 'None' criteria and handling custom event objects.
category: segmentation
tags: [iterable, segmentation, logic, events, dynamic-lists]
context: chat-discussion
author: Iterable Community
links:
  - label: Iterable Segmentation Docs
    url: https://support.iterable.com/hc/en-us/categories/360001428597-Email-Segments
  - label: Iterable Dynamic Lists Docs
    url: https://support.iterable.com/hc/en-us/categories/360001428597-Dynamic-Lists
---

## The Challenge: Complex Exclusion Logic
When building segments in Iterable, users often struggle with how to exclude specific groups of people based on multiple criteria (e.g., excluding users who have attended specific webinars). 

A common point of confusion arises when trying to use **NOT** logic (`None`) combined with **ANY** or **ALL** groupings.

### The Logic Breakdown
Understanding the interaction between the top-level grouping (`All`, `Any`, `None`) and the individual criteria is crucial for accurate segmentation.

| Top-Level Setting | Criteria Type | Resulting Behavior |
| :--- | :--- | :--- |
| **All** + **None** | Multiple fields/events | Only includes users who meet **ALL** of the NOT criteria (e.g., Email is set AND Event is not set). |
| **Any** + **None** | Multiple fields/events | Includes users where **ANY** of the NOT criteria are met. |

> **Key Insight:** If you want to exclude people based on multiple specific events, ensure your logic reflects that *any* of those events should trigger an exclusion (using `Any` with `None`), rather than requiring them to have missed *all* events simultaneously.

## Troubleshooting Event Objects
When working with **Events** for segmentation, there are specific limitations compared to Profile Fields:

1.  **Event Type Limitations:** Custom event fields may be set as objects rather than simple strings. This can affect how the `None` filter applies.
2.  **Grouping Behavior:** If you group events under "All" with "None", it might require a user to have *no* events in that specific grouping, which differs from excluding users who attended *any* of those events.

## Recommended Workaround: Dynamic Lists
If direct event exclusion logic is confusing or limited due to object types, the most reliable method is to use **Dynamic Lists** as an intermediary step.

### Step-by-Step Implementation
1.  **Create Individual Lists:** Create separate dynamic lists for each specific action you want to exclude (e.g., "Attended Webinar A", "Attended Webinar B").
2.  **Define List Logic:** Set the list membership criteria clearly (e.g., `Custom Event = Webinar A`).
3.  **Exclude in Main Segment:** In your primary segment, use a `NONE` grouping to exclude these lists.

**Example Configuration:**
*   **Grouping:** `None` of the following:
    *   List Membership: [List 1]
    *   List Membership: [List 2]

This method bypasses complex event object logic and ensures that anyone who has triggered any of those specific events is successfully excluded from your segment.
