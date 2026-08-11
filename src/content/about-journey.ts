import type { AboutJourney } from "@/types/content";

export const aboutJourney: AboutJourney = {
  eyebrow: "The path that brought me here",
  rangeLabel: "2019 — Present",
  title: "Four chapters that shaped how I build.",
  introduction:
    "Each stage added something different—storytelling taught me attention, client work taught me responsibility, education built the foundation, and product work brought everything together.",
  chapters: [
    {
      era: "2019",
      title: "I learned to tell a story",
      context: "Assistant Video Editor / No Idea YouTube Channel",
      dateRange: "Mar 2019 - Jul 2020",
      location: "Kathmandu, Nepal",
      story: "Before I was building interfaces, I was learning how pacing, sound, and visual details hold someone's attention.",
      lesson: "Attention is designed. Pacing, hierarchy, and small details decide what people notice and remember.",
      outcome: "Edited and produced videos for stronger viewer engagement",
    },
    {
      era: "2021",
      title: "Design became real client work",
      context: "Freelance Graphic Designer / Freelance",
      dateRange: "Feb 2021 - Present",
      location: "Kathmandu, Nepal",
      story: "Working with clients taught me that good design has to communicate clearly, meet constraints, and serve a purpose.",
      lesson: "Good design is not decoration. It has to adapt to feedback and solve a real need.",
      outcome: "Delivered 30+ digital assets",
    },
    {
      era: "2022-2026",
      title: "I built the technical foundation",
      context: "BSc.CSIT / Tribhuvan University",
      dateRange: "May 2022 - Apr 2026",
      location: "Bhaktapur, Nepal",
      story: "Computer science gave structure to the visual instincts I already had and helped me understand what happens beyond the interface.",
      lesson: "Interfaces become more useful when I understand the systems, data, and decisions behind them.",
      outcome: "Completed BSc.CSIT with 80%+ overall",
    },
    {
      era: "2025-Present",
      title: "Everything started coming together",
      context: "Full Stack Developer / Niyalo Creatives",
      dateRange: "Dec 2025 - Present",
      location: "Kathmandu, Nepal",
      story: "Today, I combine design judgment, frontend craft, and backend thinking to ship complete digital products.",
      lesson: "The strongest work happens when design judgment and engineering discipline support the same product goal.",
      outcome: "Built and deployed full-stack projects including Merry Crochets and KTM Cribs",
    },
  ],
};
