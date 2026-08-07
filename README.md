# The Kubernetes Troubleshooting Playbook

Conference-quality presentation: **Think Like a Platform Engineer**.

Built with **Astro.js** + **Tailwind CSS**. Dark theme, CSS decision flows, speaker notes, and keyboard-driven navigation.

## Quick start

```bash
# Use a working Node 20+ (Homebrew node may need a llhttp fix on some machines)
export PATH="$PWD/.tools/node-v22.18.0-darwin-arm64/bin:$PATH"  # if you used the local portable Node

npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

### Markdown download

All slide content is available as Markdown:

1. Click **MD** in the deck header (opens `/download` and saves the file)
2. Or open [http://localhost:4321/download](http://localhost:4321/download)
3. Or use the raw file: `public/kubernetes-troubleshooting-playbook.md`

```bash
npm run export:md   # regenerate Markdown from slides
npm run dev         # then open the deck / click MD
```

The export also runs automatically before `npm run build`.

```bash
npm run build    # static site → dist/
npm run preview  # preview production build
```

## Presenting

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` / `Backspace` | Previous |
| `N` | Speaker notes |
| `O` | Overview grid |
| `F` | Fullscreen |
| `?` | Help |
| `Home` / `End` | First / last |

Deep-link any slide: `?slide=12` (0-based index).

## Story arc

**Observe → Locate → Narrow → Verify → Fix → Validate → Prevent**

Mental models reinforced throughout:

- Troubleshooting Pyramid
- Kubernetes Onion (13 layers)
- Signal Triangle — Events (WHAT) · Logs (WHY) · Metrics (WHEN) · Traces (WHERE)
- Running ≠ Healthy · Ready ≠ Alive · Scheduled ≠ Working

## Deck structure (104 slides)

1. **Opening** — philosophy, lifecycle, why K8s is hard  
2. **Mental models** — myths, golden rules, pyramid, onion, signals  
3. **Layer-by-layer** — infra → cluster → control plane → nodes → scheduling → workloads → pods → containers → storage → networking → app  
4. **Decision trees** — Pending, CrashLoopBackOff, HTTP 503  
5. **Failure catalog** — CrashLoop, ImagePull, config errors, OOM/eviction, mounts, probes, DNS, Services, Ingress/Gateway, NetworkPolicy  
6. **kubectl by intention** — get / describe / logs / debug / top / rollout / …  
7. **Observability & advanced debug**  
8. **Production incident walkthroughs**  
9. **Interview bank** (30+) · cheat sheets · final playbook · closing

## Project layout

```
src/
  components/
    ui/           # Slide, Callout, CodeBlock, Mermaid, Matrix, …
    slides/       # One Astro component per slide (S01…S57 (+ splits))
  layouts/        # Presentation chrome + shortcuts
  pages/index.astro
  scripts/presentation.ts
  styles/global.css
```

## Design notes

- **Projector-friendly**: larger type, fewer blocks per slide, CSS diagrams (no Mermaid)
- Dense topics are split across sibling slides (`S27` → `S27b`) — same content, less crowding

- One slide = one Astro component (easy to review and extend)
- Content prioritizes **engineering thought process** over memorizing commands
- Synthesized from Kubernetes docs, CNCF/KubeCon practice, SRE playbooks — not copied docs

## Closing line

> Don't memorize kubectl commands.  
> Memorize the engineering thought process.
