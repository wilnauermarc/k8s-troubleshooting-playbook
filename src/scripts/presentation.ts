export function initPresentation() {
  const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
  if (slides.length === 0) return;

  const progress = document.querySelector<HTMLElement>('[data-progress]');
  const counter = document.querySelector<HTMLElement>('[data-counter]');
  const chapterEl = document.querySelector<HTMLElement>('[data-chapter-label]');
  const titleEl = document.querySelector<HTMLElement>('[data-title-label]');
  const trackEl = document.querySelector<HTMLElement>('[data-track-label]');
  const trackSep = document.querySelector<HTMLElement>('[data-track-sep]');
  const overview = document.querySelector<HTMLElement>('[data-overview]');
  const overviewGrid = document.querySelector<HTMLElement>('[data-overview-grid]');

  const trackNames: Record<string, string> = {
    core: 'Core',
    practice: 'Practice',
    reference: 'Reference',
  };

  let index = 0;
  let overviewOpen = false;

  const params = new URLSearchParams(window.location.search);
  const start = Number(params.get('slide') ?? '0');
  if (!Number.isNaN(start) && start >= 0 && start < slides.length) {
    index = start;
  }

  function renderOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = slides
      .map((slide, i) => {
        const title = slide.dataset.title || slide.dataset.slideId || `Slide ${i + 1}`;
        const chapter = slide.dataset.chapter || '';
        const track = trackNames[slide.dataset.track || ''] || '';
        return `<button type="button" data-jump="${i}" class="rounded-lg border border-deck-border bg-deck-panel p-3 text-left transition hover:border-deck-cyan/50 ${
          i === index ? 'ring-1 ring-deck-cyan' : ''
        }">
          <div class="text-[10px] uppercase tracking-wider text-deck-muted">${String(i + 1).padStart(2, '0')} ${track ? track + ' · ' : ''}${chapter}</div>
          <div class="mt-1 text-sm text-deck-text line-clamp-2">${title}</div>
        </button>`;
      })
      .join('');
  }

  function show(i: number) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((slide, n) => {
      slide.classList.toggle('is-active', n === index);
    });

    const active = slides[index];
    if (progress) {
      progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    }
    if (counter) {
      counter.textContent = `${index + 1} / ${slides.length}`;
    }
    if (chapterEl) {
      chapterEl.textContent = active.dataset.chapter || '';
    }
    if (titleEl) {
      titleEl.textContent = active.dataset.title || active.dataset.slideId || '';
    }
    if (trackEl) {
      const t = trackNames[active.dataset.track || ''] || '';
      trackEl.textContent = t;
      if (trackSep) trackSep.classList.toggle('hidden', !t);
    }

    const url = new URL(window.location.href);
    url.searchParams.set('slide', String(index));
    history.replaceState({}, '', url);

    if (overviewOpen) renderOverview();
  }

  function next() {
    show(index + 1);
  }
  function prev() {
    show(index - 1);
  }

  function toggleOverview() {
    overviewOpen = !overviewOpen;
    overview?.classList.toggle('hidden', !overviewOpen);
    if (overviewOpen) renderOverview();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }

  document.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        show(0);
        break;
      case 'End':
        e.preventDefault();
        show(slides.length - 1);
        break;
      case 'o':
      case 'O':
        toggleOverview();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'Escape':
        if (overviewOpen) toggleOverview();
        break;
    }
  });

  const onAll = (selector: string, fn: () => void) => {
    document.querySelectorAll(selector).forEach((el) => el.addEventListener('click', fn));
  };
  onAll('[data-next]', next);
  onAll('[data-prev]', prev);
  onAll('[data-toggle-overview]', toggleOverview);
  onAll('[data-toggle-fs]', toggleFullscreen);

  overviewGrid?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-jump]');
    if (!btn) return;
    show(Number(btn.dataset.jump));
    toggleOverview();
  });

  let touchX = 0;
  document.addEventListener(
    'touchstart',
    (e) => {
      touchX = e.changedTouches[0]?.screenX ?? 0;
    },
    { passive: true },
  );
  document.addEventListener(
    'touchend',
    (e) => {
      const dx = (e.changedTouches[0]?.screenX ?? 0) - touchX;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true },
  );

  show(index);
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initPresentation);
}
