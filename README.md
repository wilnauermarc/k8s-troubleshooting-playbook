# The Kubernetes Troubleshooting Playbook

Conference-quality presentation: **Think Like a Platform Engineer**.

Built with **Astro.js** + **Tailwind CSS**. Dark theme, CSS decision flows, and keyboard-driven navigation.

## Quick start

```bash
# Use a working Node 20+ (Homebrew node may need a llhttp fix on some machines)
export PATH="$PWD/.tools/node-v22.18.0-darwin-arm64/bin:$PATH"  # if you used the local portable Node

npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

```bash
npm run build    # static site → dist/
npm run preview  # preview production build
```

## Presenting

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` / `Backspace` | Previous |
| `O` | Overview grid |
| `F` | Fullscreen |
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

## License

### Source code

The source code of this project is licensed under the MIT License. See [LICENSE](LICENSE).

### Playbook content

The Kubernetes Troubleshooting Playbook content, including original slides, explanations, diagrams, troubleshooting methodologies, and educational material, is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). See [LICENSE-CONTENT](LICENSE-CONTENT).

You are free to share and adapt the content, including for commercial purposes, provided appropriate attribution is given.

Attribution:

> Marc Wilnauer — Kubernetes Troubleshooting Playbook  
> https://k8sts.netlify.app/

### Trademarks

Kubernetes® and the Kubernetes logo are trademarks of The Linux Foundation®. This project is not affiliated with, endorsed by, or sponsored by The Linux Foundation, the Cloud Native Computing Foundation (CNCF), or the Kubernetes project. The helm-wheel glyph used in the UI is a Unicode character for branding convenience and is not an official Kubernetes logo.
