import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/monogram.css";
import "../styles/pages.css";
import "../styles/contact.css";

import { initChrome } from "../site/chrome";
import { initMonograms } from "../site/monogram";
import { initIntro, initMotion } from "../site/reveal";
import { initDust } from "../site/dust";
import { SITE } from "../site/config";

document.documentElement.classList.add("js");

initChrome();
initMonograms();
initIntro();
void initMotion();

const dust = document.getElementById("dust");
if (dust instanceof HTMLCanvasElement) initDust(dust, 0.8);

/* ---------- enquiry form ----------
 * There is no server in this build, so a valid enquiry is handed to the
 * visitor's mail client with every field pre-filled. Point ENDPOINT at a form
 * service and swap the submit handler when one is available.
 */

const form = document.querySelector<HTMLFormElement>("[data-form]");
const status = document.querySelector<HTMLElement>("[data-status]");

const say = (message: string, error = false) => {
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("is-error", error);
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    say("Please complete the required fields.", true);
    return;
  }

  const data = new FormData(form);
  const value = (key: string) => String(data.get(key) ?? "").trim();

  const name = value("name");
  const company = value("company");
  const email = value("email");
  const phone = value("phone");
  const topic = value("topic");
  const message = value("message");

  const subject = `Website enquiry — ${name}${company ? ` (${company})` : ""}`;
  const body = [
    `Name: ${name}`,
    company ? `Company: ${company}` : null,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    topic ? `Interested in: ${topic}` : null,
    "",
    message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  say("Opening your mail app — if nothing happens, write to hello@kcpropel.com.");

  window.setTimeout(() => {
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    form.reset();
  }, 120);
});

form?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  "input, textarea, select",
).forEach((field) => {
  field.addEventListener("input", () => {
    if (status?.classList.contains("is-error")) say("");
  });
});

/* ---------- copy the address ---------- */

document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
  const original = button.textContent ?? "Copy";

  button.addEventListener("click", async () => {
    const value = button.dataset.copy ?? "";
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select + copy";
    }
    window.setTimeout(() => {
      button.textContent = original;
    }, 1800);
  });
});
