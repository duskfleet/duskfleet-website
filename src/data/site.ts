const repo = 'https://github.com/duskfleet/duskfleet';
const docs = `${repo}/blob/main/docs`;

export const site = {
  name: 'DuskFleet',
  title: 'DuskFleet — A fleet of agents for your own machine',
  description:
    'DuskFleet runs autonomous Claude Code agents on your local projects, unattended and on a schedule, and records every run: each tool call, each denial, each dollar. Open source, MIT, local-first.',
  repo,
  // Google Analytics 4 measurement ID (G-XXXXXXXXXX). Empty string = analytics off.
  gaId: '',
  links: {
    releases: `${repo}/releases`,
    license: `${repo}/blob/main/LICENSE`,
    roadmap: `${repo}#status-and-roadmap`,
    docs: `${repo}#documentation`,
    docsAgents: `${docs}/agents.md`,
    docsSchedules: `${docs}/schedules.md`,
    docsMcp: `${docs}/mcp-server.md`,
    docsHowItWorks: `${docs}/how-it-works.md`,
  },
};

export type NavLink = { label: string; href: string; external?: boolean };

export const nav: NavLink[] = [
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Docs', href: site.links.docs, external: true },
];

export type Status = 'running' | 'review' | 'completed' | 'failed';

export const statusLabel: Record<Status, string> = {
  running: 'running',
  review: 'needs review',
  completed: 'completed',
  failed: 'failed',
};

export const heroRuns: { status: Status; title: string; meta: string }[] = [
  { status: 'running', title: 'Fix the flaky scheduler test and explain the cause', meta: 'sonnet · 2m 10s' },
  { status: 'review', title: 'Nightly: update dependencies and run the suite', meta: '1 denial · $0.42' },
  { status: 'completed', title: 'Review PR 41 for missing tests', meta: 'haiku · $0.03' },
];

export const verdicts: { status: Status; title: string; sub: string; subTone?: 'amber'; cost: string }[] = [
  { status: 'completed', title: 'Add retry to the fetch helper', sub: 'test-fixer · app · 4 turns', cost: '$0.07' },
  { status: 'review', title: 'Nightly dependency bump', sub: 'Bash(git push) denied · exit 0', subTone: 'amber', cost: '$0.42' },
  { status: 'failed', title: 'Migrate the config loader to zod', sub: 'context exhausted after 38 turns', cost: '$1.90' },
];

export type Tick = 'ok' | 'review' | 'skipped' | 'next';

export const week: { day: string; tick: Tick }[] = [
  { day: 'Mon', tick: 'ok' },
  { day: 'Tue', tick: 'ok' },
  { day: 'Wed', tick: 'review' },
  { day: 'Thu', tick: 'ok' },
  { day: 'Fri', tick: 'skipped' },
  { day: 'Sat', tick: 'ok' },
  { day: 'Sun', tick: 'next' },
];

export const weekLegend: { tick: Tick; label: string }[] = [
  { tick: 'ok', label: 'ran clean' },
  { tick: 'review', label: 'needs review' },
  { tick: 'skipped', label: 'skipped, agent busy' },
  { tick: 'next', label: 'next' },
];

export const costRows = [
  { model: 'haiku', runs: '212', avg: '$0.03', total: '$6.36' },
  { model: 'sonnet', runs: '58', avg: '$0.31', total: '$17.98' },
  { model: 'opus', runs: '4', avg: '$2.10', total: '$8.40' },
];

export const costTotal = { model: 'All models', runs: '274', avg: '', total: '$32.74' };

export const stats = [
  { value: '3', label: 'runtime dependencies' },
  { value: '15', label: 'MCP tools' },
  { value: '0', label: 'accounts to create' },
  { value: 'MIT', label: 'license, public repo' },
];

export const faq = [
  {
    q: 'Does it need an API key?',
    a: 'No. It spawns the Claude Code CLI already logged in on your machine. DuskFleet never sees or stores credentials.',
  },
  {
    q: 'What does a run cost?',
    a: 'Whatever Claude Code charges for that session, nothing more. DuskFleet records the cost per run and lets you cap a budget per agent.',
  },
  {
    q: 'Can an agent break out of its project?',
    a: 'File tools and Bash paths are confined to the project directory plus the extra directories you allow. Anything outside is denied and written to the log.',
  },
  {
    q: 'What happens if two schedules fire on the same project?',
    a: 'One run per project and one per agent at a time. The second tick is recorded as skipped, never queued.',
  },
  {
    q: 'Does it work with Codex or other CLIs?',
    a: 'Today it runs Claude Code only. The runner is a thin layer over the CLI, so other agents are on the roadmap once their non-interactive mode is stable.',
  },
  {
    q: 'Where is my data?',
    a: "In the repo's data folder: one SQLite database and one JSONL log per run. Delete the folder and it is gone.",
  },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Docs',
    links: [
      { label: 'Agents', href: site.links.docsAgents, external: true },
      { label: 'Schedules', href: site.links.docsSchedules, external: true },
      { label: 'MCP server', href: site.links.docsMcp, external: true },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: site.repo, external: true },
      { label: 'Roadmap', href: site.links.roadmap, external: true },
      { label: 'License', href: site.links.license, external: true },
    ],
  },
];
