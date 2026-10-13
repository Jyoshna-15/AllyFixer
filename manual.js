function runManualChecks(doc) {
  const findings = [];
  const add = (info, els) => {
    if (els.length) findings.push({ ...info, nodes: els.map((e) => e.outerHTML) });
  };

  // 1. Placeholder-only fields (no real label)
  const fields = [...doc.querySelectorAll("input, textarea")].filter(
    (el) => !["hidden", "submit", "button", "reset", "image"].includes(el.type)
  );
  add({
    id: "placeholder-only",
    help: "Form fields use a placeholder instead of a label",
    impact: "serious",
    wcag: "1.3.1, 3.3.2",
    plain: "A placeholder disappears when you type, is often low contrast, and is not a reliable label. Add a visible <label> linked to the field.",
    test: "Click into the field and type. Does the hint vanish? Turn on a screen reader and Tab to the field to hear what it announces.",
    good: `<label for="email">Email</label>
<input id="email" type="email" placeholder="name@example.com">`
  }, fields.filter((el) =>
    el.getAttribute("placeholder") &&
    !(el.labels && el.labels.length) &&
    !el.getAttribute("aria-label") &&
    !el.getAttribute("aria-labelledby")
  ));

  // 2. Clickable non-interactive elements (fake buttons)
  const interactive = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "SUMMARY"];
  add({
    id: "fake-button",
    help: "Clickable element is not keyboard accessible",
    impact: "critical",
    wcag: "2.1.1, 4.1.2",
    plain: "A <div> or <span> with onclick can't be reached with Tab, can't be activated with Enter or Space, and screen readers don't announce it as a button. Use a real <button>.",
    test: "Put your mouse aside and press Tab. Can you reach it? Can you activate it with Enter or Space?",
    good: `<button type="button" onclick="send()">Send</button>`
  }, [...doc.querySelectorAll("[onclick]")].filter(
    (el) => !interactive.includes(el.tagName) &&
      (!el.getAttribute("role") || !el.hasAttribute("tabindex"))
  ));

  // 3. Vague link text
  const vague = ["click here", "here", "read more", "more", "learn more", "link", "this link"];
  add({
    id: "vague-link",
    help: "Link text does not describe its destination",
    impact: "moderate",
    wcag: "2.4.4",
    plain: "Screen reader users often browse a list of all links on the page. \"Click here\" repeated five times tells them nothing. Describe the destination.",
    test: "Open your screen reader's links list (NVDA: Insert+F7). Do the links make sense without the surrounding text?",
    good: `<a href="/pricing">View pricing plans</a>`
  }, [...doc.querySelectorAll("a")].filter(
    (a) => vague.includes(a.textContent.trim().toLowerCase())
  ));

  // 4. Heading order
  const bad = [];
  let prev = 0;
  doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
    const level = Number(h.tagName[1]);
    if (level > prev + 1) bad.push(h);
    prev = level;
  });
  add({
    id: "heading-skip",
    help: "Heading levels are skipped or do not start at h1",
    impact: "moderate",
    wcag: "1.3.1, 2.4.6",
    plain: "Headings form the page outline. Jumping from h1 to h4 (or starting at h4) breaks it for screen reader users who navigate by heading.",
    test: "Use a browser extension like HeadingsMap, or press H in a screen reader to jump heading to heading.",
    good: `<h1>Dashboard</h1>
<h2>Quarterly report</h2>
<h3>North region</h3>`
  }, bad);

  // 5. Focus outline removed
  const re = /outline\s*:\s*(none|0)/i;
  const inline = [...doc.querySelectorAll("[style]")].filter((e) => re.test(e.getAttribute("style")));
  const sheets = [...doc.querySelectorAll("style")].filter((s) => re.test(s.textContent));
  add({
    id: "no-focus-outline",
    help: "Focus outline is removed",
    impact: "serious",
    wcag: "2.4.7",
    plain: "Keyboard users need to see where focus is. Removing the outline without a replacement makes the page unusable by keyboard.",
    test: "Press Tab through the page. Can you always see which element is focused?",
    good: `:focus-visible { outline: 3px solid #ff9800; outline-offset: 2px; }`
  }, [...inline, ...sheets]);

  // 6. Tables without header cells
  add({
    id: "table-no-headers",
    help: "Data table has no header cells",
    impact: "serious",
    wcag: "1.3.1",
    plain: "Without <th>, a screen reader can't tell which column or row a cell belongs to. Mark headers with <th scope>.",
    test: "Navigate the table cell by cell with a screen reader (NVDA: Ctrl+Alt+arrows). Does it announce the column name?",
    good: `<table>
  <tr><th scope="col">Region</th><th scope="col">Revenue</th></tr>
  <tr><td>North</td><td>$40k</td></tr>
</table>`
  }, [...doc.querySelectorAll("table")].filter((t) => !t.querySelector("th")));

  // 7. Color-only meaning (heuristic: needs human review)
  const colorRe = /(^|;|\s)color\s*:\s*(red|green|#f00|#0f0)/i;
  add({
    id: "color-only",
    help: "Possible color-only meaning (review manually)",
    impact: "moderate",
    wcag: "1.4.1",
    plain: "If red vs green is the only way to tell good from bad, color-blind users miss it. Add text, an icon or a symbol as well.",
    test: "Use a grayscale or color-blindness simulator (Chrome DevTools > Rendering > Emulate vision deficiencies). Is the meaning still clear?",
    good: `<td style="color:#b00020">▼ -4% (down)</td>
<td style="color:#1b7f3b">▲ +9% (up)</td>`
  }, [...doc.querySelectorAll("[style]")].filter(
    (e) => colorRe.test(e.getAttribute("style")) && e.textContent.trim().length < 20
  ));

  return findings;
}