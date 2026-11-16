export interface Service {
  /** short label used in the hub */
  name: string;
  /** the discipline behind the label */
  field: string;
  /** one line, shown under the node */
  short: string;
  /** two or three sentences for the popup */
  body: string;
  /** what the work actually includes */
  points: string[];
}

/**
 * The six disciplines. Order matters: it is the direction the hub travels.
 */
export const SERVICES: Service[] = [
  {
    name: "Discover",
    field: "Lead Generation & Prospecting",
    short: "Find the companies and people worth talking to.",
    body:
      "Everything starts with knowing where the opportunity actually is. We map your market, define the buyer worth pursuing and build a verified prospect universe before a single message goes out.",
    points: [
      "Market and segment mapping",
      "Ideal customer profiles",
      "Verified company and contact data",
      "Prospect scoring and prioritisation",
    ],
  },
  {
    name: "Connect",
    field: "Business Development",
    short: "Open conversations that are worth having.",
    body:
      "The right message to the right person, through the channel they actually answer. We build the introduction, the follow-up and the sequence that keeps a conversation alive.",
    points: [
      "Multi-channel outreach and sequencing",
      "Founder and executive introductions",
      "Meeting setting and qualification",
      "Follow-up that doesn't go quiet",
    ],
  },
  {
    name: "Strategise",
    field: "Sales Strategy & Planning",
    short: "Decide where to play, and how to win.",
    body:
      "A clear commercial plan beats a busy pipeline. We define the segments, the offer, the message and the order you go after them — with targets you can hold the team to.",
    points: [
      "Go-to-market and segment strategy",
      "Offer, pricing and message positioning",
      "Account and territory planning",
      "Quarterly targets and sales plans",
    ],
  },
  {
    name: "Manage",
    field: "CRM & Pipeline Management",
    short: "Keep the pipeline honest and moving.",
    body:
      "A pipeline is only useful if you trust it. We set up the CRM, define the stages and review the deals so a forecast stops being a guess.",
    points: [
      "CRM setup, hygiene and adoption",
      "Pipeline stages and forecasting",
      "Weekly deal reviews",
      "Reporting your board can read",
    ],
  },
  {
    name: "Execute",
    field: "Sales as a Service",
    short: "A sales function, without the hiring cycle.",
    body:
      "When you need momentum now, we become the commercial team. Outreach, meetings, pipeline and follow-through, run by people who do this every day.",
    points: [
      "End-to-end outbound execution",
      "Qualified meetings in your calendar",
      "Sequences, scripts and collateral",
      "A dedicated account lead",
    ],
  },
  {
    name: "Present",
    field: "Proposals & Campaign Support",
    short: "Make the last mile as strong as the first.",
    body:
      "Interest is easy to lose at the proposal stage. We help you present the work, price it clearly and keep attention long after the meeting ends.",
    points: [
      "Proposals, pitch decks and pricing pages",
      "Campaign assets and landing pages",
      "Case studies and proof points",
      "Support through to signature",
    ],
  },
];

export const APPROACH = [
  {
    name: "Discover",
    claim: "We start with your business, not a template.",
    body:
      "Your product, your market, your ambition — and the honest version of where you are today.",
  },
  {
    name: "Analyse",
    claim: "We test the ground before we build on it.",
    body:
      "Markets, competitors and buyers are researched to find where the real opportunity sits, and where it doesn't.",
  },
  {
    name: "Strategise",
    claim: "We decide where to play and how to win.",
    body:
      "Positioning, targeting, sequence and targets, agreed together so everyone knows what good looks like.",
  },
  {
    name: "Execute",
    claim: "We do the work, not just the deck.",
    body:
      "Outreach, conversations, meetings, proposals and follow-through — run weekly, reviewed weekly.",
  },
  {
    name: "Improve",
    claim: "We measure, refine, and compound it.",
    body:
      "Every campaign leaves you with sharper messaging, a cleaner pipeline and a clearer view of what works.",
  },
];
