const AXE_URL = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";

const samples = {
  form: `<h1>Sign up</h1>
<form>
  <input type="text" placeholder="Email">
  <input type="password" placeholder="Password">
  <div onclick="alert('hi')" style="background:#ccc;color:#fff;padding:8px;display:inline-block">Submit</div>
</form>`,
  gallery: `<h1>Gallery</h1>
<img src="cat.jpg">
<a href="#"></a>
<p style="color:#aaa">Light grey text on white</p>`
};

const input = document.getElementById("html-input");
const select = document.getElementById("sample-select");
const auditBtn = document.getElementById("audit-btn");
const summary = document.getElementById("summary");
const resultsList = document.getElementById("results");
const frame = document.getElementById("preview");

select.addEventListener("change", () => {
  if (select.value) input.value = samples[select.value];
});

auditBtn.addEventListener("click", async () => {
  summary.textContent = "Running audit…";
  resultsList.innerHTML = "";
  try {
    const results = await runAudit(input.value);
    renderResults(results);
  } catch (err) {
    summary.textContent = "Audit failed: " + err.message;
  }
});

function runAudit(html) {
  return new Promise((resolve, reject) => {
    frame.onload = async () => {
      try {
        resolve(await frame.contentWindow.axe.run());
      } catch (e) {
        reject(e);
      }
    };
    frame.srcdoc = html + `<script src="${AXE_URL}"><\/script>`;
  });
}

// "wcag143" -> "1.4.3", "wcag1410" -> "1.4.10"
function wcagLabel(tag) {
  const d = tag.replace("wcag", "");
  return `${d[0]}.${d[1]}.${d.slice(2)}`;
}

function renderResults(results) {
  const v = results.violations;
  summary.textContent = v.length
    ? `${v.length} issue type(s) found.`
    : "No automated issues found. Manual testing is still needed.";

  v.forEach((issue) => {
    const info = FIXES[issue.id];
    const li = document.createElement("li");
    li.className = "card " + issue.impact;

    const wcag = issue.tags
      .filter((t) => /^wcag\d{3,4}$/.test(t))
      .map(wcagLabel)
      .join(", ") || "Best practice";

    const title = document.createElement("h3");
    title.textContent = issue.help;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `Impact: ${issue.impact} | WCAG: ${info ? info.wcag : wcag} | Rule: ${issue.id} | Found on ${issue.nodes.length} element(s)`;

    const fix = document.createElement("p");
    fix.className = "fix";
    fix.textContent = "How to fix: " + (info ? info.plain : issue.description);

    // Before / after comparison
    const compare = document.createElement("div");
    compare.className = "compare";

    const before = document.createElement("div");
    before.className = "before";
    const beforeLabel = document.createElement("h4");
    beforeLabel.textContent = "Before (your code)";
    const beforeCode = document.createElement("pre");
    beforeCode.textContent = issue.nodes.slice(0, 3).map((n) => n.html).join("\n");
        if (issue.nodes[0].html.startsWith("<html")) {
      beforeCode.textContent = "Page-level issue: it applies to the whole document, not one element.";
    }
    before.append(beforeLabel, beforeCode);

    compare.append(before);

    if (info) {
      const after = document.createElement("div");
      after.className = "after";
      const afterLabel = document.createElement("h4");
      afterLabel.textContent = "After (suggested fix)";
      const afterCode = document.createElement("pre");
      afterCode.textContent = info.good;
      after.append(afterLabel, afterCode);
      compare.append(after);
    }

    // Keep axe's raw wording, but hidden by default
    const details = document.createElement("details");
    const sum = document.createElement("summary");
    sum.textContent = "Technical details from axe";
    const raw = document.createElement("p");
    raw.textContent = issue.nodes[0].failureSummary;
    details.append(sum, raw);

    const link = document.createElement("a");
    link.href = issue.helpUrl;
    link.textContent = "Learn more about " + issue.id;
    link.target = "_blank";
    link.rel = "noopener";

    li.append(title, meta, fix, compare, details, link);
    resultsList.appendChild(li);
  });
}