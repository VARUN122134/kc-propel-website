/**
 * Contact form: client-side validation + honest status copy.
 * The POST is still a stub — point `ENDPOINT` at Formspree / Web3Forms / a CRM
 * webhook when the customer has one, and the same handler starts delivering.
 */
const ENDPOINT: string | null = null;

export function initForm(): void {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  const setStatus = (message: string) => {
    status.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.querySelector<HTMLInputElement>("#name");
    const email = form.querySelector<HTMLInputElement>("#email");

    if (name && !name.value.trim()) {
      setStatus("Please add your name so we know who to reply to.");
      name.focus();
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setStatus("Please check that business email address.");
      email.focus();
      return;
    }

    const first = name?.value.trim().split(" ")[0] ?? "";
    const greeting = first ? `Thanks, ${first}.` : "Thanks.";

    if (!ENDPOINT) {
      setStatus(`${greeting} Your message is ready — connect a form endpoint to deliver it.`);
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus(`${greeting} We'll be in touch within one working day.`);
    } catch {
      setStatus("That didn't send. Email hello@kcpropel.com and we'll pick it up from there.");
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}
