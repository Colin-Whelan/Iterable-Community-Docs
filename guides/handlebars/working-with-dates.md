---
title: Working with Dates
description: A comprehensive guide to formatting, comparing, and calculating dates using Handlebars helpers in Iterable email templates.
category: logic
tags: [handlebars, date-formatting, date-math, personalization]
context: email-template
author: iterable-docs-bot
links:
  - label: Working with Dates
    url: https://support.iterable.com/hc/en-us/articles/205480365-Personalizing-Templates-with-Handlebars#working-with-dates
---

# Date Handling in Handlebars

Iterable’s Handlebars engine provides powerful date manipulation helpers to personalize email templates based on user data or dynamic conditions. Below are practical examples covering formatting, comparisons, and math operations — with global locale and time zone variations.

---

## 📅 Date Comparison Helpers (`#ifGt`, `#ifGte`, `#ifLt`, `#ifLte`)

These helpers compare dates as numeric strings (when formatted appropriately). Always use consistent formats like `yyyyMMddHHmmss`.

### ✅ Example: Check if date is before 2017-06-30

```handlebars
{{#ifLt (dateFormat signupDate format="yyyyMMddHHmmss" tz="UTC") "20170630000000"}}
    <div>Early adopter!</div>
{{else}}
    <div>You signed up after June 30, 2017.</div>
{{/ifLt}}
```

---

## 🧾 Date Formatting (`dateFormat`)

Use `dateFormat` to output dates in any format supported by Java’s `SimpleDateFormat`.

### ✅ Basic Usage

```handlebars
{{dateFormat "2018-06-22 14:00:00 +07:00" format="yyyy-MM-dd HH:mm:ss Z" tz="America/Denver"}}
```

> Output: `2018-06-22 07:00:00 -0700` (converted to Denver time)

---

## 🌍 Locale-Specific Formats

> If `signUpDate = "2018-06-22 07:47:38 +00:00"`

### 🇺🇸 US English — Long Format
```handlebars
{{dateFormat signupDate format="long" tz="America/New_York"}}
```
> Output: `June 22, 2018`

### 🇨🇦 Canadian French — Long Format (French locale)
```handlebars
{{dateFormat signupDate "long" "fr_CA"}}
```
> Output: `22 juin 2018` *(Note: “fr_CA” is the correct locale for Canadian French)*

### 🇬🇧 UK English — Short Format
```handlebars
{{dateFormat signupDate format="short" tz="Europe/London"}}
```
> Output: `22/06/18`

---

## 🕒 Time Zone Conversion Examples

### Convert UTC to New York (EST)
```handlebars
{{dateFormat "2023-04-05 12:00:00" format="yyyy-MM-dd HH:mm:ss" tz="America/New_York"}}
```
> Output: `2023-04-05 07:00:00`

### Convert UTC to Tokyo (JST)
```handlebars
{{dateFormat "2023-04-05 12:00:00" format="yyyy-MM-dd HH:mm:ss" tz="Asia/Tokyo"}}
```
> Output: `2023-04-05 21:00:00`

---

## 🧮 Date Math (`dateMath`)

Use `dateMath` to add/subtract time units from a date.

### ✅ Add 30 days to signup date

```handlebars
{{dateMath signUpDate "+30d" format="long"}}
```
> If `signUpDate = "2022-10-10 17:47:38 +00:00"` → Output: **November 9, 2022**

---

## 🕰️ Calculate Days Between Two Dates

### ✅ Days from signup to now (accurate method using `#assign`)

```handlebars
{{#assign "yearDiff"}}{{math (now format="yyyy" tz="UTC") '-' (dateFormat myDateParam format="yyyy" tz="UTC")}}{{/assign}}
{{#assign "daysInYear"}}{{math yearDiff '*' 365}}{{/assign}}
{{#assign "dayDiff"}}{{math (now format="D" tz="UTC") '-' (dateFormat myDateParam format="D" tz="UTC")}}{{/assign}}
{{math dayDiff '+' daysInYear}} days
```

> This calculates total days including leap years between now and `myDateParam`.

---

## 🎂 Calculate Age from Birthdate

```handlebars
{{dateMath birthDateField (now format="-y'y'+1'y'-M'M'+1'M'-d'd'+1'd'-H'H'-m'm'-s's'" tz="UTC") format="yy"}}
```

> Output: `36` if born in 1990, current year is 2026.

---

## 🕰️ Current Date & Time Helpers

### ✅ Today’s Full Name (e.g., “Monday”)

```handlebars
{{now format="EEEE"}}
```
> Output: `Monday`

### ✅ Current Year

```handlebars
{{now format="yyyy"}}
```
> Output: `2026`

### ✅ Epoch Timestamp (milliseconds since 1970-01-01 UTC)

```handlebars
{{timestamp}}
```
> Output: `1680547200000` *(example value)*

---

## 💡 Tips

- Always use **UTC** as the base time zone unless you’re explicitly converting to local.
- Use `tz=timeZone` to pull user’s profile time zone (if available).
- For complex date math, test with sample data before sending campaigns.
- Avoid using `now` without a format — it defaults to full ISO8601.

---

## 🧪 More Examples

### ✅ Birthday Reminder (French locale + custom format)

```handlebars
{{#ifGte (dateFormat today format="yyyyMMdd") (dateMath birthDate "+1y" format="yyyyMMdd")}}
    <div>🎉 Happy Birthday!</div>
{{else}}
    <div>🎂 Your birthday is coming up soon — {{dateFormat birthDate "EEEE, MMMM dd"}}!</div>
{{/ifGte}}
```

### ✅ Subscription Expiry Alert (US locale)

```handlebars
{{#ifLt (dateMath subscriptionStart "+1y" format="yyyyMMdd") (now format="yyyyMMdd")}}
    <div>⚠️ Your subscription is expiring soon — renew now!</div>
{{/ifLt}}
```

---

## 📌 Summary Table: Common Date Formats

| Format | Output Example (US) | Locale Example |
|--------|---------------------|----------------|
| `yyyy-MM-dd` | 2018-06-22 | Same in all locales |
| `MM/dd/yyyy` | 06/22/2018 | US English only |
| `dd/MM/yyyy` | 22/06/2018 | UK, Canada (UK style) |
| `EEEE, MMMM dd, yyyy` | Monday, June 22, 2018 | Full format |
| `u` | 1 (Monday) | Day of week as number |

---

## 🚀 Bonus: Dynamic Locale Based on User Region

```handlebars
{{#if user.region}}
    {{dateFormat signupDate "long" (user.timezone)}}
{{else}}
    {{dateFormat signupDate "long"}}
{{/if}}
```

> Use `user.timezone` or `user.locale` if available in your data model.

---

💡 *Tip: Always preview with real user data before sending campaigns — date math can be tricky with DST transitions and leap years!*

```handlebars
{{#assign "daysLeft"}}{{math (now format="D" tz="UTC") '-' (dateFormat myDateParam format="D" tz="UTC")}}{{/assign}}
{{#ifGt daysLeft 0}}You have {{daysLeft}} day(s) left.{{/ifGt}}
```