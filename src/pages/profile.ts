import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/monogram.css";
import "../styles/profile.css";

import { initChrome } from "../site/chrome";
import { initMonograms } from "../site/monogram";
import { initIntro, initMotion } from "../site/reveal";
import { initDust } from "../site/dust";

document.documentElement.classList.add("js");

initChrome();
initMonograms();
initIntro();
void initMotion();

const dust = document.getElementById("dust");
if (dust instanceof HTMLCanvasElement) initDust(dust, 0.75);

/* one open discipline at a time keeps the profile short */
const services = Array.from(document.querySelectorAll<HTMLDetailsElement>(".qr-service"));

services.forEach((service) => {
  service.addEventListener("toggle", () => {
    if (!service.open) return;
    services.forEach((other) => {
      if (other !== service) other.open = false;
    });
  });
});
