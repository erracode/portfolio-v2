export type BuffRarity = "common" | "rare" | "epic";

export interface TechBuff {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  effect: string;
  icon?: string;
  abbr: string;
  rarity: BuffRarity;
  color: string;
}

export const buffColors: Record<BuffRarity, string> = {
  common: "#9d9d9d",
  rare: "#c79c6e",
  epic: "#a335ee",
};

// Aligned with the logos the chest spawns in the 3D world.
export const techBuffs: TechBuff[] = [
  {
    id: "react",
    title: "React — Passive Buff",
    subtitle: "Frontend Specialization",
    description:
      "Component architecture, hooks, suspense and performance tuning for fast, interactive interfaces.",
    effect: "+50% render speed",
    icon: "/react-logo.png",
    abbr: "R",
    rarity: "epic",
    color: buffColors.epic,
  },
  {
    id: "javascript",
    title: "JavaScript — Agile Scripting",
    subtitle: "Language",
    description:
      "Modern ES6+ patterns, async flows and functional programming across the stack.",
    effect: "+30% agility",
    icon: "/javascript-logo.png",
    abbr: "JS",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "nodejs",
    title: "Node.js — Backend Vitality",
    subtitle: "Backend Engineering",
    description:
      "APIs, microservices and event-driven processing that scale under load.",
    effect: "+25% throughput",
    icon: "/nodejs-logo.png",
    abbr: "N",
    rarity: "epic",
    color: buffColors.epic,
  },
  {
    id: "nextjs",
    title: "Next.js — Rapid Deployment",
    subtitle: "Fullstack Framework",
    description:
      "App Router, SSR/SSG and server actions for fast, SEO-friendly web applications.",
    effect: "+30% load speed",
    icon: "/nextjs-logo.png",
    abbr: "NX",
    rarity: "epic",
    color: buffColors.epic,
  },
  {
    id: "css",
    title: "CSS — Style Alchemy",
    subtitle: "Styling",
    description:
      "Layouts, animations and design systems with pixel-perfect precision.",
    effect: "+20% polish",
    icon: "/css-logo.png",
    abbr: "CSS",
    rarity: "common",
    color: buffColors.common,
  },
  {
    id: "html",
    title: "HTML — Foundation Aura",
    subtitle: "Web Foundations",
    description:
      "Semantic, accessible markup that every application is built on.",
    effect: "+15% structure",
    icon: "/html-logo.png",
    abbr: "HTML",
    rarity: "common",
    color: buffColors.common,
  },
  {
    id: "mongodb",
    title: "MongoDB — Document Flow",
    subtitle: "Database",
    description:
      "Flexible document modeling and aggregation pipelines for dynamic data.",
    effect: "+25% data agility",
    icon: "/mongodb-logo.png",
    abbr: "MDB",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "mysql",
    title: "MySQL — Relational Roots",
    subtitle: "Database",
    description:
      "Relational modeling, indexing and query optimization for classic stacks.",
    effect: "+20% query speed",
    icon: "/mysql-logo.png",
    abbr: "SQL",
    rarity: "common",
    color: buffColors.common,
  },
  {
    id: "wordpress",
    title: "WordPress — CMS Mastery",
    subtitle: "CMS",
    description:
      "Custom themes, plugins and headless content architectures.",
    effect: "+25% content speed",
    icon: "/wordpress-logo.png",
    abbr: "WP",
    rarity: "common",
    color: buffColors.common,
  },
  {
    id: "woocommerce",
    title: "WooCommerce — Commerce Spells",
    subtitle: "E-commerce",
    description:
      "Storefronts, payments and product ecosystems built on WordPress.",
    effect: "+20% conversion",
    icon: "/woocommerce-logo.png",
    abbr: "WOO",
    rarity: "common",
    color: buffColors.common,
  },
  {
    id: "zustand",
    title: "Zustand — Mind Clarity",
    subtitle: "State Management",
    description:
      "Lightweight global state without boilerplate or provider trees.",
    effect: "+20% state clarity",
    icon: "/zustand-logo.png",
    abbr: "ZS",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "redux",
    title: "Redux — Temporal Recall",
    subtitle: "State Management",
    description:
      "Predictable state containers with devtools time travel debugging.",
    effect: "+25% predictability",
    icon: "/redux-logo.png",
    abbr: "RX",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "postgres",
    title: "PostgreSQL — Data Guardian",
    subtitle: "Database",
    description:
      "Advanced relational queries, JSONB and robust constraints at scale.",
    effect: "+30% integrity",
    icon: "/postgres-logo.png",
    abbr: "PG",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "tailwind",
    title: "Tailwind CSS — Artisan Styling",
    subtitle: "Styling",
    description:
      "Utility-first styling with consistent, pixel-perfect design systems.",
    effect: "+35% styling speed",
    icon: "/tailwind-logo.png",
    abbr: "TW",
    rarity: "epic",
    color: buffColors.epic,
  },
  {
    id: "typescript",
    title: "TypeScript — Ancestral Typing",
    subtitle: "Language Mastery",
    description:
      "Strict typing and generics that keep large codebases safe to refactor.",
    effect: "+40% bug immunity",
    icon: "/typescript-logo.png",
    abbr: "TS",
    rarity: "epic",
    color: buffColors.epic,
  },
  {
    id: "payloadcms",
    title: "Payload CMS — Content Weaver",
    subtitle: "CMS",
    description:
      "TypeScript-first CMS with flexible, code-driven content modeling.",
    effect: "+25% content velocity",
    icon: "/payloadcms-logo.png",
    abbr: "PL",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "trpc",
    title: "tRPC — Endpoint Telepathy",
    subtitle: "API Layer",
    description:
      "End-to-end typed APIs with zero codegen and full autocompletion.",
    effect: "+45% type safety",
    icon: "/trpc-logo.png",
    abbr: "tRPC",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "express",
    title: "Express — Route Scribe",
    subtitle: "Backend Framework",
    description:
      "Minimal, battle-tested HTTP routing and middleware for Node.js.",
    effect: "+20% routes",
    icon: "/express-logo.png",
    abbr: "EX",
    rarity: "rare",
    color: buffColors.rare,
  },
  {
    id: "supabase",
    title: "Supabase — Postgres Aura",
    subtitle: "Backend / Database",
    description:
      "Auth, realtime and Postgres on the edge for full-stack applications.",
    effect: "+15% persistence",
    icon: "/supabase-logo.png",
    abbr: "SB",
    rarity: "rare",
    color: buffColors.rare,
  },
];