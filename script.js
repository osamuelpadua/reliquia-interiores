import { siteConfig } from './site.config.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout = window.matchMedia('(max-width: 699px)');
const scrollBehavior = () => reducedMotion.matches ? 'instant' : 'smooth';

// The text follows the scroll position; the central symbol stays fixed.
const stampText = document.querySelector('.brand-stamp-text');
if (stampText) {
  const degreesPerPixel = 0.12;
  let stampFrame = null;

  function updateStampRotation() {
    const angle = reducedMotion.matches ? 0 : Math.max(0, window.scrollY) * degreesPerPixel;
    stampText.style.setProperty('--stamp-rotation', `${angle}deg`);
    stampFrame = null;
  }

  function scheduleStampRotation() {
    if (stampFrame === null) stampFrame = requestAnimationFrame(updateStampRotation);
  }

  window.addEventListener('scroll', () => {
    if (!reducedMotion.matches) scheduleStampRotation();
  }, { passive: true });
  reducedMotion.addEventListener('change', scheduleStampRotation);
  updateStampRotation();
}

// Contact details are deliberately separate from the visual content of the PDF.
const whatsappNumber = siteConfig.whatsappNumber.replace(/\D/g, '');
if (/^\d{10,15}$/.test(whatsappNumber)) {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  const phone = document.querySelector('[data-phone]');
  const phoneLink = document.createElement('a');
  phoneLink.className = phone.className;
  phoneLink.href = `tel:+${whatsappNumber}`;
  phoneLink.innerHTML = phone.innerHTML;
  phoneLink.lastElementChild.textContent = whatsappNumber.startsWith('55')
    ? `(${whatsappNumber.slice(2, 4)}) ${whatsappNumber.slice(4, -4)}-${whatsappNumber.slice(-4)}`
    : `+${whatsappNumber}`;
  phone.replaceWith(phoneLink);
}

function configureLink(element, url) {
  if (!url || !/^https:\/\//.test(url)) return;
  const link = element.tagName === 'A' ? element : document.createElement('a');
  if (link !== element) {
    for (const { name, value } of element.attributes) link.setAttribute(name, value);
    link.innerHTML = element.innerHTML;
    element.replaceWith(link);
  }
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
}
document.querySelectorAll('[data-social]').forEach(element => configureLink(element, siteConfig[`${element.dataset.social}Url`]));
configureLink(document.querySelector('[data-address]'), siteConfig.mapsUrl);

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
  if (open) navigation.querySelector('a').focus({ preventScroll: true });
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const gallery = document.querySelector('.showroom-gallery');
const galleryItems = [...gallery.querySelectorAll('.showroom-item')];
let galleryWasUsed = false;
function centerGallery() {
  if (galleryWasUsed) return;
  gallery.scrollLeft = mobileLayout.matches ? 0 : Math.max(0, (gallery.scrollWidth - gallery.clientWidth) / 2);
}
centerGallery();
window.addEventListener('load', centerGallery, { once: true });
gallery.addEventListener('pointerdown', () => { galleryWasUsed = true; }, { once: true });
gallery.addEventListener('wheel', () => { galleryWasUsed = true; }, { once: true });
gallery.addEventListener('keydown', event => {
  if (event.target !== gallery || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  galleryWasUsed = true;
  gallery.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * (galleryItems[0].offsetWidth + 20), behavior: scrollBehavior() });
});
new ResizeObserver(centerGallery).observe(gallery);

const dialog = document.querySelector('.gallery-dialog');
const dialogImage = dialog.querySelector('img');
let imageIndex = 0;
let galleryTrigger;
function showImage(index) {
  imageIndex = (index + galleryItems.length) % galleryItems.length;
  const source = galleryItems[imageIndex].querySelector('img');
  dialogImage.src = source.src;
  dialogImage.alt = source.alt;
  dialog.querySelector('.gallery-counter').textContent = `${imageIndex + 1} / ${galleryItems.length}`;
}
galleryItems.forEach((button, index) => button.addEventListener('click', () => {
  galleryTrigger = button;
  showImage(index);
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.dialog-previous').addEventListener('click', () => showImage(imageIndex - 1));
dialog.querySelector('.dialog-next').addEventListener('click', () => showImage(imageIndex + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showImage(imageIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  galleryTrigger?.focus({ preventScroll: true });
});

// Five positions reproduce the reference indicators; only the three supplied
// testimonials are cycled, without inventing additional clients or reviews.
const track = document.querySelector('.testimonial-track');
const cards = [...track.children];
const dots = [...document.querySelectorAll('.carousel-dots button')];
const arrangements = [[2, 0, 1], [0, 1, 2], [1, 2, 0], [2, 1, 0], [0, 2, 1]];
let currentPosition = 1;
let changingPosition = false;
function updateIndicators() {
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentPosition);
    dot.setAttribute('aria-pressed', String(index === currentPosition));
  });
}
function setTestimonialPosition(position) {
  currentPosition = (position + dots.length) % dots.length;
  changingPosition = true;
  arrangements[currentPosition].forEach(index => track.append(cards[index]));
  track.scrollLeft = 0;
  updateIndicators();
  document.querySelector('#testimonial-status').textContent = mobileLayout.matches
    ? cards[arrangements[currentPosition][0]].querySelector('.customer-name').textContent
    : `Posição ${currentPosition + 1} de ${dots.length}`;
  requestAnimationFrame(() => { changingPosition = false; });
}
document.querySelector('.carousel-arrow.previous').addEventListener('click', () => setTestimonialPosition(currentPosition - 1));
document.querySelector('.carousel-arrow.next').addEventListener('click', () => setTestimonialPosition(currentPosition + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => setTestimonialPosition(index)));
track.addEventListener('scrollend', () => {
  if (!mobileLayout.matches || changingPosition) return;
  const index = Math.round(track.scrollLeft / (track.clientWidth + 16));
  const visibleCard = track.children[index];
  if (visibleCard) document.querySelector('#testimonial-status').textContent = visibleCard.querySelector('.customer-name').textContent;
});
updateIndicators();
