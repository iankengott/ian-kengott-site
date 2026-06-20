export const PROFILE = {
  name: "Ian Kengott",
  initials: "IK",
  eyebrow: "USF Physics · Magnetic Materials · Research Software",
  tagline:
    "I work on Dr. Arena lab projects, magnonics, x-ray spectromicroscopy tooling, and the infrastructure that keeps technical work reproducible.",
  avatar: "https://github.com/iankengott.png",
  github: "https://github.com/iankengott",
  sessions:
    "https://ian-kengott-gf63-thin-11sc.tail48a7cb.ts.net/sessions",
  usfLab:
    "https://www.usf.edu/arts-sciences/departments/physics/research/labs/magnetic-materials-dynamics/",
  focus:
    "Dr. Arena lab support, magnonics, muon telescope context, MANTiS/x-ray spectromicroscopy, and careful research systems.",
};

export const NAV_LINKS = [
  { label: "Research", href: "#research" },
  { label: "Systems", href: "#systems" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Notes", href: "#notes" },
  { label: "Principles", href: "#principles" },
  { label: "Connect", href: "#connect" },
];

/**
 * SECTION_META — per-section metadata surfaced in the UI:
 *   - `readTime` (minutes) powers the "≈ N min read" chip next to each heading
 *   - `label` is the human title shown in focus-mode HUD + reading progress
 * Read times are estimates of the *prose* (not the interactive widgets).
 */
export const SECTION_META: Record<string, { readTime: number; label: string }> = {
  research: { readTime: 3, label: "Research" },
  systems: { readTime: 2, label: "AI & Systems" },
  projects: { readTime: 3, label: "Projects" },
  journey: { readTime: 2, label: "Journey" },
  notes: { readTime: 3, label: "Field Notes" },
  principles: { readTime: 2, label: "Principles" },
  connect: { readTime: 1, label: "Connect" },
};

export const STATS = [
  { value: "03", label: "Research focus areas", sub: "magnonics · muon · MANTiS" },
  { value: "Live", label: "GitHub metadata", sub: "public API panel below" },
  { value: "Lab", label: "Dr. Arena context", sub: "magnetic materials work" },
  { value: "Nix", label: "Reproducible tooling", sub: "packaging-first habit" },
];

export const LENSES = [
  {
    id: "magnonics",
    label: "Magnonics",
    title: "Magnonics and magnetic materials",
    body: "Research support around magnetic materials, spin dynamics, spectroscopy context, and workflows connected to Dr. Arena's lab.",
    tags: ["Spin dynamics", "Spectroscopy", "Nanomagnetism"],
  },
  {
    id: "muon",
    label: "Muon Telescope",
    title: "Muon telescope context",
    body: "A lab-connected project thread in my notes. I keep the public description restrained until the project details are ready to publish.",
    tags: ["Detector", "Lab memory", "In development"],
  },
  {
    id: "mantis",
    label: "MANTiS",
    title: "MANTiS and x-ray spectromicroscopy",
    body: "Packaging and workflow notes for hyperspectral x-ray microscopy: preprocessing, PCA/SVD, clustering, maps, NNMA, and peak fitting.",
    tags: ["Hyperspectral", "PCA / SVD", "NNMA"],
  },
] as const;

export const MANTIS_SHOTS = [
  {
    id: "pca",
    label: "PCA",
    src: "/ian-kengott-site/img/mantis-pca.png",
    alt: "MANTiS PCA tab showing eigenvalues, eigenimage, and spectrum output",
    caption: "PCA eigenvalues, image components, and spectrum output.",
  },
  {
    id: "cluster",
    label: "Clusters",
    src: "/ian-kengott-site/img/mantis-clusters.png",
    alt: "MANTiS cluster analysis tab showing cluster maps and spectra",
    caption: "Cluster analysis with mapped regions and spectra.",
  },
  {
    id: "scatter",
    label: "Scatter",
    src: "/ian-kengott-site/img/mantis-scatter.png",
    alt: "MANTiS scatter plot window showing clustered principal components",
    caption: "Scatter plots for component-space inspection.",
  },
] as const;

export const SYSTEMS = [
  {
    icon: "Bot",
    title: "Research automation",
    body: "Agents and scripts for literature gathering, report generation, technical summaries, and repeatable research workflows.",
  },
  {
    icon: "Database",
    title: "Self-hosted memory",
    body: "Hermes, Honcho, local services, and retrieval systems that keep long-running work organized across sessions.",
  },
  {
    icon: "Boxes",
    title: "Nix / Linux tooling",
    body: "Packaging, reproducible environments, remote desktop support, and workstation/server maintenance for research software.",
  },
  {
    icon: "LayoutDashboard",
    title: "Interfaces that run",
    body: "Small dashboards, utilities, and web tools built around actual workflows rather than demos.",
  },
] as const;

export const PROJECTS = [
  {
    name: "Arbor",
    href: "https://github.com/iankengott/Arbor",
    categories: ["research", "tooling"],
    blurb:
      "Autonomous research loop work with Python packaging and reproducible experiment scaffolding.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 0,
    forks: 1,
    stack: ["Python", "Nix", "Flake"],
  },
  {
    name: "Magic",
    href: "https://github.com/iankengott/magic",
    categories: ["experiments"],
    blurb: "A Minecraft mod project and playground for game-side ideas.",
    language: "Java",
    languageColor: "#b07219",
    stars: 0,
    forks: 0,
    stack: ["Java", "Fabric", "Gradle"],
  },
  {
    name: "yt-dlp GUI",
    href: "https://github.com/iankengott/yt-dlp-gui",
    categories: ["tooling"],
    blurb:
      "A desktop-style helper around yt-dlp for making a powerful CLI tool easier to use.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 0,
    forks: 0,
    stack: ["Python", "yt-dlp", "Qt"],
  },
  {
    name: "PEER Discord Bot",
    href: "https://github.com/iankengott/peer-help",
    categories: ["experiments"],
    blurb:
      "An AI Camp team project for product-spec feedback through a Discord bot.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 0,
    forks: 0,
    stack: ["Python", "discord.py", "LLM"],
  },
] as const;

export const PROJECT_FILTERS = [
  { id: "all", label: "All" },
  { id: "research", label: "Research" },
  { id: "tooling", label: "Tooling" },
  { id: "experiments", label: "Experiments" },
] as const;

export const TIMELINE = [
  {
    year: "Now",
    title: "MANTiS packaging & spectromicroscopy",
    body: "Maintaining a Nix package for MANTiS and documenting the full hyperspectral workflow: load, preprocess, PCA/SVD, cluster, map, NNMA, peak fit.",
    tag: "Tooling",
    status: "now",
  },
  {
    year: "Active",
    title: "Dr. Arena lab support",
    body: "Working within Dr. Arena's Magnetic Materials & Spin Dynamics lab context — magnonics direction and a muon telescope thread.",
    tag: "Research",
    status: "active",
  },
  {
    year: "Ongoing",
    title: "Research automation infrastructure",
    body: "Building agents, self-hosted memory (Hermes, Honcho), and retrieval systems to keep long-running research reproducible across sessions.",
    tag: "Infrastructure",
    status: "ongoing",
  },
  {
    year: "Earlier",
    title: "Public tooling & experiments",
    body: "yt-dlp GUI, the PEER Discord bot, the Magic mod, and the Arbor fork — small, useful, shipped.",
    tag: "Shipping",
    status: "earlier",
  },
] as const;

export const PRINCIPLES = [
  {
    title: "Own the stack.",
    body: "Prefer tools that can be inspected, moved, and repaired.",
    detail: "Source-available, self-hostable, and fork-friendly by default.",
    domain: "Engineering",
    icon: "Wrench",
  },
  {
    title: "Make it useful early.",
    body: "A rough working system teaches more than a polished guess.",
    detail: "Ship the thinnest honest version first; refine under real load.",
    domain: "Process",
    icon: "Sparkles",
  },
  {
    title: "Stay grounded.",
    body: "Research pages should distinguish confirmed work from context and avoid inflated claims.",
    detail: "Label speculation as speculation. Cite or qualify.",
    domain: "Ethics",
    icon: "Anchor",
  },
  {
    title: "Protect the private parts.",
    body: "Public work should show taste and direction without leaking operational details.",
    detail: "Share the shape of the work, not the keys to the lab.",
    domain: "Operations",
    icon: "ShieldCheck",
  },
  {
    title: "Automate after understanding.",
    body: "The best automation starts with knowing where the friction really is.",
    detail: "Run the workflow by hand until the bottlenecks are obvious.",
    domain: "Process",
    icon: "Workflow",
  },
] as const;

export const NOW_ITEMS = [
  {
    label: "Packaging",
    title: "MANTiS Nix flake",
    body: "Reproducible build for the x-ray spectromicroscopy analysis toolchain.",
  },
  {
    label: "Reading",
    title: "Spin dynamics & magnonics",
    body: "Notes on ferrimagnetic materials and communication-technology funding context.",
  },
  {
    label: "Building",
    title: "Research memory layer",
    body: "Local retrieval + agents that survive across research sessions.",
  },
] as const;

/**
 * CURRENTLY — a rotating "what's on the bench right now" ticker shown in
 * the session strip. Short, present-tense, and feels live.
 */
export const CURRENTLY = [
  "packaging the MANTiS Nix flake",
  "reading up on ferrimagnetic spin dynamics",
  "wiring up a research-memory retrieval layer",
  "documenting the hyperspectral PCA workflow",
  "maintaining Arena lab support threads",
] as const;

/**
 * KEYBOARD_SHORTCUTS — surfaced in the shortcuts overlay (press `?`).
 * `combo` is a display string; `keys` are the actual single chars listened for.
 */
export const KEYBOARD_SHORTCUTS: {
  combo: string[];
  label: string;
  hint: string;
}[] = [
  { combo: ["⌘", "K"], label: "Command palette", hint: "Search & jump to anything" },
  { combo: ["?"], label: "This help", hint: "Toggle the shortcuts overlay" },
  { combo: ["T"], label: "Toggle theme", hint: "Light ↔ dark" },
  { combo: ["B"], label: "Back to top", hint: "Smooth-scroll to the hero" },
  { combo: ["F"], label: "Focus mode", hint: "Keyboard section navigation" },
  { combo: ["G", "R"], label: "Go → Research", hint: "Vim-style section jump" },
  { combo: ["G", "S"], label: "Go → Systems", hint: "Vim-style section jump" },
  { combo: ["G", "P"], label: "Go → Projects", hint: "Vim-style section jump" },
  { combo: ["G", "N"], label: "Go → Notes", hint: "Vim-style section jump" },
  { combo: ["Esc"], label: "Close overlays", hint: "Dismiss palette / help" },
];

/**
 * VIM_GO — single-key targets for `g` + key navigation.
 * Keys are lowercased at listen time.
 */
export const VIM_GO: Record<string, string> = {
  r: "#research",
  s: "#systems",
  p: "#projects",
  j: "#journey",
  n: "#notes",
  c: "#connect",
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/iankengott" },
  { label: "Research sessions", href: PROFILE.sessions },
  { label: "USF lab page", href: PROFILE.usfLab },
] as const;

/**
 * Field Notes — a short reading / research-notes shelf.
 * Adds editorial texture and a reason to keep returning to the page.
 */
export const FIELD_NOTES = [
  {
    tag: "Spectroscopy",
    title: "PCA vs. SVD in hyperspectral stacks",
    excerpt:
      "When eigenvalues plateau early, the signal lives in a thin subspace — cluster on that, not on the raw spectra.",
    meta: "MANTiS workflow · notes",
    icon: "ScanLine",
    status: "published",
  },
  {
    tag: "Magnonics",
    title: "Why ferrimagnets beat ferromagnets for comms",
    excerpt:
      "Opposing sublattice moments let spin waves run faster without the usual damping tax. USF's recent funding round backs this direction.",
    meta: "Reading · USF chronicles",
    icon: "Waves",
    status: "published",
  },
  {
    tag: "Infrastructure",
    title: "Nix flakes as research memory",
    excerpt:
      "A pinned flake is a time machine: the same build, the same paths, the same answers — months later, on a different machine.",
    meta: "Tooling · field note",
    icon: "Package",
    status: "published",
  },
  {
    tag: "Muon telescope",
    title: "Detector geometry, kept conservative",
    excerpt:
      "Public details stay restrained until the project is ready. The thread is real; the claims are not yet.",
    meta: "In development",
    icon: "Crosshair",
    status: "draft",
  },
] as const;

/**
 * Searchable command-palette items. Built from sections, projects,
 * principles, lenses, and field notes so ⌘K becomes a real index.
 */
export type SearchItem = {
  id: string;
  label: string;
  hint: string;
  group: string;
  keywords: string[];
  action: "scroll" | "external";
  target: string;
};

export const SEARCH_ITEMS: SearchItem[] = [
  // Sections
  { id: "sec-research", label: "Research", hint: "Dr. Arena lab work", group: "Sections", keywords: ["arena", "magnonics", "muon", "mantis", "spectromicroscopy", "xray", "spin"], action: "scroll", target: "#research" },
  { id: "sec-systems", label: "AI & Systems", hint: "Research infrastructure", group: "Sections", keywords: ["ai", "automation", "memory", "hermes", "honcho", "nix", "dashboards"], action: "scroll", target: "#systems" },
  { id: "sec-projects", label: "Projects", hint: "Public repos", group: "Sections", keywords: ["arbor", "magic", "yt-dlp", "peer", "discord", "repo", "github"], action: "scroll", target: "#projects" },
  { id: "sec-journey", label: "Journey", hint: "Timeline", group: "Sections", keywords: ["timeline", "history", "path", "now"], action: "scroll", target: "#journey" },
  { id: "sec-principles", label: "Principles", hint: "Build, verify, simplify", group: "Sections", keywords: ["principles", "rules", "philosophy"], action: "scroll", target: "#principles" },
  { id: "sec-notes", label: "Field Notes", hint: "Reading & research notes", group: "Sections", keywords: ["notes", "reading", "pca", "svd", "ferrimagnet", "nix", "flake", "muon"], action: "scroll", target: "#notes" },
  { id: "sec-connect", label: "Connect", hint: "Public links", group: "Sections", keywords: ["contact", "email", "message", "reach", "github"], action: "scroll", target: "#connect" },
  // Lenses
  { id: "lens-magnonics", label: "Focus: Magnonics", hint: "Spin dynamics", group: "Research focus", keywords: ["magnonics", "spin", "dynamics", "nanomagnetism", "spectroscopy"], action: "scroll", target: "#research" },
  { id: "lens-muon", label: "Focus: Muon Telescope", hint: "Detector thread", group: "Research focus", keywords: ["muon", "telescope", "detector", "cosmic"], action: "scroll", target: "#research" },
  { id: "lens-mantis", label: "Focus: MANTiS", hint: "X-ray spectromicroscopy", group: "Research focus", keywords: ["mantis", "xray", "spectromicroscopy", "hyperspectral", "pca", "nnma", "clustering"], action: "scroll", target: "#research" },
  // Projects
  { id: "proj-arbor", label: "Project: Arbor", hint: "Autonomous research loop", group: "Projects", keywords: ["arbor", "python", "nix", "research loop", "simulation"], action: "external", target: "https://github.com/iankengott/Arbor" },
  { id: "proj-magic", label: "Project: Magic", hint: "Minecraft mod", group: "Projects", keywords: ["magic", "minecraft", "mod", "game"], action: "external", target: "https://github.com/iankengott/magic" },
  { id: "proj-ytdlp", label: "Project: yt-dlp GUI", hint: "Desktop helper", group: "Projects", keywords: ["yt-dlp", "youtube", "gui", "download", "desktop"], action: "external", target: "https://github.com/iankengott/yt-dlp-gui" },
  { id: "proj-peer", label: "Project: PEER Discord Bot", hint: "Product-spec feedback", group: "Projects", keywords: ["peer", "discord", "bot", "ai camp", "feedback"], action: "external", target: "https://github.com/iankengott/peer-help" },
  // Principles
  { id: "prin-1", label: "Principle: Own the stack", hint: "Inspect, move, repair", group: "Principles", keywords: ["own", "stack", "tools", "inspect", "repair"], action: "scroll", target: "#principles" },
  { id: "prin-2", label: "Principle: Make it useful early", hint: "Rough & working", group: "Principles", keywords: ["useful", "early", "rough", "working", "guess"], action: "scroll", target: "#principles" },
  { id: "prin-3", label: "Principle: Stay grounded", hint: "Confirmed vs context", group: "Principles", keywords: ["grounded", "claims", "conservative", "context", "confirmed"], action: "scroll", target: "#principles" },
  { id: "prin-4", label: "Principle: Protect the private parts", hint: "Taste without leaks", group: "Principles", keywords: ["protect", "private", "operational", "leak", "taste"], action: "scroll", target: "#principles" },
  { id: "prin-5", label: "Principle: Automate after understanding", hint: "Know the friction first", group: "Principles", keywords: ["automate", "understanding", "friction"], action: "scroll", target: "#principles" },
  // Field notes
  { id: "note-pca", label: "Note: PCA vs. SVD in hyperspectral stacks", hint: "Spectroscopy", group: "Field notes", keywords: ["pca", "svd", "hyperspectral", "eigenvalues", "subspace", "cluster"], action: "scroll", target: "#notes" },
  { id: "note-ferrimagnet", label: "Note: Why ferrimagnets beat ferromagnets", hint: "Magnonics", group: "Field notes", keywords: ["ferrimagnet", "ferromagnet", "spin waves", "comms", "damping", "sublattice"], action: "scroll", target: "#notes" },
  { id: "note-nix", label: "Note: Nix flakes as research memory", hint: "Infrastructure", group: "Field notes", keywords: ["nix", "flake", "reproducible", "time machine", "pinned"], action: "scroll", target: "#notes" },
  { id: "note-muon", label: "Note: Detector geometry, kept conservative", hint: "Muon telescope", group: "Field notes", keywords: ["muon", "detector", "geometry", "conservative"], action: "scroll", target: "#notes" },
  // External links
  { id: "ext-github", label: "GitHub profile", hint: "github.com/iankengott", group: "Links", keywords: ["github", "profile", "repos", "code"], action: "external", target: PROFILE.github },
  { id: "ext-sessions", label: "Research sessions", hint: "Live workspace", group: "Links", keywords: ["sessions", "workspace", "live", "tailscale"], action: "external", target: PROFILE.sessions },
  { id: "ext-usf", label: "USF lab page", hint: "Magnetic materials dynamics", group: "Links", keywords: ["usf", "lab", "arena", "university", "physics"], action: "external", target: PROFILE.usfLab },
];
