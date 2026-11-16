/** Everything a page needs to know about the brand in one place. */
export const SITE = {
  name: "K&C",
  tagline: "Let's grow together.",
  base: "/kc-propel-website/",
  email: "hello@kcpropel.com",
  /** No number supplied yet — wa.me with no number opens WhatsApp's own picker. */
  whatsapp: `https://wa.me/?text=${encodeURIComponent("Hi K&C, I'd like to talk about growing our business.")}`,
  year: new Date().getFullYear(),
} as const;
