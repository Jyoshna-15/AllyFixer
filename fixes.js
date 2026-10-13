const FIXES = {
  "button-name": {
    plain: "This button has no text, so screen readers just say \"button\". Give it a name.",
    wcag: "4.1.2 Name, Role, Value",
    good: `<button aria-label="Open menu">
  <svg aria-hidden="true" width="16" height="16">...</svg>
</button>`
  },
  "link-name": {
    plain: "This link has no text, so screen reader users can't tell where it goes. Add descriptive text.",
    wcag: "2.4.4 Link Purpose, 4.1.2 Name, Role, Value",
    good: `<a href="/pricing">View pricing plans</a>`
  },
  "image-alt": {
    plain: "This image has no alt text. Describe what it shows, or use alt=\"\" if it is purely decorative.",
    wcag: "1.1.1 Non-text Content",
    good: `<img src="logo.png" alt="Acme company logo">`
  },
  "select-name": {
    plain: "This dropdown has no label. Connect a visible <label> to it using for and id.",
    wcag: "4.1.2 Name, Role, Value",
    good: `<label for="topic">Topic</label>
<select id="topic">...</select>`
  },
  "label": {
    plain: "This form field has no label. Add a visible <label> linked with for and id.",
    wcag: "1.3.1 Info and Relationships, 3.3.2 Labels or Instructions",
    good: `<label for="email">Email</label>
<input id="email" type="email">`
  },
  "color-contrast": {
    plain: "The text is too faint against its background. Normal text needs a contrast ratio of at least 4.5:1.",
    wcag: "1.4.3 Contrast (Minimum)",
    good: `.hint { color: #595959; } /* 7:1 on white */`
  },
  "document-title": {
    plain: "The page has no title. Screen reader users hear the title first, and it labels the browser tab.",
    wcag: "2.4.2 Page Titled",
    good: `<head>
  <title>Contact us | Acme</title>
</head>`
  },
  "html-has-lang": {
    plain: "The page language isn't declared, so screen readers may pronounce the text wrongly.",
    wcag: "3.1.1 Language of Page",
    good: `<html lang="en">`
  },
  "landmark-one-main": {
    plain: "There is no <main> landmark. Screen reader users use landmarks to jump straight to the content.",
    wcag: "Best practice (WCAG 1.3.1, 2.4.1)",
    good: `<main>
  ...page content...
</main>`
  },
  "page-has-heading-one": {
    plain: "The page has no <h1>. Add one main heading that describes the page.",
    wcag: "Best practice (WCAG 1.3.1, 2.4.6)",
    good: `<h1>Contact us</h1>`
  },
  "region": {
    plain: "Some content sits outside any landmark. Wrap it in <main>, <header>, <nav> or <footer>.",
    wcag: "Best practice (WCAG 1.3.1)",
    good: `<header>...</header>
<main>...content...</main>
<footer>...</footer>`
  },
  "heading-order": {
    plain: "Headings skip levels (for example h2 then h4). Use them in order so the page outline makes sense.",
    wcag: "Best practice (WCAG 1.3.1)",
    good: `<h1>Dashboard</h1>
<h2>Quarterly report</h2>
<h3>North region</h3>`
  },
  "duplicate-id": {
    plain: "Two elements share the same id. IDs must be unique or labels and ARIA references can break.",
    wcag: "4.1.1 Parsing (obsolete in WCAG 2.2, still good practice)",
    good: `<p id="note-1">First</p>
<p id="note-2">Second</p>`
  }
};