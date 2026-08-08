# The Kubernetes Troubleshooting Playbook

**Think Like a Platform Engineer**

> Markdown export of the conference presentation. Same content as the Astro deck — for reading, studying, and sharing offline.

- Slides: **115**
- Generated: **2026-08-08**
- Navigation in the live deck: `→` next · `N` notes · `O` overview

## Mental models (quick reference)

1. **Investigation lifecycle:** Observe → Locate → Narrow → Verify → Fix → Validate → Prevent
2. **Troubleshooting pyramid:** Infrastructure → Cluster → Workload → Application → Business
3. **Kubernetes onion:** peel layers outside-in
4. **Signal triangle:** Events = WHAT · Logs = WHY · Metrics = WHEN · Traces = WHERE
5. **Mantras:** Running ≠ Healthy · Ready ≠ Alive · Scheduled ≠ Working · Events explain WHAT · Logs explain WHY

---

## Table of contents

- **Opening**
  - [1. The Kubernetes Troubleshooting Playbook](#slide-1)
  - [2. How to Use This Deck](#slide-2)
- **Mindset**
  - [3. Core Mantras](#slide-3)
  - [4. How You Investigate](#slide-4)
  - [5. The Investigation Lifecycle](#slide-5)
  - [6. What Each Step Means](#slide-6)
  - [7. Why Kubernetes Is Hard to Debug](#slide-7)
  - [8. Kubernetes as a Distributed System](#slide-8)
  - [9. Desired State vs Current State](#slide-9)
  - [10. The Reconciliation Loop](#slide-10)
  - [11. Where the Loop Gets Stuck](#slide-11)
- **Rules & Models**
  - [12. Common Debugging Myths (1/2)](#slide-12)
  - [13. Common Debugging Myths (2/2)](#slide-13)
  - [14. Golden Rules (1/2)](#slide-14)
  - [15. Golden Rules (2/2)](#slide-15)
  - [16. Read Evidence in Order](#slide-16)
  - [17. The Troubleshooting Pyramid](#slide-17)
  - [18. The Kubernetes Onion — Outer Layers](#slide-18)
  - [19. The Kubernetes Onion — Inner Layers](#slide-19)
  - [20. The Signal Triangle](#slide-20)
  - [21. Symptom → Layer Map](#slide-21)
  - [22. First Triage: Pod, Service, DNS, or App?](#slide-22)
- **Investigation**
  - [23. Layer-by-Layer Investigation](#slide-23)
- **Layers**
  - [24. Infrastructure Layer](#slide-24)
  - [25. Infrastructure Layer — Commands](#slide-25)
  - [26. Cluster Layer](#slide-26)
  - [27. Cluster Layer — Commands](#slide-27)
  - [28. Control Plane](#slide-28)
  - [29. Control Plane — Commands](#slide-29)
  - [30. Nodes](#slide-30)
  - [31. Nodes — Commands](#slide-31)
  - [32. Scheduling](#slide-32)
  - [33. Scheduling — Commands](#slide-33)
  - [34. Requests, Limits, Quotas & LimitRanges](#slide-34)
  - [35. Deployments & ReplicaSets](#slide-35)
  - [36. Deployments & ReplicaSets — Commands](#slide-36)
  - [37. Pods](#slide-37)
  - [38. Pods — Commands](#slide-38)
  - [39. Pod Status: Phase ≠ Conditions ≠ Containers](#slide-39)
  - [40. Containers](#slide-40)
  - [41. Containers — Commands](#slide-41)
  - [42. Storage](#slide-42)
  - [43. Storage — Commands](#slide-43)
  - [44. Networking](#slide-44)
  - [45. Networking — Commands](#slide-45)
  - [46. Application & Business Logic](#slide-46)
  - [47. Application & Business Logic — Commands](#slide-47)
- **Decision Trees**
  - [48. Decision Trees](#slide-48)
  - [49. Pod Pending — First Branch](#slide-49)
  - [50. Pending but Scheduled](#slide-50)
  - [51. CrashLoopBackOff — First Moves](#slide-51)
  - [52. CrashLoop — Exit Code Path](#slide-52)
  - [53. HTTP 503 — First Branch](#slide-53)
  - [54. 503 — Outside-In Path](#slide-54)
  - [55. Checkpoint — Decision Trees](#slide-55)
- **Failure Patterns**
  - [56. Failure Pattern Catalog](#slide-56)
  - [57. Catalog — Pod & Resources](#slide-57)
  - [58. Catalog — Probes & Network](#slide-58)
  - [59. CrashLoopBackOff](#slide-59)
  - [60. ImagePullBackOff — No Container Starts](#slide-60)
  - [61. ImagePull — Event Matrix & Commands](#slide-61)
  - [62. CreateContainerConfigError vs CreateContainerError](#slide-62)
  - [63. Config Errors — Matrix & Commands](#slide-63)
  - [64. OOMKilled — Container Memory Limit](#slide-64)
  - [65. Evicted & Node Resource Pressure](#slide-65)
  - [66. Pending — Nothing Scheduled Yet](#slide-66)
  - [67. FailedScheduling — Reasons & Commands](#slide-67)
  - [68. FailedMount — Kubelet Can't Mount Volume](#slide-68)
  - [69. MultiAttach, CSI & Volume Triage](#slide-69)
  - [70. Probes: Ready ≠ Alive](#slide-70)
  - [71. Probe Failures — Symptoms & Commands](#slide-71)
  - [72. DNS Path Through the Cluster](#slide-72)
  - [73. DNS — Diagnose Fast](#slide-73)
  - [74. DNS Fast-Path — Four Checks](#slide-74)
  - [75. Service: Selectors & EndpointSlices](#slide-75)
  - [76. Service — Diagnose Fast](#slide-76)
  - [77. EndpointSlices — Backend Conditions](#slide-77)
  - [78. Ingress vs Gateway API](#slide-78)
  - [79. TLS & cert-manager](#slide-79)
  - [80. NetworkPolicy: Default-Deny Mental Model](#slide-80)
  - [81. NetworkPolicy — Debug Commands](#slide-81)
- **kubectl by Intention**
  - [82. kubectl by Intention](#slide-82)
  - [83. Observe & Locate](#slide-83)
  - [84. Narrow & Verify](#slide-84)
- **Observability**
  - [85. Signals — WHAT, WHY, WHEN, WHERE](#slide-85)
  - [86. Stack — Which Tool Answers Which Question?](#slide-86)
- **Advanced Debugging**
  - [87. kubectl debug — Ephemeral Containers](#slide-87)
  - [88. When NOT to Use Invasive Tools](#slide-88)
  - [89. exec vs kubectl debug](#slide-89)
- **Production Incidents**
  - [90. Production Incidents — Practice](#slide-90)
  - [91. Incident: Running Pods, HTTP 503](#slide-91)
  - [92. 503 — Fix, Validate, Prevent](#slide-92)
  - [93. Incident: CrashLoop from Missing Secret](#slide-93)
  - [94. Missing Secret — Fix & Prevent](#slide-94)
  - [95. Incident: Pending from Affinity &amp; Taints](#slide-95)
  - [96. Affinity & Taints — Fix & Prevent](#slide-96)
  - [97. Incident: OOMKilled — Memory Leak](#slide-97)
  - [98. OOMKilled — Fix & Prevent](#slide-98)
  - [99. Incident: Gateway API Route Misconfiguration](#slide-99)
  - [100. Gateway Route — Fix & Prevent](#slide-100)
  - [101. Incident: Timeout — DNS or NetPol?](#slide-101)
  - [102. DNS vs NetPol — Fix Paths](#slide-102)
  - [103. Incident: PVC MultiAttach](#slide-103)
  - [104. Incident: Stale ConfigMap Rollout](#slide-104)
- **Interview Prep**
  - [105. Interview Bank — Questions 1–8](#slide-105)
  - [106. Interview Bank — Questions 9–16](#slide-106)
  - [107. Interview Bank — Questions 17–24](#slide-107)
  - [108. Interview Bank — Questions 25–32](#slide-108)
- **Reference**
  - [109. Cheat Sheet — First 60 Seconds](#slide-109)
  - [110. Cheat Sheet — Status Meanings](#slide-110)
  - [111. Cheat Sheet — Networking Quick Path](#slide-111)
  - [112. Checkpoint — Core Basics](#slide-112)
- **Synthesis**
  - [113. Final Playbook — The Loop](#slide-113)
  - [114. Three Models to Take Home](#slide-114)
- **Closing**
  - [115. Closing — Keep the Thought Process](#slide-115)

---

# Opening

## Slide 1: The Kubernetes Troubleshooting Playbook {#slide-1}

*File: `S01_Title.astro` · id: `s01-title` · variant: title*

### Speaker notes

Study framing: this is a self-study playbook. Work linearly the first time; later jump via overview (O) or Markdown export. Goal is judgment under pressure, not memorizing kubectl alphabetically.

### Content

- The Kubernetes
Troubleshooting Playbook
      

      
        Think Like a Platform Engineer
- A systematic study guide for finding root cause — layers, signals, and decision trees you can reuse under pressure.
- Self-study
      Platform / SRE
      DevOps
      Developers on K8s
      Reference later

---

## Slide 2: How to Use This Deck {#slide-2}

*File: `S02_Agenda.astro` · id: `s02-agenda`*

### Speaker notes

Three tracks: Core = mental models and must-know; Practice = incidents + interview drills; Reference = cheat sheets and command matrices. First pass: Core → Decision Trees → one incident. Then revisit Reference as needed.

### Content

- Recurring framework
      

      -
- Core
        Models, layers, decision trees, first triage
- Practice
        Incidents, checkpoints, interview bank
- Reference
        Cheat sheets, command matrices, catalogs
- Tip: press O for overview · N for notes · MD to export Markdown.

---

# Mindset

## Slide 3: Core Mantras {#slide-3}

*File: `S03_Philosophy.astro` · id: `s03-philosophy`*

### Speaker notes

Read each aloud with a real example. Status fields lie by omission.

### Content

- Running ≠ Healthy
- Process can run while the app is broken or serving errors.
- Ready ≠ Alive
- Readiness gates traffic; liveness only restarts.
- Scheduled ≠ Working
- On a node ≠ mounts, network, and probes succeeded.

---

## Slide 4: How You Investigate {#slide-4}

*File: `S03b_PhilosophyMore.astro` · id: `s03b-philosophy-more`*

### Speaker notes

These three turn panic into a process.

### Content

- Events explain WHAT
- Events and Conditions show control-plane actions; logs explain application failures. Prefer the cheapest high-signal evidence first.
- Observe before Changing
- Every change destroys evidence. Gather signals first.
- Always Form a Hypothesis
- State what you expect — then prove or disprove it.

---

## Slide 5: The Investigation Lifecycle {#slide-5}

*File: `S04_Lifecycle.astro` · id: `s04-lifecycle`*

### Speaker notes

Walk the ring clockwise. Observe is non-negotiable on novel failures. Validate and Prevent are where most teams stop short.

### Content

- 
    
      Same loop at every layer — from load balancer to business logic.

---

## Slide 6: What Each Step Means {#slide-6}

*File: `S04b_LifecycleSteps.astro` · id: `s04b-lifecycle-steps`*

### Speaker notes

Quick definitions. Emphasize hypothesis in Narrow and evidence in Verify.

> **RULE:** Never skip Observe on a failure you’ve never seen before.

### Content

- 
    
      
        Observe
- Events, metrics, symptoms — don’t change yet.
- Which layer failed: infra → app?
- Hypothesis — eliminate options.
- Prove root cause with evidence.
- Smallest change for the root cause.
- Users, SLOs, downstream deps OK?
- Alerts, runbooks, tests — so this class can’t recur silently.

---

## Slide 7: Why Kubernetes Is Hard to Debug {#slide-7}

*File: `S05_WhyHard.astro` · id: `s05-why-hard`*

### Speaker notes

Validate the audience's frustration — K8s debugging is genuinely harder than monolith debugging. Walk through each pain point with a nod to experience: eventual consistency explains 'it worked after 5 minutes,' indirection explains 'the Service looks fine but nothing connects.' This slide earns trust before teaching the framework.

### Content

- 01
        Many Layers
- Infra, CNI, kubelet, scheduler, controllers, sidecars, app code — failure can hide at any stratum.
- 02
        Eventual Consistency
- Desired state propagates asynchronously. Symptoms appear, disappear, and shift during reconciliation.
- 03
        Indirection
- Deployments → ReplicaSets → Pods → Containers. Services → EndpointSlices → Pods. Labels everywhere.
- 04
        Shared Fate
- Noisy neighbors, node pressure, and control-plane issues affect unrelated workloads on the same cluster.
- 05
        Opaque Failures
- CrashLoopBackOff, ImagePullBackOff, and Pending describe symptoms — not causes. The API surface hides implementation details behind abstractions.

---

## Slide 8: Kubernetes as a Distributed System {#slide-8}

*File: `S06_Distributed.astro` · id: `s06-distributed`*

### Speaker notes

Point at each box left to right. etcd holds desired state; API is the front door; controllers and scheduler act; kubelets report actual state. Bugs live in the gap between desired and actual.

> **FRAMEWORK:** Always ask: which component owns this transition?

### Content

- Desired

        What you declared in YAML — stored in etcd.
- Actual

        What kubelets report — may lag or fail silently.
- The Gap

        Most incidents live between desired and actual.

---

## Slide 9: Desired State vs Current State {#slide-9}

*File: `S07_DesiredState.astro` · id: `s07-desired-state`*

### Speaker notes

Point at THE GAP — controllers live there. Spec is what you want; status is what K8s reports; events explain what was tried.

> **FRAMEWORK:** Kubernetes explains WHAT — apps explain WHY.

---

## Slide 10: The Reconciliation Loop {#slide-10}

*File: `S08_Reconciliation.astro` · id: `s08-reconciliation`*

### Speaker notes

Controllers watch, observe, diff, act, update status, emit events. Debugging finds where the loop stalls.

---

## Slide 11: Where the Loop Gets Stuck {#slide-11}

*File: `S08b_ReconciliationStuck.astro` · id: `s08b-reconciliation-stuck`*

### Speaker notes

Three common stall points. Diff = status never updates. Act = admission/quota/RBAC. Loop = CrashLoop forever.

> **RULE:** Find the stall. Don’t restart the pod hoping the loop heals itself.

### Content

- Stuck at Diff
- Status never catches up — check kubelet, CRI, probes.
- Stuck at Act
- Action rejected — RBAC, quota, or admission webhook.
- Stuck in Loop
- CrashLoop — controller recreates; fix the exit cause.

---

# Rules & Models

## Slide 12: Common Debugging Myths (1/2) {#slide-12}

*File: `S09_Myths.astro` · id: `s09-myths`*

### Speaker notes

These myths are deeply ingrained — many teams learn them from Stack Overflow. For each myth, ask for a show of hands who has done it. The restart myth is the most dangerous: it clears evidence and masks intermittent failures. Two more myths on the next slide.

> **MYTH:** "Restart the pod — that usually fixes it."
      Restarts clear crash evidence and treat symptoms, not root cause.

> **MYTH:** "Start with logs — they'll tell you everything."
      Logs explain why inside a container. Events tell you why K8s acted.

> **MYTH:** "Status Running means the app is healthy."
      Running only means the main process hasn't exited. Probes and SLOs matter.

### Content

- "Restart the pod — that usually fixes it."
      Restarts clear crash evidence and treat symptoms, not root cause.

    

    
      "Start with logs — they'll tell you everything."
      Logs explain why inside a container. Events tell you why K8s acted.

    

    
      "Status Running means the app is healthy."
      Running only means the main process hasn't exited. Probes and SLOs matter.

---

## Slide 13: Common Debugging Myths (2/2) {#slide-13}

*File: `S09b_MythsMore.astro` · id: `s09b-myths-more`*

### Speaker notes

Two more myths to round out the set. Delete-pod myth: you lose node placement, ephemeral state, and event history. More-replicas myth: replicas spread load but don't fix broken configs or dependencies. Transition to golden rules as the antidote.

> **MYTH:** "Delete the pod to debug — it'll come back fresh."
      You lose node placement, ephemeral state, and event history.

> **MYTH:** "More replicas = more healthy."
      Replicas spread load; they don't fix broken configs, bad images, or failing dependencies.

### Content

- "Delete the pod to debug — it'll come back fresh."
      You lose node placement, ephemeral state, and event history.

    

    
      "More replicas = more healthy."
      Replicas spread load; they don't fix broken configs, bad images, or failing dependencies.

---

## Slide 14: Golden Rules (1/2) {#slide-14}

*File: `S10_GoldenRules.astro` · id: `s10-golden-rules`*

### Speaker notes

Prefer cheapest high-signal evidence first — often Events and Conditions; CrashLoop may make logs --previous the fastest win. Events explain Kubernetes actions; logs explain application failures. Hypothesize before the next command.

> **CHEAPEST HIGH-SIGNAL EVIDENCE FIRST:** Start with Events, Conditions, and logs --previous when relevant — Events explain Kubernetes actions; logs explain application failures.

> **HYPOTHESIZE:** Write down what you think is wrong before running the next command.

> **ELIMINATE LAYERS:** Rule out infra and cluster before diving into application code.

> **OUTSIDE-IN / BOTTOM-UP:** Start from user impact, eliminate from infrastructure upward.

### Content

- Start with Events, Conditions, and logs --previous when relevant — Events explain Kubernetes actions; logs explain application failures.
    

    
      Write down what you think is wrong before running the next command.
    

    
      Rule out infra and cluster before diving into application code.
    

    
      Start from user impact, eliminate from infrastructure upward.

---

## Slide 15: Golden Rules (2/2) {#slide-15}

*File: `S10b_GoldenRulesMore.astro` · id: `s10b-golden-rules-more`*

### Speaker notes

Three rules under incident pressure. Don't change while observing is the hardest — snapshot state first. Validate after fix with metrics and real traffic, not just pod status. Prevent after validate: every fix should leave the system more observable than before.

> **DON'T CHANGE WHILE OBSERVING:** Snapshot state first. Mutations destroy the evidence you need.

> **VALIDATE AFTER FIX:** Confirm the fix with metrics, probes, and real traffic — not just pod status.

> **PREVENT AFTER VALIDATE:** Add alerts, runbooks, or guardrails so the same failure class can't hide again.

### Content

- Snapshot state first. Mutations destroy the evidence you need.
    

    
      Confirm the fix with metrics, probes, and real traffic — not just pod status.
    

    
      Add alerts, runbooks, or guardrails so the same failure class can't hide again.

---

## Slide 16: Read Evidence in Order {#slide-16}

*File: `S10c_EvidenceOrder.astro` · id: `s10c-evidence-order`*

### Speaker notes

Default order — skip only with a reason. CrashLoop often makes logs --previous the fastest win after describe. Exec/debug last.

> **RULE:** Default path: describe → Events/Conditions → logs → YAML → then debug. Reorder when the symptom already points at logs (CrashLoop).

---

## Slide 17: The Troubleshooting Pyramid {#slide-17}

*File: `S11_Pyramid.astro` · id: `s11-pyramid`*

### Speaker notes

Bottom-up elimination: rule out infra before blaming the app. Top gives user impact context. Rule of thumb: many pods → cluster; one pod → workload/app.

> **TIP:** Eliminate lower layers before blaming the app.

> **SIGNAL:** Start from user impact, then drill down.

> **RULE:** 50% pods fail → cluster. 1 pod fails → workload/app.

### Content

- Eliminate lower layers before blaming the app.
      Start from user impact, then drill down.
      50% pods fail → cluster. 1 pod fails → workload/app.

---

## Slide 18: The Kubernetes Onion — Outer Layers {#slide-18}

*File: `S12_Onion.astro` · id: `s12-onion`*

### Speaker notes

Concentric rings outermost → inward. Infra wraps cluster wraps control plane… Peel one layer at a time. Inner layers next slide.

### Content

- Each ring has its own signals and owners.
      Don’t skip layers.

---

## Slide 19: The Kubernetes Onion — Inner Layers {#slide-19}

*File: `S12b_OnionInner.astro` · id: `s12b-onion-inner`*

### Speaker notes

Where most day-to-day debugging lives. Platform can be perfect while the app lies — validate response bodies, not just pod phase.

### Content

- Most incidents live here.
      Platform healthy ≠ app healthy.

---

## Slide 20: The Signal Triangle {#slide-20}

*File: `S13_Signals.astro` · id: `s13-signals`*

### Speaker notes

Draw attention to the triangle. Three corners are the classic observability trio — Logs (WHY), Metrics (WHEN), Traces (WHERE). The center is Kubernetes Events (WHAT) — always start here in a cluster incident. Ask: which corner answers the question you have right now?

### Content

- Start in the center for cluster incidents —
      then pick the corner that answers your next question.

---

## Slide 21: Symptom → Layer Map {#slide-21}

*File: `S13b_SymptomLayerMap.astro` · id: `s13b-symptom-layer-map`*

### Speaker notes

Orientation table. First classify, then open the matching decision tree or layer chapter.

### Table

| Symptom | Likely layer | First check |
| --- | --- | --- |
| Pending | Scheduling / PVC / image / init | describe → FailedScheduling Events |
| Running + Ready=False | Probes / startup / app health | describe Conditions + probe lines |
| Service up, no traffic | Selectors / Ready / EndpointSlice | get endpointslices |
| NXDOMAIN / lookup fail | DNS / CoreDNS / NetPol :53 | nslookup from debug pod |
| OOMKilled | Limits / leak / burst | describe Last State + top / metrics |
| CrashLoopBackOff | Container / config / probe | logs --previous + exit code |

> **FRAMEWORK:** Classify first. Commands second.

---

## Slide 22: First Triage: Pod, Service, DNS, or App? {#slide-22}

*File: `S13c_FirstTriage.astro` · id: `s13c-first-triage`*

### Speaker notes

The first troubleshooting task is classification. Wrong class = wasted hour in the wrong logs.

> **TIP:** Also ask: scheduling? storage? Many pods vs one pod? Blast radius picks the pyramid level.

---

# Investigation

## Slide 23: Layer-by-Layer Investigation {#slide-23}

*File: `S14_ChapterLayers.astro` · id: `s14-chapter-layers` · variant: chapter*

### Speaker notes

Bridge from models into practice. Goal: map a symptom to a layer before diving into logs.

### Content

- Layer-by-Layer
Investigation

---

# Layers

## Slide 24: Infrastructure Layer {#slide-24}

*File: `S15_LayerInfra.astro` · id: `s15-layer-infra`*

### Speaker notes

Start here when symptoms are cluster-wide or external: DNS, LB, AZ outages. kubectl working does not prove infra is healthy — it only proves one path to the API server works. Commands and decision hints on the next slide.

### Content

- Purpose

      
        Physical and cloud foundation — compute, networking, storage, DNS, load balancers, and regional availability.
      

    

    
      Typical failures

      
        - • AZ or region outage

        - • Disk full on worker nodes

        - • Network partition between sites

        - • Load balancer or TLS misconfiguration

      
    

    
      Observable symptoms

      
        - • All nodes NotReady; external users down

        - • Mass evictions and ImagePull failures

        - • Flaky API access, etcd timeouts

---

## Slide 25: Infrastructure Layer — Commands {#slide-25}

*File: `S15b_LayerInfraCommands.astro` · id: `s15b-layer-infra-commands`*

### Speaker notes

External path first: dig and curl prove what users see. Node health cluster-wide before pod logs. Myth: one working kubectl path hides broken worker networking or load balancers.

### Commands

```bash
# External path
dig +short api.example.com
curl -vI https://app.example.com

# Cluster-wide node health
kubectl get nodes -o wide
kubectl get events -A --field-selector type=Warning | tail -20
```

> **MYTH:** If kubectl works, infrastructure is fine. One working admin path hides broken worker networking, DNS, or load balancers.

### Content

- Typical commands

      
    

    
      If kubectl works, infrastructure is fine. One working admin path hides broken worker networking, DNS, or load balancers.
    

    
      Decision hint
      Cluster-wide + external impact → verify region, DNS, and LB before diving into pod logs.

---

## Slide 26: Cluster Layer {#slide-26}

*File: `S16_LayerCluster.astro` · id: `s16-layer-cluster`*

### Speaker notes

Wrong context is the silent killer. Confirm cluster name, cloud account, and environment before comparing with docs or teammates. Cluster addons (CNI, CSI, metrics) define behavior differences. Commands on next slide.

### Table

| Failure | Symptom |
| --- | --- |
| Wrong kubeconfig context | Changes land in prod; staging looks broken |
| Expired cluster certs | Unable to connect, TLS handshake errors |
| CNI / CSI misconfig | Network or storage broken everywhere |

### Content

- Purpose

      
        The Kubernetes cluster as a whole — version skew, addons, CNI/CSI plugins, quotas, and cluster-scoped configuration.
      

    

    
      Typical failures

      
        - • Wrong kubeconfig context

        - • Expired cluster certificates

        - • CNI or CSI misconfiguration

        - • Critical addon crash loop

      
    

    
      Observable symptoms

      
        - • Changes land in prod; staging looks broken

        - • TLS handshake errors on kubectl

        - • DNS, ingress, or metrics missing cluster-wide

---

## Slide 27: Cluster Layer — Commands {#slide-27}

*File: `S16b_LayerClusterCommands.astro` · id: `s16b-layer-cluster-commands`*

### Speaker notes

Which cluster am I in? Always confirm context before debugging. Myth: every cluster behaves the same — CNI, admission webhooks, and managed vs self-hosted change what normal looks like.

### Commands

```bash
kubectl config current-context
kubectl cluster-info
kubectl version --short
kubectl get ns
kubectl get pods -n kube-system
```

> **MYTH:** Every cluster behaves the same. Managed vs self-hosted, CNI choice, and admission webhooks change what "normal" looks like.

### Content

- Typical commands

      
    

    
      Every cluster behaves the same. Managed vs self-hosted, CNI choice, and admission webhooks change what "normal" looks like.
    

    
      Decision hint
      Confirm context and cluster-info first — especially when "it works in the other env."

---

## Slide 28: Control Plane {#slide-28}

*File: `S17_LayerControlPlane.astro` · id: `s17-layer-control-plane`*

### Speaker notes

API server, etcd, scheduler, controller-manager. Cluster-wide create/update failures, mass Pending, or stale object status often trace here. On managed clusters you escalate — but you still need to recognize the pattern. Commands on next slide.

### Content

- Purpose

      
        Brain of the cluster: API server (front door), etcd (source of truth), scheduler (placement), controller-manager (reconciliation loops).
      

    

    
      Typical failures

      
        - • etcd full or slow

        - • API server overload

        - • Scheduler unavailable

        - • Controller manager stuck

      
    

    
      Observable symptoms

      
        - • Timeouts and flaky writes across namespaces

        - • HTTP 429/503, watch disconnects

        - • Everything Pending; stale replicas or missing endpoints

---

## Slide 29: Control Plane — Commands {#slide-29}

*File: `S17b_LayerControlPlaneCommands.astro` · id: `s17b-layer-control-plane-commands`*

### Speaker notes

Health endpoints on API server. Self-managed: check static pods on control plane nodes. Myth: managed K8s means control plane is never the problem — you can't fix it but mis-attributing wastes hours.

### Commands

```bash
kubectl get --raw='/readyz?verbose'
kubectl get --raw='/healthz'

# Self-managed: static pods on control plane nodes
kubectl get pods -n kube-system \\
  -l 'component in (kube-apiserver,etcd,kube-scheduler,kube-controller-manager)'
```

> **MYTH:** Managed Kubernetes means the control plane is never the problem. You cannot fix it — but mis-attributing cluster-wide API slowness to "a bad pod" wastes hours.

### Content

- Typical commands

      
    

    
      Managed Kubernetes means the control plane is never the problem. You cannot fix it — but mis-attributing cluster-wide API slowness to "a bad pod" wastes hours.
    

    
      Decision hint
      API errors + many namespaces affected → look up before describe pod.

---

## Slide 30: Nodes {#slide-30}

*File: `S18_LayerNodes.astro` · id: `s18-layer-nodes`*

### Speaker notes

kubelet + container runtime on each worker. NodeNotReady and pressure conditions explain evictions and single-node pod failures. NotReady ≠ dead — often CNI or kubelet restart. Commands on next slide.

### Table

| Condition | What you see |
| --- | --- |
| NodeNotReady | Pods on node stuck Terminating / Unknown |
| DiskPressure | Evictions, emptyDir fills, image pull fails |
| MemoryPressure | OOM evictions, best-effort pods killed first |

### Content

- Purpose

      
        Worker capacity and health — kubelet reports node status; container runtime (containerd/CRI-O) runs pods locally.
      

    

    
      Typical failures

      
        - • Kubelet or CNI agent down

        - • DiskPressure on node

        - • MemoryPressure on node

        - • PIDPressure on node

      
    

    
      Observable symptoms

      
        - • Pods on one node stuck Terminating or Unknown

        - • Evictions, emptyDir fills, image pull fails

        - • Cannot start new containers on that node

---

## Slide 31: Nodes — Commands {#slide-31}

*File: `S18b_LayerNodesCommands.astro` · id: `s18b-layer-nodes-commands`*

### Speaker notes

Node-first triage: get nodes, describe node for conditions and events, list pods on that node. SSH to kubelet journal if allowed. Myth: NodeNotReady always means dead — often kubelet, CNI, or disk pressure.

### Commands

```bash
kubectl get nodes
kubectl describe node <node>   # Conditions, allocatable, events
kubectl get pods -A -o wide --field-selector spec.nodeName=<node>

# On the node (if SSH allowed)
sudo journalctl -u kubelet -n 80 --no-pager
```

> **MYTH:** NodeNotReady always means the node is dead. Often kubelet, CNI agent, or disk pressure — the VM still pings.

### Content

- Typical commands

      
    

    
      NodeNotReady always means the node is dead. Often kubelet, CNI agent, or disk pressure — the VM still pings.
    

    
      Decision hint
      Symptoms on one node only → describe node before describe pod.

---

## Slide 32: Scheduling {#slide-32}

*File: `S19_LayerScheduling.astro` · id: `s19-layer-scheduling`*

### Speaker notes

Pending with FailedScheduling is the scheduler speaking. Read the message literally: insufficient cpu, untolerated taint, node affinity, pod anti-affinity, volume topology. Fix the constraint, not the symptom. Commands on next slide.

### Table

| Failure | Scheduler message |
| --- | --- |
| Insufficient CPU/memory | 0/X nodes available: insufficient cpu |
| Taint mismatch | untolerated taint {key: value} |
| Affinity too strict | didn't match node selector / affinity |

### Content

- Purpose

      
        Match pods to nodes — resource requests/limits, taints & tolerations, affinity/anti-affinity, topology, priority, and quotas.
      

    

    
      Typical failures

      
        - • Insufficient CPU or memory on all nodes

        - • Taint without matching toleration

        - • Affinity or node selector too strict

        - • Volume topology constraint unmet

      
    

    
      Observable symptoms

      
        - • Pod phase Pending indefinitely

        - • FailedScheduling events with explicit reason

        - • Scheduler message names the blocking constraint

---

## Slide 33: Scheduling — Commands {#slide-33}

*File: `S19b_LayerSchedulingCommands.astro` · id: `s19b-layer-scheduling-commands`*

### Speaker notes

describe pod Events for FailedScheduling. Check node taints and top nodes if metrics-server installed. Myth: Pending always means not enough CPU — taints, affinity, PVC binding, and ResourceQuota block without touching CPU graphs.

### Commands

```bash
kubectl describe pod <pod> -n <ns>   # Events: FailedScheduling
kubectl get events -n <ns> --field-selector involvedObject.name=<pod>
kubectl describe nodes | grep -A5 Taints
kubectl top nodes   # if metrics-server installed
```

> **MYTH:** Pending always means not enough CPU. Taints, affinity, PVC binding, and ResourceQuota block scheduling without touching CPU graphs.

### Content

- Typical commands

      
    

    
      Pending always means not enough CPU. Taints, affinity, PVC binding, and ResourceQuota block scheduling without touching CPU graphs.
    

    
      Decision hint
      Copy the FailedScheduling reason — it usually names the fix.

---

## Slide 34: Requests, Limits, Quotas & LimitRanges {#slide-34}

*File: `S19c_RequestsLimitsQuotas.astro` · id: `s19c-requests-limits-quotas`*

### Speaker notes

Scheduling vs runtime. Requests place the pod; limits kill/throttle it; quotas/LimitRanges reshape or block admission.

### Table

| Knob | Affects | Typical symptom |
| --- | --- | --- |
| requests | Scheduling (fit on nodes) | Pending / FailedScheduling |
| limits | Runtime cgroup enforce | OOMKilled, CPU throttle |
| ResourceQuota | Namespace totals | Forbidden create / stuck scale |
| LimitRange | Defaults & min/max per pod | Surprise defaults, admission deny |

> **TIP:** Pending ≠ OOM. Pending is often requests/fit; OOM is limits at runtime. Check both before changing one.

---

## Slide 35: Deployments & ReplicaSets {#slide-35}

*File: `S20_LayerWorkloads.astro` · id: `s20-layer-workloads`*

### Speaker notes

Deployment owns ReplicaSets; each rollout creates a new RS. READY vs AVAILABLE differ during surge. Stuck rollouts: maxUnavailable, progressDeadline, failing readiness on new pods, or selector label typos. Commands on next slide.

### Content

- Purpose

      
        Declarative workload management — desired replicas, rolling updates, surge/unavailable budgets, and revision history.
      

    

    
      Typical failures

      
        - • maxSurge / maxUnavailable block progress

        - • New pods fail readiness → rollout stalls

        - • Label selector mismatch → RS creates zero pods

        - • Old RS not scaled down → mixed versions serving traffic

      
    

    
      Observable symptoms

      
        - • Rollout status stuck or progress deadline exceeded

        - • AVAILABLE replicas lag behind READY during surge

        - • Multiple ReplicaSet generations with active pods

---

## Slide 36: Deployments & ReplicaSets — Commands {#slide-36}

*File: `S20b_LayerWorkloadsCommands.astro` · id: `s20b-layer-workloads-commands`*

### Speaker notes

Rollout forensics: status, describe deploy, list RS by creation time, inspect status JSON. Myth: 3/3 means success — old pods may still serve traffic; AVAILABLE can lag READY.

### Commands

```bash
kubectl rollout status deploy/<name> -n <ns>
kubectl describe deploy/<name> -n <ns>
kubectl get rs -n <ns> -l app=<label> --sort-by=.metadata.creationTimestamp
kubectl get deploy/<name> -o jsonpath='{.status}' | jq
```

> **MYTH:** Deployment shows 3/3 so the rollout succeeded. Old pods may still serve traffic; AVAILABLE can lag READY during surge.

### Content

- Typical commands

      
    

    
      Deployment shows 3/3 so the rollout succeeded. Old pods may still serve traffic; AVAILABLE can lag READY during surge.
    

    
      Decision hint
      Compare RS generations — the newest RS tells you what the deploy is trying to run.

---

## Slide 37: Pods {#slide-37}

*File: `S21_LayerPods.astro` · id: `s21-layer-pods`*

### Speaker notes

Phase is coarse; conditions (PodScheduled, Initialized, Ready, ContainersReady) are precise. Running ≠ Ready. Init containers run before app containers. restartPolicy affects failure behavior. Commands on next slide.

### Table

| Phase / condition | Observable symptom |
| --- | --- |
| Pending | Not yet scheduled or volumes not mounted |
| Init:0/1 | Init container blocking app start |
| Running + Ready=False | Probes failing, not receiving traffic |

### Content

- Purpose

      
        Smallest schedulable unit — one or more containers sharing network, storage, and lifecycle context.
      

    

    
      Typical failures

      
        - • Not yet scheduled or volumes not mounted

        - • Init container blocking app start

        - • Probes failing while phase is Running

        - • Finalizers or volume detach delaying termination

      
    

    
      Observable symptoms

      
        - • Phase Pending or Init:0/1 in status

        - • Running with Ready=False — no traffic

        - • Terminating for longer than grace period

---

## Slide 38: Pods — Commands {#slide-38}

*File: `S21b_LayerPodsCommands.astro` · id: `s21b-layer-pods-commands`*

### Speaker notes

Pod state deep dive: get wide, describe for events, jsonpath for phase and conditions. Myth: Running means healthy — can be Running with failing probes or CrashLoopBackOff.

### Commands

```bash
kubectl get pod <pod> -n <ns> -o wide
kubectl describe pod <pod> -n <ns>
kubectl get pod <pod> -n <ns> -o jsonpath='{.status.phase}{"\
"}{range .status.conditions[*]}{.type}={.status}{"\
"}{end}'
```

> **MYTH:** Running means healthy. A pod can be Running with failing probes, partial init success, or containers in CrashLoopBackOff.

### Content

- Typical commands

      
    

    
      Running means healthy. A pod can be Running with failing probes, partial init success, or containers in CrashLoopBackOff.
    

    
      Decision hint
      Trust conditions over the STATUS column — Ready=False is your early warning.

---

## Slide 39: Pod Status: Phase ≠ Conditions ≠ Containers {#slide-39}

*File: `S21c_PodStatusBasics.astro` · id: `s21c-pod-status-basics`*

### Speaker notes

STATUS column is a hint. Phase is coarse. Conditions and container statuses carry the diagnosis.

### Table

| Field | What it tells you | Limitation |
| --- | --- | --- |
| Phase (Pending/Running/…) | Coarse lifecycle bucket | Running can still be broken |
| Conditions (Ready, …) | Boolean gates for traffic / schedule | Need Message/Reason for why |
| Container statuses | Restarts, exit code, OOM, waiting | Per-container — check each |
| Reason / Message | Human-readable failure text | Can be truncated — still gold |

> **RULE:** Trust Conditions + container status + Events over the STATUS column alone.

---

## Slide 40: Containers {#slide-40}

*File: `S22_LayerContainers.astro` · id: `s22-layer-containers`*

### Speaker notes

Each container has its own exit code, OOM state, and probe results. CrashLoopBackOff is kubelet backoff, not the root cause. Always check previous container logs and Last State in describe. Commands on next slide.

### Table

| Signal | Likely cause |
| --- | --- |
| Exit 137 + Reason OOMKilled | Memory limit too low or leak |
| Exit 1 / Error | App crash, bad config, missing dependency |
| Liveness restart loop | Probe too aggressive or slow startup |

### Content

- Purpose

      
        Individual runtime units inside a pod — image, command, env, probes, resource limits, and exit behavior.
      

    

    
      Typical failures

      
        - • OOMKilled (Reason) — exit 137 is SIGKILL, verify Reason

        - • Application crash (exit 1)

        - • Liveness probe restart loop

        - • Readiness probe failures

      
    

    
      Observable symptoms

      
        - • Restart count climbing; CrashLoopBackOff

        - • Empty current logs after crash

        - • Ready=False; traffic withheld

---

## Slide 41: Containers — Commands {#slide-41}

*File: `S22b_LayerContainersCommands.astro` · id: `s22b-layer-containers-commands`*

### Speaker notes

Container forensics: logs --previous, describe Last State, exec or kubectl debug. Myth: empty logs mean nothing — use --previous and describe Last State.

### Commands

```bash
kubectl logs <pod> -n <ns> -c <container> --previous
kubectl describe pod <pod> -n <ns>   # Last State, Restart Count
kubectl exec -it <pod> -n <ns> -c <container> -- sh
kubectl debug -it <pod> -n <ns> --image=busybox --target=<container>
```

> **MYTH:** Empty logs mean nothing happened. The crashing instance may be gone — use --previous and describe Last State.

### Content

- Typical commands

      
    

    
      Empty logs mean nothing happened. The crashing instance may be gone — use --previous and describe Last State.
    

    
      Decision hint
      Restart count rising → previous logs + exit reason before changing the Deployment.

---

## Slide 42: Storage {#slide-42}

*File: `S23_LayerStorage.astro` · id: `s23-layer-storage`*

### Speaker notes

PVC Bound only means a PV is claimed — mount happens at pod start. FailedMount, MultiAttachError, and permission errors show in pod events. CSI driver logs matter for dynamic provisioning. Commands on next slide.

### Table

| Failure | Symptom |
| --- | --- |
| PVC Pending | No matching PV / StorageClass / quota |
| FailedMount | ContainerCreating forever, mount path wrong |
| MultiAttachError | RWO still attached on another node after reschedule |

### Content

- Purpose

      
        Persistent data via PV/PVC and CSI drivers — attach, mount, filesystem permissions, and access modes (RWO, RWX).
      

    

    
      Typical failures

      
        - • PVC stuck Pending

        - • FailedMount at pod start

        - • MultiAttachError (RWO still on another node)

        - • fsGroup or permission mismatch

      
    

    
      Observable symptoms

      
        - • ContainerCreating forever

        - • App starts but cannot write to volume

        - • Pod events name attach or mount failure

---

## Slide 43: Storage — Commands {#slide-43}

*File: `S23b_LayerStorageCommands.astro` · id: `s23b-layer-storage-commands`*

### Speaker notes

Volume triage: pvc/pv, describe pvc, describe pod mount events, storageclass, volumeattachments. Myth: PVC Bound means volume works — binding ≠ mounted.

### Commands

```bash
kubectl get pvc,pv -n <ns>
kubectl describe pvc <claim> -n <ns>
kubectl describe pod <pod> -n <ns>   # Mount events
kubectl get storageclass
kubectl get volumeattachments   # if CRD exists
```

> **MYTH:** PVC Bound means the volume works. Binding ≠ mounted. Mount failures and permission errors appear only in pod events.

### Content

- Typical commands

      
    

    
      PVC Bound means the volume works. Binding ≠ mounted. Mount failures and permission errors appear only in pod events.
    

    
      Decision hint
      ContainerCreating + volume → describe pod events, not just PVC status.

---

## Slide 44: Networking {#slide-44}

*File: `S24_LayerNetworking.astro` · id: `s24-layer-networking`*

### Speaker notes

Trace the path: DNS name → Service → EndpointSlice → kube-proxy/CNI → Pod IP → NetworkPolicy. Connection refused vs timeout vs NXDOMAIN each point to different layers.

### Content

- Purpose

      
        Pod-to-pod connectivity, cluster DNS, Services, Ingress/Gateway API, CNI dataplane, and NetworkPolicy enforcement.
      

    

    
      Typical failures

      
        - • No Ready addresses — selector mismatch or pods not Ready

        - • NXDOMAIN — wrong Service name or namespace

        - • Timeout — NetworkPolicy drop or routing black hole

        - • 502 at ingress — backend port or name mismatch

      
    

    
      Observable symptoms

      
        - • Connection refused vs timeout vs NXDOMAIN

        - • Empty / not-ready EndpointSlice for a Service

        - • Works in-cluster but fails via Ingress

---

## Slide 45: Networking — Commands {#slide-45}

*File: `S24b_LayerNetworkingCommands.astro` · id: `s24b-layer-networking-commands`*

### Speaker notes

Prefer EndpointSlice for Service backends. Without Ready addresses the Service is an empty shell.

### Commands

```bash
kubectl get svc,endpointslices -n <ns>
kubectl run dbg --rm -it --image=nicolaka/netshoot -- bash
# inside: nslookup my-svc.my-ns.svc.cluster.local
# inside: curl -v http://my-svc:8080/health
kubectl describe netpol -n <ns>
kubectl get ingress,gateway -A
```

> **MYTH:** A Service exists so traffic flows. Without Ready addresses in EndpointSlice and matching selectors, the Service is an empty shell.

### Content

- Typical commands

      
    

    
      A Service exists so traffic flows. Without Ready addresses in EndpointSlice and matching selectors, the Service is an empty shell.
    

    
      Decision hint
      Walk outside-in: DNS → EndpointSlice → policy → route.

---

## Slide 46: Application & Business Logic {#slide-46}

*File: `S25_LayerApp.astro` · id: `s25-layer-app`*

### Speaker notes

Top of the stack. Platform can be perfect while the app returns 200 with errors in JSON, wrong tenant data, or silent partial failure. Reproduce from inside the cluster to remove DNS/LB variables. Commands on next slide.

### Table

| Pattern | What users see |
| --- | --- |
| App bug | Correct HTTP code, wrong business outcome |
| 200 that lies | 200 OK but error payload / empty data |
| Config drift | Works in staging, fails in prod secret/key |

### Content

- Purpose

      
        Business rules, application code, dependencies, and config — everything above a healthy pod and network path.
      

    

    
      Typical failures

      
        - • Application bug with correct HTTP status

        - • 200 OK with error payload or empty data

        - • Config drift between environments

        - • Upstream dependency timeout (DB, queue, SaaS)

      
    

    
      Observable symptoms

      
        - • Users see wrong business outcome despite green pods

        - • Works in staging, fails in prod with same image

        - • In-cluster curl fails while pod phase is Running

---

## Slide 47: Application & Business Logic — Commands {#slide-47}

*File: `S25b_LayerAppCommands.astro` · id: `s25b-layer-app-commands`*

### Speaker notes

Separate platform from app: exec curl localhost, logs, port-forward and inspect response body with jq. Myth: platform fine because pod Running — process started ≠ business logic works.

### Commands

```bash
kubectl exec -it deploy/<app> -n <ns> -- curl -s localhost:8080/health
kubectl logs deploy/<app> -n <ns> --since=10m
kubectl port-forward svc/<app> 8080:80 -n <ns>
curl -s localhost:8080/api/orders | jq .   # inspect body, not just status
```

> **MYTH:** The platform is fine because the pod is Running. Running only means the process started — not that business logic or integrations work.

### Content

- Typical commands

      
    

    
      The platform is fine because the pod is Running. Running only means the process started — not that business logic or integrations work.
    

    
      Decision hint
      In-cluster curl + response body — if that fails, it is not "just Ingress."

---

# Decision Trees

## Slide 48: Decision Trees {#slide-48}

*File: `S26_DecisionTreesIntro.astro` · id: `s26-decision-trees-intro` · variant: chapter*

### Speaker notes

Muscle memory for the first question. Drill Pending, CrashLoop, 503 until the branch is automatic.

---

## Slide 49: Pod Pending — First Branch {#slide-49}

*File: `S27_TreePending.astro` · id: `s27-tree-pending`*

### Speaker notes

Start with PodScheduled. If false, read FailedScheduling events. If true, look at init / mounts / image.

> **TIP:** First move: kubectl describe pod — Events pick your branch.

---

## Slide 50: Pending but Scheduled {#slide-50}

*File: `S27b_TreePendingScheduled.astro` · id: `s27b-tree-pending-scheduled`*

### Speaker notes

Once PodScheduled=True, look at init, image pull, mounts, runtime/config. Quota, PriorityClass, and admission webhooks usually fail at create time — not as the explanation for an already-scheduled Pending pod.

> **TIP:** Admission, ResourceQuota, and LimitRange typically reject at API create — before PodScheduled=True.

---

## Slide 51: CrashLoopBackOff — First Moves {#slide-51}

*File: `S28_TreeCrashLoop.astro` · id: `s28-tree-crashloop`*

### Speaker notes

CrashLoop is backoff, not diagnosis. Always inspect Restart Count + Last State before logs.

> **TIP:** Exit 137 means SIGKILL — often OOM, but verify Reason: OOMKilled. Otherwise check exit code and logs --previous.

---

## Slide 52: CrashLoop — Exit Code Path {#slide-52}

*File: `S28b_TreeCrashLoopExit.astro` · id: `s28b-tree-crashloop-exit`*

### Speaker notes

Exit 0 with restarts often means liveness killing a healthy process. Exit 1 → app/config. Empty logs → --previous.

---

## Slide 53: HTTP 503 — First Branch {#slide-53}

*File: `S29_Tree503.astro` · id: `s29-tree-503`*

### Speaker notes

503 with Running pods is usually no Ready addresses in EndpointSlice — not 'Kubernetes is down'.

> **RULE:** Running ≠ in EndpointSlice. Only Ready pods receive Service traffic.

---

## Slide 54: 503 — Outside-In Path {#slide-54}

*File: `S29b_Tree503Path.astro` · id: `s29b-tree-503-path`*

### Speaker notes

If EndpointSlice Ready addresses look good, walk outside-in: client → LB → Ingress/Gateway → Service → Pod.

---

## Slide 55: Checkpoint — Decision Trees {#slide-55}

*File: `S29c_CheckpointTrees.astro` · id: `s29c-checkpoint-trees`*

### Speaker notes

Have the learner answer before revealing. Three questions cover the three trees.

---

# Failure Patterns

## Slide 56: Failure Pattern Catalog {#slide-56}

*File: `S30_FailuresCatalog.astro` · id: `s30-failures-catalog` · variant: chapter*

### Speaker notes

Reference map of patterns. Use after triage to pick the deep-dive slide.

### Content

- Failure Patterns

---

## Slide 57: Catalog — Pod & Resources {#slide-57}

*File: `S30b_FailuresPod.astro` · id: `s30b-failures-pod`*

### Speaker notes

Walk six rows slowly. Emphasize first command is Observe, not Fix.

### Table

| Pattern | First Signal | First Command |
| --- | --- | --- |
| CrashLoopBackOff | RESTARTS ↑, Last State Terminated | logs --previous |
| ImagePullBackOff | Failed to pull image | describe pod → Events |
| CreateContainerConfigError | secret / configmap missing | describe pod |
| OOMKilled / Evicted | Reason: OOMKilled or Evicted | describe + top |
| Pending / FailedScheduling | 0/N nodes available | describe → Events |
| FailedMount / MultiAttach | Unable to attach / mount | describe + get pvc |

> **RULE:** Status says where. Events say why.

---

## Slide 58: Catalog — Probes & Network {#slide-58}

*File: `S30c_FailuresNet.astro` · id: `s30c-failures-net`*

### Speaker notes

Network rows often look like app bugs. First command isolates the layer.

### Table

| Pattern | First Signal | First Command |
| --- | --- | --- |
| Probe failures | Unhealthy / 0/N Ready | describe → probe lines |
| DNS failure | NXDOMAIN / timeout *.svc | nslookup from debug pod |
| No Ready backends | EndpointSlice empty / not ready | get endpointslices -o wide |
| Ingress / Gateway / TLS | 502/503 or cert expired | describe ingress + cert check |
| NetworkPolicy block | timeout (works without NP) | get networkpolicy |

---

## Slide 59: CrashLoopBackOff {#slide-59}

*File: `S31_CrashLoop.astro` · id: `s31-crashloop`*

### Speaker notes

CrashLoopBackOff is the most common pod status and the most misdiagnosed. BackOff is kubelet throttling restarts — the container IS starting and dying. Root cause is almost never Kubernetes itself. Walk lifecycle: get → describe → logs --previous → fix → rollout status. Exit 137 = SIGKILL (often OOM — confirm Last State.Reason OOMKilled). Exit 1 = app error; 126/127 = cmd missing. Myth: restarting pod rarely fixes CrashLoop.

> **RULE:** Always check --previous first. Current container may have no logs yet.

### Content

- CrashLoopBackOff
      Error
      RESTARTS > 0

---

## Slide 60: ImagePullBackOff — No Container Starts {#slide-60}

*File: `S32_ImagePull.astro` · id: `s32-imagepull`*

### Speaker notes

Image pull failures block pod creation — no container starts, logs empty. ErrImagePull immediate; ImagePullBackOff is retry with backoff. Decision tree: typo vs auth vs registry down vs rate limit. Events in describe are explicit. imagePullSecrets on SA OR pod — common miss across namespaces. Next slide: event matrix and commands.

> **MYTH:** Deleting the pod repeatedly without fixing the image — you'll stay in BackOff forever.

### Content

- ImagePullBackOff
      ErrImagePull
      ContainerCreating stuck

---

## Slide 61: ImagePull — Event Matrix & Commands {#slide-61}

*File: `S32b_ImagePullCauses.astro` · id: `s32b-imagepull-causes`*

### Speaker notes

Walk matrix: manifest unknown=wrong tag, pull access denied=secret, authorization failed=expired token/ECR/GCR, rate limit, i/o timeout=network. Verify SA imagePullSecrets, secret type dockerconfigjson. crane manifest locally. ImagePullPolicy IfNotPresent won't re-pull cached bad layer.

### Table

| Event message | Likely cause | Fix |
| --- | --- | --- |
| manifest unknown | Wrong tag or deleted image | Verify tag in registry |
| pull access denied | Missing imagePullSecret | Check SA secrets + RBAC |
| authorization failed | Expired registry token | Refresh creds, IRSA/WI |
| rate limit exceeded | Registry throttle | Mirror, cache, authenticate |
| i/o timeout | Network to registry | Egress, proxy, DNS |

### Commands

```bash
kubectl describe pod POD -n NAMESPACE
kubectl get sa default -n NAMESPACE -o yaml
kubectl get secret -n NAMESPACE | grep docker
crane manifest REGISTRY/ORG/IMAGE:TAG
```

---

## Slide 62: CreateContainerConfigError vs CreateContainerError {#slide-62}

*File: `S33_ConfigErrors.astro` · id: `s33-config-errors`*

### Speaker notes

Kubelet cannot create container — config invalid or dependencies missing. ConfigError: secret/configmap/volume ref doesn't exist. CreateError: runtime rejected spec — mount, securityContext, bad command. Event message names the missing object — verify in that namespace. Myth: ConfigError is not bad image — pull succeeded. Next slide: error matrix and commands.

> **RULE:** The Event names the missing object — verify it exists in that namespace.

> **MYTH:** "CreateContainerConfigError means the image is bad." — Pull succeeded; config reference failed.

### Content

- CreateContainerConfigError
      CreateContainerError
      ContainerCreating

---

## Slide 63: Config Errors — Matrix & Commands {#slide-63}

*File: `S33b_ConfigErrorsDebug.astro` · id: `s33b-config-errors-debug`*

### Speaker notes

Matrix walk: secret not found, configmap not found, key missing, subPath missing, permission denied. Trace pod yaml envFrom/volumes against get secret/configmap. subPath file must exist in configmap. Compare with known-good pod.

### Table

| Error snippet | Root cause | Check |
| --- | --- | --- |
| secret "foo" not found | Secret deleted or wrong ns | get secret -n NS |
| configmap "bar" not found | CM missing or typo | get cm + pod yaml envFrom |
| couldn't find key X in Secret | Key renamed | get secret -o yaml |
| failed to prepare subPath | subPath missing in volume | get cm -o yaml keys |
| permission denied on mount | fsGroup / securityContext | compare SA + pod security |

### Commands

```bash
kubectl describe pod POD -n NAMESPACE
kubectl get pod POD -o yaml | grep -A20 'envFrom\\|volumes\\|volumeMounts'
kubectl get secret,configmap -n NAMESPACE
kubectl get secret SEC -o jsonpath='{.data}' | jq 'keys'
```

---

## Slide 64: OOMKilled — Container Memory Limit {#slide-64}

*File: `S34_OOMEvicted.astro` · id: `s34-oom-killed`*

### Speaker notes

OOMKilled is per-container. Proof is Last State.Reason: OOMKilled — Exit 137 alone only means SIGKILL. Compare Limits vs Requests. CPU throttle ≠ OOM. Evicted is node pressure, not container OOM.

> **RULE:** Exit 137 often indicates OOM — verify Reason: OOMKilled. Different from Evicted (node housekeeping).

### Content

- Reason: OOMKilled
      Exit 137 = SIGKILL

---

## Slide 65: Evicted & Node Resource Pressure {#slide-65}

*File: `S34b_EvictedPressure.astro` · id: `s34b-evicted-pressure`*

### Speaker notes

Evicted: kubelet removed pod due to node pressure — memory, disk, inodes, or PID limits. Pod is gone — check events on the node and sibling pods. Walk describe node Conditions: MemoryPressure, DiskPressure, PIDPressure. Disk pressure: emptyDir + logs, image layers, container logs filling node. PID pressure: fork bombs or too many threads. Fix: expand node disk, tune eviction thresholds, reduce pod count, add requests/limits. LimitRange and ResourceQuota can block scheduling fixes. VPA as prevention hint.

### Table

| Pressure | Typical cause | First command |
| --- | --- | --- |
| MemoryPressure | Node RAM exhausted | top pod -A --sort-by=memory |
| DiskPressure | Logs, images, emptyDir | describe node + check disk on node |
| PIDPressure | Too many processes | pod count + describe node |

### Commands

```bash
kubectl describe node NODE | grep -A6 Conditions
kubectl get pods -A --field-selector spec.nodeName=NODE -o wide
kubectl top pod -A --sort-by=memory | head
```

> **TIP:** BestEffort pods (no requests/limits) are evicted first under MemoryPressure.

### Content

- Evicted
      MemoryPressure
      DiskPressure
      PIDPressure

---

## Slide 66: Pending — Nothing Scheduled Yet {#slide-66}

*File: `S35_PendingFailSched.astro` · id: `s35-pending-failsched`*

### Speaker notes

Pending means no node accepted the pod — scheduler or admission blocking. FailedScheduling Events list exact reasons. 0/N nodes breakdown — each reason is a filter pass. PVC Pending blocks pod with WaitForFirstConsumer. Don't confuse with ContainerCreating — that's post-schedule. Next slide: reason matrix and commands.

> **DECISION:** Resource in Events? Compare pod requests to node Allocatable.
      Affinity/taints? Compare pod spec to describe node.

### Content

- Pending
      FailedScheduling
      0/N Ready

---

## Slide 67: FailedScheduling — Reasons & Commands {#slide-67}

*File: `S35b_PendingReasons.astro` · id: `s35b-pending-reasons`*

### Speaker notes

Matrix: insufficient cpu/memory, node affinity mismatch, taints without toleration, volume topology, max pods. get events --field-selector involvedObject.name=POD. describe nodes Allocatable vs requests. Preemption events for lower priority pods. Fix: reduce requests, add toleration, fix selector, scale cluster.

### Table

| Event reason | Meaning | Action |
| --- | --- | --- |
| Insufficient cpu/memory | Requests exceed allocatable | Reduce requests or add nodes |
| didn't match node affinity | nodeSelector/affinity too strict | Fix labels or relax affinity |
| didn't tolerate taint | Node tainted, no toleration | Add toleration or untaint |
| volume node affinity conflict | AZ/topology mismatch | Check PV node affinity |
| max pod limit | Node at maxPods | Spread workloads or raise limit |

### Commands

```bash
kubectl describe pod POD -n NAMESPACE
kubectl get events -n NAMESPACE \\
  --field-selector involvedObject.name=POD --sort-by='.lastTimestamp'
kubectl describe nodes | grep -A5 'Allocatable\\|Allocated'
kubectl get pvc -n NAMESPACE
```

---

## Slide 68: FailedMount — Kubelet Can't Mount Volume {#slide-68}

*File: `S36_MountMultiAttach.astro` · id: `s36-failed-mount`*

### Speaker notes

FailedMount: kubelet mount step failed — wrong fsType, missing secret for encrypted volume, path permissions, bind path issues. Long ContainerCreating often means mount retry loop. Teach attach vs mount: attach is control plane / CSI controller; mount is kubelet on the node. describe pod Events cite the exact error. Next slide covers MultiAttach and CSI failures.

> **RULE:** Read the Event message — it names the volume and the mount error. Fix spec, not the pod restart loop.

### Content

- FailedMount
      ContainerCreating

---

## Slide 69: MultiAttach, CSI & Volume Triage {#slide-69}

*File: `S36b_MultiAttachCSI.astro` · id: `s36b-multiattach-csi`*

### Speaker notes

RWO = read-write from a single node (multiple pods on that node may share it). MultiAttach happens when the volume is still attached to node A while a pod on node B needs it — common after reschedule, stuck Terminating, or multi-replica Deployments spanning nodes. Prefer ReadWriteOncePod when only one pod may attach.

### Table

| Event | Typical cause | Fix |
| --- | --- | --- |
| MultiAttach error for Volume | RWO still attached on another node | Wait detach · fix stuck pod · StatefulSet/RWX/RWOPod |
| CSI driver not found | Driver not on node | Check CSINode + daemonset |
| FailedAttachVolume | AZ mismatch, stale attachment | VolumeAttachment + cloud console |

### Commands

```bash
kubectl describe pod POD -n NAMESPACE
kubectl get pvc,pv -n NAMESPACE
kubectl get volumeattachment | grep VOLUME
kubectl get csidriver,csinode
```

> **RULE:** RWO = one node, not necessarily one pod. MultiAttach: volume still on the old node while a new node needs it.

### Content

- MultiAttach
      CSI driver
      RWO ≠ one pod

---

## Slide 70: Probes: Ready ≠ Alive {#slide-70}

*File: `S37_Probes.astro` · id: `s37-probes`*

### Speaker notes

Three boxes, three different kubelet actions. Readiness drains traffic; liveness restarts; startup protects slow boots.

> **MYTH:** “Not Ready means the pod is dead.” — It’s alive; Service just won’t send traffic.

---

## Slide 71: Probe Failures — Symptoms & Commands {#slide-71}

*File: `S37b_ProbeFailures.astro` · id: `s37b-probe-failures`*

### Speaker notes

Approximate failure window ≈ initialDelay + failureThreshold × periodSeconds; timeoutSeconds and kubelet scheduling also affect timing. Prefer EndpointSlice when checking traffic membership.

### Commands

```bash
kubectl describe pod POD -n NAMESPACE | grep -A5 -E 'Liveness|Readiness|Startup'
kubectl exec POD -n NAMESPACE -- curl -sf localhost:8080/healthz
kubectl get endpointslices -n NAMESPACE -l kubernetes.io/service-name=SVC -o wide
```

> **GOLDEN RULE:** Never swap readiness and liveness jobs — readiness drains traffic; liveness restarts.

### Content

- 

    

    
      Never swap readiness and liveness jobs — readiness drains traffic; liveness restarts.

---

## Slide 72: DNS Path Through the Cluster {#slide-72}

*File: `S38_NetDNS.astro` · id: `s38-net-dns`*

### Speaker notes

Walk the boxes: app → resolv.conf → kube-dns Service → CoreDNS → upstream for external names.

> **TIP:** One nslookup from a debug pod beats an hour of app logs.

### Content

- Name wrong or wrong namespace
- NP block or CoreDNS down
- Slow / flaky
- CoreDNS overload or ndots

---

## Slide 73: DNS — Diagnose Fast {#slide-73}

*File: `S38b_NetDNSCommands.astro` · id: `s38b-net-dns-commands`*

### Speaker notes

Show the matrix, then run through the commands verbally. Always compare short name vs FQDN.

### Table

| Result | Likely cause | Next step |
| --- | --- | --- |
| NXDOMAIN for *.svc | Wrong name / namespace | get svc + test FQDN |
| Timeout on :53 | NetworkPolicy / CoreDNS down | get endpointslices (kube-dns) |
| External names fail | forward / upstream broken | CoreDNS logs |
| Works only with FQDN | ndots / search path | cat /etc/resolv.conf |

### Commands

```bash
kubectl run -it --rm dnsdebug --image=busybox:1.36 --restart=Never -- \\
  nslookup my-svc.my-ns.svc.cluster.local

kubectl get svc -n kube-system -l k8s-app=kube-dns
kubectl get endpointslices -n kube-system -l kubernetes.io/service-name=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=50
```

---

## Slide 74: DNS Fast-Path — Four Checks {#slide-74}

*File: `S38c_DNSFastPath.astro` · id: `s38c-dns-fastpath`*

### Speaker notes

Concrete sequence for beginners. Stop when a step fails — that step is your layer.

### Commands

```bash
kubectl exec POD -n NS -- cat /etc/resolv.conf
kubectl run -it --rm dnsdebug --image=busybox:1.36 --restart=Never -- \\
  nslookup kubernetes.default.svc.cluster.local
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl get endpointslices -n kube-system -l kubernetes.io/service-name=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=50
```

---

## Slide 75: Service: Selectors & EndpointSlices {#slide-75}

*File: `S39_NetService.astro` · id: `s39-net-service`*

### Speaker notes

Walk left to right. Not Ready pods are excluded from Service traffic via EndpointSlice conditions — even if STATUS=Running.

> **RULE:** No Ready addresses in EndpointSlice = no traffic path. Fix labels and readiness before blaming CNI.

---

## Slide 76: Service — Diagnose Fast {#slide-76}

*File: `S39b_NetServiceCommands.astro` · id: `s39b-net-service-commands`*

### Speaker notes

10-second check: get svc, get endpointslices, get pods --show-labels. Prefer EndpointSlice (Endpoints is legacy). Selector mismatch: compare svc selector to pod labels.

### Table

| Symptom | Check | Common fix |
| --- | --- | --- |
| No Ready addresses | svc selector vs pod labels | Align labels |
| Refused on correct IP | targetPort ≠ containerPort | Fix Service targetPort |
| Works by IP not DNS | Resolution path | nslookup svc.ns.svc |
| Stale IPs briefly | Terminated pods in slice | Wait or check readiness flapping |

### Commands

```bash
kubectl get svc SVC -n NAMESPACE -o wide
kubectl get endpointslices -n NAMESPACE -l kubernetes.io/service-name=SVC -o wide
# Endpoints is legacy — still works, prefer slices
kubectl get pods -n NAMESPACE --show-labels

kubectl exec CLIENT -n NAMESPACE -- \\
  curl -sv http://SVC.NAMESPACE.svc.cluster.local:PORT/health
```

> **MYTH:** "Service is broken because kubectl get svc shows CLUSTER-IP." — Svc is virtual; Ready addresses in EndpointSlice are real.

---

## Slide 77: EndpointSlices — Backend Conditions {#slide-77}

*File: `S39c_EndpointSlices.astro` · id: `s39c-endpointslices`*

### Speaker notes

Prefer EndpointSlice over legacy Endpoints. Slices partition backends and expose ready/serving/terminating conditions — not just a flat ready list. kube-proxy uses slices for Service routing.

### Commands

```bash
kubectl get endpointslices -n NS -l kubernetes.io/service-name=SERVICE -o wide
# Inspect conditions: ready, serving, terminating
# Empty / not ready → selector mismatch or readiness probe
```

> **RULE:** Prefer EndpointSlice. Empty or not-ready addresses → fix labels/probes before blaming CNI.

### Content

- Endpoints (legacy)
- Older aggregate API — still works, prefer slices.
- EndpointSlice
- Scalable, partitioned backends with ready / serving / terminating conditions.

---

## Slide 78: Ingress vs Gateway API {#slide-78}

*File: `S40_NetIngressGateway.astro` · id: `s40-net-ingress-gateway`*

### Speaker notes

Edge architecture: client → LB → ingress/gateway controller → Service → pods. Split responsibility: Ingress/HTTPRoute is config; controller is data plane (nginx, traefik, istio). Gateway API adds GatewayClass, Gateway, HTTPRoute — check parentRefs and Accepted conditions. Common: wrong ingressClassName, host rule mismatch, path Type Prefix vs Exact. 502 often means empty endpoints upstream. Next slide: TLS and cert-manager.

> **EDGE DEBUG ORDER:** DNS → LB reachable → Ingress/Gateway rules → EndpointSlice → Pod logs

### Content

- Ingress
      Gateway API
      502 / 503

---

## Slide 79: TLS & cert-manager {#slide-79}

*File: `S40b_TLSCerts.astro` · id: `s40b-tls-certs`*

### Speaker notes

TLS failures: cert warnings, expired secret, cert-manager renewal failed. Check Certificate status, secret tls type. cert-manager challenges failing — DNS01 vs HTTP01. describe certificate for events. Test expiry with openssl s_client. Multiple ingress controllers — wrong ingressClassName routes nowhere.

### Table

| Symptom | Layer | Check |
| --- | --- | --- |
| Cert expired / warning | TLS secret outdated | get certificate + describe |
| 502 at edge | Backend | get endpointslices + readiness |
| 404 at edge | Routing rules | ingress spec vs Host header |
| Challenge pending | cert-manager | CertificateRequest events |

### Commands

```bash
kubectl describe ingress ING -n NAMESPACE
kubectl get certificate,secret -n NAMESPACE
kubectl describe certificate CERT -n NAMESPACE

openssl s_client -connect HOST:443 -servername HOST </dev/null 2>/dev/null | \\
  openssl x509 -noout -dates
```

> **TIP:** Gateway API: check Accepted=True on parent Gateway before debugging HTTPRoute.

### Content

- TLS
      cert-manager

---

## Slide 80: NetworkPolicy: Default-Deny Mental Model {#slide-80}

*File: `S41_NetPolicy.astro` · id: `s41-net-policy`*

### Speaker notes

Allow-all until a deny policy applies. Ingress deny ≠ egress deny — check policyTypes. Default-deny egress without DNS allow breaks name resolution for selected workloads — not automatically a whole-cluster outage.

> **INGRESS VS EGRESS:** Default-deny ingress blocks inbound; default-deny egress blocks outbound. Each needs its own allow rules.

> **DNS UNDER EGRESS DENY:** Default-deny egress without UDP/TCP 53 to CoreDNS breaks name resolution for selected workloads — not automatically cluster-wide.

### Content

- Silent drop
      policyTypes matter
- Default-deny ingress blocks inbound; default-deny egress blocks outbound. Each needs its own allow rules.
      
      
        Default-deny egress without UDP/TCP 53 to CoreDNS breaks name resolution for selected workloads — not automatically cluster-wide.

---

## Slide 81: NetworkPolicy — Debug Commands {#slide-81}

*File: `S41b_NetPolicyDebug.astro` · id: `s41b-net-policy-debug`*

### Speaker notes

Debug: get networkpolicy, describe policy, compare pod labels to podSelector. Test with debug pod WITH and WITHOUT same labels. Cross-namespace: namespaceSelector matchLabels on namespace, not pod. Egress to 0.0.0.0/0:443 needs explicit rule under default-deny. Cilium Hubble / Calico flow logs show denied flows.

### Table

| Traffic path | Policy field | Missed rule |
| --- | --- | --- |
| App → DB | egress + port 5432 | Forgot namespaceSelector on DB ns |
| Ingress → App | ingress podSelector | Health check from kube-system blocked |
| App → DNS | egress UDP/TCP 53 | Egress deny without DNS allow breaks resolution |
| App → external API | egress :443 | Egress allow missing under deny-all |

### Commands

```bash
kubectl get networkpolicy -n NAMESPACE
kubectl describe networkpolicy POL -n NAMESPACE
kubectl get pod POD -n NAMESPACE --show-labels

kubectl run -it --rm np-test --image=nicolaka/netshoot --restart=Never -n NAMESPACE -- \\
  curl -m5 -sv telnet://TARGET:PORT
```

> **TIP:** Cilium Hubble / Calico flow logs show denied flows — use when available instead of guessing.

---

# kubectl by Intention

## Slide 82: kubectl by Intention {#slide-82}

*File: `S42_KubectlPhilosophy.astro` · id: `s42-kubectl-philosophy` · variant: chapter*

### Speaker notes

Commands match questions. Observe/Locate/Narrow/Verify map to get/describe/logs/rollout.

### Content

- kubectl by Intention

    
    -

---

## Slide 83: Observe & Locate {#slide-83}

*File: `S42b_KubectlObserve.astro` · id: `s42b-kubectl-observe`*

### Speaker notes

get = snapshot. describe = Events + why. Never stop at get during an incident.

### Table

| Intent | Command | When NOT |
| --- | --- | --- |
| What exists? | kubectl get pods,svc,deploy -n NS | Need Events or history |
| Why this state? | kubectl describe pod\|node\|pvc | Live logs or metrics |
| CPU / RAM use? | kubectl top pod\|node | No metrics-server |
| Manifest drift? | kubectl diff -f manifest.yaml | Hotfixes not in Git |

---

## Slide 84: Narrow & Verify {#slide-84}

*File: `S42c_KubectlNarrow.astro` · id: `s42c-kubectl-narrow`*

### Speaker notes

logs vs --previous. Prefer debug over exec in prod. port-forward is not a prod path.

### Table

| Intent | Command | When NOT |
| --- | --- | --- |
| App output now? | kubectl logs POD -f --tail=100 | Never started — use --previous |
| Last crash output? | kubectl logs POD --previous | No previous instance |
| Quick check inside? | kubectl exec … -- CMD | Prod deep debug — use debug |
| Isolated shell? | kubectl debug POD -it --image=… | First move — describe first |
| Rollout done? | kubectl rollout status deploy/X | Need history / undo |
| Reach from laptop? | kubectl port-forward svc/… | Prod traffic path |

### Commands

```bash
kubectl get pods -n NS -o wide
kubectl describe pod POD -n NS
kubectl logs POD -n NS --previous
kubectl rollout status deployment/DEPLOY -n NS
```

---

# Observability

## Slide 85: Signals — WHAT, WHY, WHEN, WHERE {#slide-85}

*File: `S43_Observability.astro` · id: `s43-observability`*

### Speaker notes

Kubernetes tells you WHAT happened; other signals tell you WHY, WHEN, WHERE, and HOW MUCH. Walk SignalGrid: events are free and fast, logs are narrative, metrics are trends, traces are paths. Profiling: which code path under load. Don't reach for traces when events already explain the scheduling failure. Next slide: stack mapping (Prom/Grafana/Loki/Tempo/OTel).

> **RULE:** Events explain Kubernetes actions; logs explain application failures. Metrics confirm timing. Traces locate the hop.

### Content

- Profiling — HOW MUCH in code
- CPU / heap flame graphs — Which code path consumes resources under load?

---

## Slide 86: Stack — Which Tool Answers Which Question? {#slide-86}

*File: `S43b_ObservabilityStack.astro` · id: `s43b-observability-stack`*

### Speaker notes

CNCF stack: Prometheus scrapes metrics, Grafana correlates dashboards, Loki indexes logs, Tempo stores traces, OpenTelemetry instruments apps. Match question type to signal — matrix walkthrough. Pod restarting: events then Loki. Latency spike: Grafana then Tempo. Cross-service: traceID to correlated logs.

### Table

| Question | First signal | Tool / query |
| --- | --- | --- |
| Pod keeps restarting | Events → Logs | describe pod · Loki {namespace="prod"} |
| Latency spike at 14:32 | Metrics → Traces | Grafana · Tempo service.name=checkout |
| 503 but pods Running | Events → Metrics | Ready addresses · error rate |
| Memory climbing over days | Metrics → Profiling | working_set · pprof / Pyroscope |

### Content

- Prometheus
      Grafana
      Loki
      Tempo
      OpenTelemetry

---

# Advanced Debugging

## Slide 87: kubectl debug — Ephemeral Containers {#slide-87}

*File: `S44_AdvancedDebug.astro` · id: `s44-advanced-debug`*

### Speaker notes

Tools of last resort, not first resort. kubectl debug with ephemeral containers: copy debug image into running pod without changing main image. Node shell for CNI/kubelet — privileged, use sparingly. kubectl diff and rollout undo for config regressions. Next slide: when NOT to use invasive tools in prod.

### Commands

```bash
kubectl debug -it pod/checkout-7f9c2 \\
  --image=nicolaka/netshoot --target=app

# Node shell (privileged — use sparingly)
kubectl debug node/worker-3 -it \\
  --image=ubuntu -- chroot /host bash
```

### Commands

```bash
kubectl diff -f deployment.yaml
kubectl apply -f deployment.yaml
kubectl rollout undo deployment/checkout
kubectl rollout status deployment/checkout
```

> **TIP:** Ephemeral debug proves network path, DNS, and TLS from the pod netns — with RBAC and audit.

### Content

- Ephemeral Containers
      Node Debug
      rollout undo

---

## Slide 88: When NOT to Use Invasive Tools {#slide-88}

*File: `S44b_AdvancedCaution.astro` · id: `s44b-advanced-caution`*

### Speaker notes

Invasive tools need change control, blast-radius limits, exit plan. kubectl debug is conditionally safe — not a free pass. tcpdump/strace can become the incident.

### Table

| Technique | Proves | Prod-safe? |
| --- | --- | --- |
| kubectl debug (ephemeral) | Network/DNS/TLS from pod netns | Conditionally — RBAC, audit, incident procedure |
| kubectl debug node / host | Node CNI / host networking | High risk — privileged host access |
| strace -p PID | Syscall blocking (I/O, locks) | Rarely — high overhead |
| tcpdump -i any port 443 | Packet reachability, RST, TLS | Careful — CPU & capture size |
| Chaos Mesh / Litmus | Fix survives kill, partition | Staging first, then controlled prod |

> **DANGER:** When NOT: no hypothesis yet, peak traffic, no rollback plan, or read-only signals not exhausted.
      strace and tcpdump on hot paths can become the incident.

### Content

- strace / tcpdump
      Chaos Validation

---

## Slide 89: exec vs kubectl debug {#slide-89}

*File: `S44c_ExecVsDebug.astro` · id: `s44c-exec-vs-debug`*

### Speaker notes

exec = quick read-only-ish check in existing container. debug = ephemeral toolbox without baking tools into the app image. Neither is step 1.

### Table

| Tool | Use when | Avoid when |
| --- | --- | --- |
| kubectl exec | Quick file/env/port check in running container | CrashLoop (no running process), hardened images, need tcpdump |
| kubectl debug (ephemeral) | Need netshoot tools / share namespaces | Before describe/events; unrestricted prod without audit |
| debug node / hostNetwork | Node-level CNI / kubelet networking | First reflex — high blast radius |

> **DANGER:** Invasive debugging is not triage. describe → events → logs first; then exec/debug with a hypothesis.

---

# Production Incidents

## Slide 90: Production Incidents — Practice {#slide-90}

*File: `S45_IncidentsIntro.astro` · id: `s45-incidents-intro` · variant: chapter*

### Speaker notes

Practice section. Predict root cause before opening the Fix slide. Each incident uses: Symptom → wrong assumption → discriminating check → root cause → fix → validate → prevent.

### Content

- Production Incidents
    

    
      Work each case as a study drill — cover the Fix slide until you have a hypothesis.
    

    
    - 
    
      503 / EndpointSlice
      Secret
      Affinity
      OOM
      Gateway
      DNS · NetPol · PVC

---

## Slide 91: Incident: Running Pods, HTTP 503 {#slide-91}

*File: `S46_Incident503.astro` · id: `s46-incident-503`*

### Speaker notes

Study format: symptom, wrong assumption, discriminating check, cause. Prefer EndpointSlice.

### Commands

```bash
kubectl get endpointslices -l kubernetes.io/service-name=checkout -o wide
kubectl describe pod -l app=checkout | grep -A5 Conditions
```

> **SYMPTOM:** Checkout returns HTTP 503. Dashboards show pods Running.

> **FIRST WRONG ASSUMPTION:** “Restart the Deployment — pods look fine.”

> **FASTEST DISCRIMINATING CHECK:** kubectl get endpointslices -l kubernetes.io/service-name=checkout — empty / not ready?

> **ROOT CAUSE:** Readiness always 200 while app cannot reach Postgres → Ready=False → no backends.

### Content

- Checkout returns HTTP 503. Dashboards show pods Running.
    “Restart the Deployment — pods look fine.”
    
      kubectl get endpointslices -l kubernetes.io/service-name=checkout — empty / not ready?
    
    
      Readiness always 200 while app cannot reach Postgres → Ready=False → no backends.

---

## Slide 92: 503 — Fix, Validate, Prevent {#slide-92}

*File: `S46b_Incident503Fix.astro` · id: `s46b-incident-503-fix`*

### Speaker notes

Complete the study card: fix probe, validate EndpointSlice Ready addresses, prevent with ready backends == 0 alert.

> **FIX:** Readiness hits /ready with real dependency checks — not a always-200 /healthz.

> **VALIDATE:** EndpointSlice shows Ready addresses; LB 503 clears; checkout succeeds.

> **PREVENT:** Alert on Ready backends == 0, not only on Running replica count.

### Content

- Readiness hits /ready with real dependency checks — not a always-200 /healthz.
    
    
      EndpointSlice shows Ready addresses; LB 503 clears; checkout succeeds.
    
    
      Alert on Ready backends == 0, not only on Running replica count.

---

## Slide 93: Incident: CrashLoop from Missing Secret {#slide-93}

*File: `S47_IncidentSecret.astro` · id: `s47-incident-secret`*

### Speaker notes

Symptom: new deployment after secret rotation — CrashLoopBackOff. Observe: describe pod shows CreateContainerConfigError or mount failure events. Locate: Secret db-credentials-v3 referenced in deployment but only v2 exists (External Secrets sync lag or typo). Narrow: compare deployment envFrom secretRef name vs kubectl get secrets. Verify: create missing secret or fix reference, watch pod start. Fix: restore secret from vault backup or fix ExternalSecret template. Validate: pod reaches Running, logs show successful DB auth. Prevent: pre-deploy validation hook, alert on CreateContainerConfigError rate, never delete old secret until consumers updated.

> **SYMPTOM:** Post-rotation deploy: all new pods CrashLoopBackOff. Previous ReplicaSet still serving — silent partial outage.

> **RULE:** Check events before logs — CreateContainerConfigError is the smoking gun.

### Content

- Post-rotation deploy: all new pods CrashLoopBackOff. Previous ReplicaSet still serving — silent partial outage.
    

    
      
        Observe
- CrashLoopBackOff, Restarts climbing
- Event: secret "db-credentials-v3" not found
- Only new ReplicaSet affected; old pods use v2

---

## Slide 94: Missing Secret — Fix & Prevent {#slide-94}

*File: `S47b_IncidentSecretFix.astro` · id: `s47b-incident-secret-fix`*

### Speaker notes

Root cause: Deployment references db-credentials-v3; External Secrets sync failed — Secret never created. Fix: repair ExternalSecret → re-sync. Prevent: deploy gate checks Secret exists; blue/green with secret pre-stage.

### Commands

```bash
kubectl describe pod api-5d8f7 | grep -A3 Events
kubectl get externalsecret db-credentials -o yaml
kubectl get secret db-credentials-v3   # NotFound
```

> **ROOT CAUSE:** Deployment references db-credentials-v3; External Secrets sync failed — Secret never created.

### Content

- Deployment references db-credentials-v3; External Secrets sync failed — Secret never created.
    

    

    
      
        Fix
- Repair ExternalSecret → re-sync; restore from vault if needed.
- Deploy gate checks Secret exists; never delete old secret until consumers updated.

---

## Slide 95: Incident: Pending from Affinity &amp; Taints {#slide-95}

*File: `S48_IncidentAffinity.astro` · id: `s48-incident-affinity`*

### Speaker notes

Symptom: new microservice pods stuck Pending for 20+ minutes. Observe: kubectl get pods shows Pending, no restarts. Locate: describe pod events show FailedScheduling — 0/5 nodes available: 3 Insufficient gpu, 2 node(s) had taint gpu=true. Narrow: pod has required node affinity for gpu=true AND toleration missing for dedicated GPU nodes. Verify: check node labels and taints — GPU nodes exist but are tainted; pod spec lacks toleration. Fix: add toleration for gpu=true:NoSchedule OR relax affinity if GPU not actually needed (copy-paste from ML team template). Validate: pod schedules within seconds. Prevent: CI lint for affinity/toleration pairs, document node pool contracts.

> **SYMPTOM:** New service pods Pending 20+ min. HPA can't scale. Team blames "cluster capacity" and requests 10 more nodes.

> **RULE:** FailedScheduling events name the constraint — don't buy nodes first.

### Content

- New service pods Pending 20+ min. HPA can't scale. Team blames "cluster capacity" and requests 10 more nodes.
    

    
      
        Observe
- Pending, no container starts
- FailedScheduling in events
- 0/5 nodes: affinity + taint mismatch

---

## Slide 96: Affinity & Taints — Fix & Prevent {#slide-96}

*File: `S48b_IncidentAffinityFix.astro` · id: `s48b-incident-affinity-fix`*

### Speaker notes

Root cause: Required node affinity gpu=true copied from ML template — but missing toleration for GPU node taint. Fix: remove erroneous affinity OR add matching toleration. Prevent: policy check: affinity requires toleration audit.

### Commands

```bash
kubectl describe pod worker-abc12 | grep -A8 Events
kubectl get nodes -L gpu --show-labels
kubectl describe node gpu-node-1 | grep -i taint
```

> **ROOT CAUSE:** Required node affinity gpu=true copied from ML template — missing toleration for GPU node taint.

### Content

- Required node affinity gpu=true copied from ML template — missing toleration for GPU node taint.
    

    

    
      
        Fix
- Remove erroneous affinity OR add matching toleration.
- CI lint for affinity/toleration pairs; document node pool contracts.

---

## Slide 97: Incident: OOMKilled — Memory Leak {#slide-97}

*File: `S49_IncidentOOM.astro` · id: `s49-incident-oom`*

### Speaker notes

Symptom: service degrades over hours then pods restart in a loop. Observe: describe shows Last State Terminated Reason OOMKilled, Exit Code 137. Locate: memory working set metric climbs linearly — classic leak, not spike. Narrow: only one container in the deployment; limits at 512Mi, requests at 256Mi. Verify: kubectl logs --previous shows no error — JVM/process killed mid-GC. Fix: short-term raise limit to buy time; real fix is leak in connection cache (code). Validate: memory plateaus after fix deploy. Prevent: alert on memory approaching limit at 80%, track OOMKilled events, load test in CI.

> **SYMPTOM:** Slow responses over 6 hours → sudden pod restarts → CrashLoopBackOff. No deploy, no traffic spike.

> **RULE:** Exit 137 = SIGKILL. Confirm Last State.Reason: OOMKilled — logs may be empty because the process was killed.

### Content

- Slow responses over 6 hours → sudden pod restarts → CrashLoopBackOff. No deploy, no traffic spike.
    

    
      
        Observe
- Restarts ↑, latency ↑ over hours
- OOMKilled, exit 137 in describe
- Grafana: memory linear climb to limit

---

## Slide 98: OOMKilled — Fix & Prevent {#slide-98}

*File: `S49b_IncidentOOMFix.astro` · id: `s49b-incident-oom-fix`*

### Speaker notes

Root cause: Memory leak — RSS hits cgroup limit; SIGKILL (137) with Reason OOMKilled. Fix leak; temporary limit bump. Prevent: memory SLO + OOMKilled event monitor.

### Commands

```bash
kubectl describe pod cache-9xk2p | grep -E "Reason|Exit|Limits"
kubectl top pod cache-9xk2p --containers
kubectl logs cache-9xk2p --previous | tail -20
```

> **ROOT CAUSE:** Memory leak — RSS hits the cgroup limit; kernel SIGKILL (exit 137) with Reason: OOMKilled.

### Content

- Memory leak — RSS hits the cgroup limit; kernel SIGKILL (exit 137) with Reason: OOMKilled.
    

    

    
      
        Fix
- Patch the leak; temporary limit bump only buys time.
- Memory SLO at ~80% of limit; track OOMKilled events.

---

## Slide 99: Incident: Gateway API Route Misconfiguration {#slide-99}

*File: `S50_IncidentGateway.astro` · id: `s50-incident-gateway`*

### Speaker notes

Symptom: new API version returns 404 at public URL; internal ClusterIP works fine. Observe: Gateway shows Programmed=True, HTTPRoute Accepted=True — looks healthy. Locate: HTTPRoute backendRefs point to Service api-v1 but new deployment is api-v2 with different Service name. Narrow: parentRefs correct (gateway in right namespace), but path match /v2 routes to wrong backend. Verify: kubectl get httproute -o yaml shows backendRef name api-v1. Fix: update HTTPRoute backendRef to api-v2 Service, wait for controller sync. Validate: external curl returns 200, Gateway status unchanged. Prevent: GitOps diff on HTTPRoute, integration test hitting public URL post-deploy.

> **SYMPTOM:** Public URL /v2/orders returns 404. In-cluster curl to Service works. Gateway "looks fine".

> **RULE:** Healthy Gateway ≠ correct routing.

### Content

- Public URL /v2/orders returns 404. In-cluster curl to Service works. Gateway "looks fine".
    

    
      
        Observe
- 404 external, 200 in-cluster
- Gateway Programmed, route Accepted
- backendRef → wrong Service name

---

## Slide 100: Gateway Route — Fix & Prevent {#slide-100}

*File: `S50b_IncidentGatewayFix.astro` · id: `s50b-incident-gateway-fix`*

### Speaker notes

Root cause: HTTPRoute still routes /v2 prefix to old api-v1 Service — v1 doesn't serve /v2 paths. Fix: update HTTPRoute backendRef to api-v2. Prevent: smoke test public URL in deploy pipeline.

### Commands

```bash
kubectl get gateway,httproute -n prod
kubectl describe httproute api-v2-route | grep -A10 Rules
kubectl get svc api-v1 api-v2 -o wide
```

> **ROOT CAUSE:** HTTPRoute still routes /v2 prefix to old api-v1 Service — v1 doesn't serve /v2 paths.

### Content

- HTTPRoute still routes /v2 prefix to old api-v1 Service — v1 doesn't serve /v2 paths.
    

    

    
      
        Fix
- Update HTTPRoute backendRef to api-v2 Service.
- Smoke test public URL in deploy pipeline; GitOps diff on HTTPRoute.

---

## Slide 101: Incident: Timeout — DNS or NetPol? {#slide-101}

*File: `S51_IncidentDNSNetPol.astro` · id: `s51-incident-dns-netpol`*

### Speaker notes

Same user pain, two causes. Branch on nslookup first.

> **SYMPTOM:** App logs show DNS lookup errors or TCP i/o timeout to postgres — same pain.

---

## Slide 102: DNS vs NetPol — Fix Paths {#slide-102}

*File: `S51b_IncidentDNSNetPolFix.astro` · id: `s51b-incident-dns-netpol-fix`*

### Speaker notes

Spell out both fixes. Emphasize verify from the same namespace as the app.

### Commands

```bash
kubectl debug -it pod/app-xyz --image=nicolaka/netshoot -- nslookup postgres.prod
kubectl get netpol -n prod -o wide
kubectl get pods -n kube-system -l k8s-app=kube-dns
```

### Content

- Branch A — DNS
- CoreDNS unhealthy or upstream broken → NXDOMAIN / lookup fails.
- Fix: CoreDNS limits, forward plugin, kube-dns EndpointSlice.
- Branch B — NetPol
- DNS works; TCP SYN dropped by default-deny egress.
- Fix: allow egress to postgres namespace:5432.

---

## Slide 103: Incident: PVC MultiAttach {#slide-103}

*File: `S52_IncidentPVCConfig.astro` · id: `s52-incident-pvc-config`*

### Speaker notes

RWO volume still attached to old node while new pod waits.

### Commands

```bash
kubectl describe pod db-0 | grep -A8 Events
kubectl get volumeattachment | grep pvc-data-db-0
```

> **SYMPTOM:** StatefulSet pod ContainerCreating 10+ min. Event: Multi-Attach — volume exclusively attached elsewhere.

### Content

- StatefulSet pod ContainerCreating 10+ min. Event: Multi-Attach — volume exclusively attached elsewhere.
    

    
      
        Narrow
- RWO PVC; old pod on node-a still holds the volume.
- Delete stuck pod; wait for detach; check VolumeAttachment.

---

## Slide 104: Incident: Stale ConfigMap Rollout {#slide-104}

*File: `S52b_IncidentConfigMap.astro` · id: `s52b-incident-configmap`*

### Speaker notes

ConfigMap updated but pods still serve old config — especially with subPath mounts.

### Commands

```bash
kubectl exec db-0 -- cat /etc/config/app.yaml   # stale?
kubectl rollout restart statefulset/app
```

> **SYMPTOM:** ConfigMap updated (feature flag off) but app still serves old behavior. Pods Running, no errors.

> **TIP:** Prevent with Reloader or a checksum annotation that triggers rollout on config change.

### Content

- ConfigMap updated (feature flag off) but app still serves old behavior. Pods Running, no errors.
    

    
      
        Narrow
- subPath does not hot-reload — pod has a stale file.
- rollout restart · version ConfigMap names (config-v42).

---

# Interview Prep

## Slide 105: Interview Bank — Questions 1–8 {#slide-105}

*File: `S53_Interview.astro` · id: `s53-interview`*

### Speaker notes

Q1 Ready vs Running. Q2 cheapest high-signal evidence. Q3 Pending Events. Q4 137=SIGKILL verify OOMKilled Reason. Q5 EndpointSlice. Q6 ndots. Q7 default-deny is directional. Q8 rollout undo.

### Table

| # | Question | Ideal Answer (1 line) |
| --- | --- | --- |
| 1 | Pod Running but not serving traffic — why? | Not Ready → not Ready in EndpointSlice; check readiness |
| 2 | First evidence for a broken pod? | describe → Events/Conditions; logs --previous if CrashLoop |
| 3 | Pod Pending forever — where to look? | describe Events: FailedScheduling (resources, affinity, taints) |
| 4 | Exit code 137 meaning? | SIGKILL (128+9); often OOM — verify Last State.Reason OOMKilled |
| 5 | Service exists but no traffic reaches pods? | get endpointslices — empty/not ready = selector or readiness |
| 6 | Intermittent DNS failures in Java apps? | Check ndots / search domains — FQDN vs short name |
| 7 | Default-deny NetworkPolicy — what breaks? | Ingress deny ≠ egress deny; blocked direction needs allows |
| 8 | Fastest rollback after bad deploy? | kubectl rollout undo deployment/X — don’t delete pods manually |

> **FRAMEWORK:** Questions 9–32 continue on the next slides. Think in layers, not commands.

---

## Slide 106: Interview Bank — Questions 9–16 {#slide-106}

*File: `S53b_Interview.astro` · id: `s53b-interview`*

### Speaker notes

Q9: Bad liveness kills pod; bad readiness removes from Service only. Q10: nslookup from debug pod in same namespace isolates DNS. Q11: ConfigMap mount may be stale (subPath) or app can't parse — logs --previous. Q12: AvailableReplicas < Desired — not enough Ready pods. Q13: PVC Pending — no matching PV, wrong storageClass, quota. Q14: MultiAttach — RWO still attached on another node. Q15: Node NotReady — existing pods run; new scheduling blocked. Q16: Evicted — node pressure (memory/disk/PID). Structure answers: symptom → signal → command → root cause → prevention.

### Table

| # | Question | Ideal Answer (1 line) |
| --- | --- | --- |
| 9 | Liveness vs readiness — production impact? | Bad liveness kills pod; bad readiness removes from Service only |
| 10 | How prove it's DNS not app bug? | nslookup from debug pod in same namespace — isolate resolution layer |
| 11 | CrashLoop after ConfigMap change? | Mount may be stale (subPath) or app can't parse new config — logs --previous |
| 12 | What does AvailableReplicas < Desired mean? | Not enough Ready pods — check conditions, probes, resource limits |
| 13 | PVC stuck Pending? | No matching PV / wrong storageClass / quota — describe pvc Events |
| 14 | MultiAttach error on RWO volume? | Volume still attached to pod on another node — wait detach or delete stuck pod |
| 15 | Node NotReady — pod impact? | Existing pods keep running; new scheduling blocked; check kubelet & node conditions |
| 16 | Pod Evicted — root causes? | Node pressure (memory/disk/PID) — describe node, check eviction thresholds |

---

## Slide 107: Interview Bank — Questions 17–24 {#slide-107}

*File: `S54_InterviewMore.astro` · id: `s54-interview-more`*

### Speaker notes

Q17-20: networking and TLS edge cases. Q21-24: observability and operations. Q17: Ingress 502 — no Ready addresses in EndpointSlice or wrong port. Q18: TLS — secret, SNI, expiry. Q19: CoreDNS — upstream, cache, limits. Q20: Headless Service — stable per-pod DNS for StatefulSets. Q21: logs --previous after crash. Q22: metrics for SLOs, logs for diagnosis. Q23: validate under load with canary + error rate. Q24: startup probe for slow-starting apps.

### Table

| # | Question | Ideal Answer (1 line) |
| --- | --- | --- |
| 17 | Ingress 502 but pods healthy? | No Ready addresses in EndpointSlice or wrong Service port in Ingress |
| 18 | TLS handshake failure on Ingress? | Secret missing/wrong cert, SNI mismatch, or expired certificate |
| 19 | CoreDNS high latency? | Check upstream forwarder, cache plugin, pod resource limits & replica count |
| 20 | Headless Service use case? | Stable per-pod DNS for StatefulSets — direct pod-to-pod discovery |
| 21 | When use kubectl logs --previous? | Container crashed — capture last run output before restart |
| 22 | Metric vs log for alerting? | Metrics for thresholds & SLOs; logs for diagnostic detail after alert fires |
| 23 | How validate fix under load? | Rollout canary + watch error rate, latency, saturation — not just pod status |
| 24 | What is a startup probe for? | Slow-starting apps — blocks liveness until initial boot completes |

---

## Slide 108: Interview Bank — Questions 25–32 {#slide-108}

*File: `S54b_InterviewMore.astro` · id: `s54b-interview-more`*

### Speaker notes

Q25-28: security and multi-tenancy. Q29-32: design and prevention mindset. Q25: RBAC 403 — RoleBinding, namespace, impersonation. Q26: Quota caps namespace; LimitRange per-pod defaults. Q27: delete pod treats symptom — Deployment recreates same spec. Q28: HPA needs metrics-server; VPA needs admission. Q29: readiness checks dependency; liveness stays local. Q30: post-incident — timeline, root cause, prevention ticket. Q31: GitOps drift — kubectl diff / Argo OutOfSync. Q32: observe before changing — one change, then validate. Total 32 questions across four slides.

### Table

| # | Question | Ideal Answer (1 line) |
| --- | --- | --- |
| 25 | RBAC 403 on kubectl? | Check RoleBinding subject, namespace scope, and impersonation headers |
| 26 | ResourceQuota vs LimitRange? | Quota caps namespace totals; LimitRange sets per-pod defaults & min/max |
| 27 | Why avoid kubectl delete pod for fix? | Treats symptom — Deployment recreates same broken spec |
| 28 | Horizontal vs Vertical scaling debug? | HPA needs metrics-server; VPA needs admission controller & eviction |
| 29 | Design probe for external dependency? | Readiness checks dependency; liveness stays lightweight & local |
| 30 | Post-incident — top 3 actions? | Timeline, root cause, detection gap, prevention ticket with owner |
| 31 | GitOps drift detection? | kubectl diff / Argo CD OutOfSync — compare live vs desired state |
| 32 | Golden rule under incident pressure? | Observe before changing — hypothesis, then one change, then validate |

> **TIP:** 32 questions total. In interviews: narrate your investigation lifecycle out loud.

---

# Reference

## Slide 109: Cheat Sheet — First 60 Seconds {#slide-109}

*File: `S55_CheatSheets.astro` · id: `s55-cheatsheets`*

### Speaker notes

Photograph slide. Wide get → describe → logs --previous → EndpointSlice if traffic issue.

### Commands

```bash
kubectl get pods,events -n <ns> --sort-by='.lastTimestamp'
kubectl describe pod <pod> | less          # Events + Conditions
kubectl logs <pod> --previous               # if restarted / CrashLoop
kubectl get endpointslices,svc -n <ns>
```

> **RULE:** Wide get → narrow describe → logs --previous if restarted → EndpointSlice if traffic issue.

---

## Slide 110: Cheat Sheet — Status Meanings {#slide-110}

*File: `S55b_CheatStatus.astro` · id: `s55b-cheat-status`*

### Speaker notes

OOM: Reason OOMKilled is proof; 137 is SIGKILL. Readiness: not Ready in EndpointSlice. Liveness restarts.

### Table

| Status / Reason | Meaning | Next step |
| --- | --- | --- |
| Pending | Not scheduled yet / waiting | describe → FailedScheduling or Events |
| CrashLoopBackOff | Container exit loop | describe + logs --previous |
| OOMKilled | Memory limit hit (often exit 137) | confirm Reason · top pod · limits |
| Evicted | Node resource pressure | describe node · pressure conditions |
| CreateContainerConfigError | Missing secret/config | describe → secret/configmap ref |
| ImagePullBackOff | Registry/auth/tag issue | describe → pull events |

### Table

| Probe | Fails when | Effect |
| --- | --- | --- |
| Startup | App still booting | Blocks liveness until pass |
| Readiness | Can't serve traffic | Not Ready in EndpointSlice — no kill |
| Liveness | Process deadlocked | Container restart — use carefully |

---

## Slide 111: Cheat Sheet — Networking Quick Path {#slide-111}

*File: `S55c_CheatNetPath.astro` · id: `s55c-cheat-net-path`*

### Speaker notes

Walk hops left to right. curl pod IP first, then Service DNS, then Ingress URL, then DNS/NetPol.

> **FRAMEWORK:** Fail at hop N → debug layer N.

---

## Slide 112: Checkpoint — Core Basics {#slide-112}

*File: `S55d_CheckpointBasics.astro` · id: `s55d-checkpoint-basics`*

### Speaker notes

Quick self-test before closing. If any fail, revisit Core models and evidence order.

---

# Synthesis

## Slide 113: Final Playbook — The Loop {#slide-113}

*File: `S56_FinalPlaybook.astro` · id: `s56-final-playbook`*

### Speaker notes

Leave them with the ring. Mantras next; pyramid/onion/signals on the models slide.

> **RULE:** Running ≠ Healthy

> **RULE:** Ready ≠ Alive

> **RULE:** Observe before changing

> **RULE:** One hypothesis · Validate · Prevent

### Content

- 
    
      Running ≠ Healthy
      Ready ≠ Alive
      Observe before changing
      One hypothesis · Validate · Prevent

---

## Slide 114: Three Models to Take Home {#slide-114}

*File: `S56b_FinalModels.astro` · id: `s56b-final-models`*

### Speaker notes

Pyramid = where to start. Onion = how to peel. Triangle = which signal answers the question.

---

# Closing

## Slide 115: Closing — Keep the Thought Process {#slide-115}

*File: `S57_Closing.astro` · id: `s57-closing` · variant: quote*

### Speaker notes

Study close: the takeaway is the process, not the command list. Revisit Core models weekly; use Reference during incidents; drill Practice until the first question is automatic.

### Content

- Don't memorize kubectl commands.

      Memorize the engineering thought process.
    

    
      Observe → Locate → Narrow → Verify → Fix → Validate → Prevent
    

    
      Events first
      One hypothesis
      Layer by layer
      Prevent recurrence
- Export: MD · Overview: O · Revisit Core before Practice.

---

## Closing

> Don't memorize kubectl commands.
>
> Memorize the engineering thought process.

---

*Exported from the Astro presentation in this repository.*
