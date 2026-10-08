const header = document.querySelector('[data-header]');
const progress = document.querySelector('.page-progress span');
const reveals = document.querySelectorAll('.reveal');
const modal = document.querySelector('[data-media-modal]');
const modalVideo = modal.querySelector('[data-modal-video]');
const modalImage = modal.querySelector('[data-modal-image]');
const modalTitle = modal.querySelector('[data-modal-title]');
const modalNote = modal.querySelector('[data-modal-note]');
const modalKicker = modal.querySelector('[data-modal-kicker]');
const modalClose = modal.querySelector('.modal-close');
let lastFocused = null;

function updateScrollUI() {
  const top = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('is-scrolled', top > 18);
  progress.style.transform = `scaleX(${height > 0 ? Math.min(1, top / height) : 0})`;
}

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

function openModal() {
  lastFocused = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  window.setTimeout(() => modalClose.focus(), 50);
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.removeAttribute('poster');
  modalVideo.load();
  modalVideo.classList.remove('is-active');
  modalImage.classList.remove('is-active');
  modalImage.removeAttribute('src');
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-video]').forEach((button) => {
  button.addEventListener('click', () => {
    modalImage.classList.remove('is-active');
    modalVideo.src = button.dataset.video;
    modalVideo.poster = button.dataset.poster || '';
    modalVideo.classList.add('is-active');
    modalKicker.textContent = '十九 · 角色动态短片';
    modalTitle.textContent = button.dataset.title || '角色动态短片';
    modalNote.textContent = button.dataset.note || '';
    openModal();
    modalVideo.play().catch(() => {});
  });
});

document.querySelectorAll('[data-image]').forEach((button) => {
  button.addEventListener('click', () => {
    modalVideo.classList.remove('is-active');
    modalImage.src = button.dataset.image;
    modalImage.alt = button.dataset.alt || '作品大图';
    modalImage.classList.add('is-active');
    modalKicker.textContent = '十九 · 视觉作品';
    modalTitle.textContent = button.dataset.alt || '作品大图';
    modalNote.textContent = '点击关闭按钮或画面外区域返回作品集。';
    openModal();
  });
});

modal.querySelectorAll('[data-close-modal]').forEach((control) => control.addEventListener('click', closeModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

document.querySelectorAll('video').forEach((video) => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach((other) => {
      if (other !== video) other.pause();
    });
  });
});
