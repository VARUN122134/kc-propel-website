import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/monogram.css";
import "../styles/landing.css";

import { initChrome } from "../site/chrome";
import { initMonograms } from "../site/monogram";
import { initIntro } from "../site/reveal";
import { initDust } from "../site/dust";

document.documentElement.classList.add("js");

initChrome();
initMonograms();
initIntro();

const dust = document.getElementById("dust");
if (dust instanceof HTMLCanvasElement) initDust(dust, 1.15);
