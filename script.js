import { siteConfig } from './site.config.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout = window.matchMedia('(max-width: 699px)');
const scrollBehavior = () => reducedMotion.matches ? 'instant' : 'smooth';
const easeOut = 'cubic-bezier(.22, 1, .36, 1)';

// Each [data-reveal] block animates once as it enters the viewport (see "Entrance motion" in
// style.css). Blocks that enter together are staggered; the attribute is removed afterwards.
const root = document.documentElement;
if (root.classList.contains('motion')) {
  const isRevealAnimation = animation => animation.animationName?.startsWith('reveal-');
  function finishReveal(element) {
    element.removeAttribute('data-reveal');
    element.classList.remove('is-inview');
    element.style.removeProperty('--reveal-delay');
  }

  const revealThreshold = 0.15;
  let initialBatch = true;
  const revealObserver = new IntersectionObserver(entries => {
    // Content visible on load waits for the hero to start its own entrance.
    const baseDelay = initialBatch ? 450 : 0;
    initialBatch = false;
    let order = 0;
    for (const { target, intersectionRatio, boundingClientRect } of entries) {
      if (intersectionRatio < revealThreshold) {
        // Blocks already above the viewport when first observed (a restored scroll position) appear without animating.
        if (boundingClientRect.bottom < 0) {
          revealObserver.unobserve(target);
          finishReveal(target);
        }
        continue;
      }
      revealObserver.unobserve(target);
      target.style.setProperty('--reveal-delay', `${baseDelay + Math.min(order++, 5) * 90}ms`);
      target.classList.add('is-inview');
      const animations = target.getAnimations({ subtree: true }).filter(isRevealAnimation);
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => finishReveal(target));
    }
  }, { threshold: revealThreshold });

  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
  reducedMotion.addEventListener('change', event => { if (event.matches) root.classList.remove('motion'); });
  root.classList.add('motion-ready');
}

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

// A separate background layer glides behind the banner content as it scrolls.
const parallaxBanner = document.querySelector('.differences-banner');
if (parallaxBanner) {
  let bannerVisible = false;
  let parallaxFrame = null;
  let previousFrameTime = 0;
  let backgroundOffset = 0;

  function stopParallax() {
    if (parallaxFrame !== null) cancelAnimationFrame(parallaxFrame);
    parallaxFrame = null;
    previousFrameTime = 0;
  }

  function renderParallax(timestamp) {
    parallaxFrame = null;
    if (!bannerVisible || reducedMotion.matches) return;

    const bounds = parallaxBanner.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.max(-1, Math.min(1,
      (viewportHeight / 2 - bounds.top - bounds.height / 2) / ((viewportHeight + bounds.height) / 2)
    ));
    const travel = parseFloat(getComputedStyle(parallaxBanner).getPropertyValue('--parallax-space')) - 2;
    const targetOffset = progress * travel;
    const elapsed = previousFrameTime ? Math.min(timestamp - previousFrameTime, 64) : 16.67;
    const easing = 1 - Math.exp(-elapsed / 110);
    backgroundOffset += (targetOffset - backgroundOffset) * easing;
    backgroundOffset = Math.max(-travel, Math.min(travel, backgroundOffset));
    previousFrameTime = timestamp;

    const settled = Math.abs(targetOffset - backgroundOffset) < 0.05;
    if (settled) backgroundOffset = targetOffset;
    parallaxBanner.style.setProperty('--parallax-offset', `${backgroundOffset.toFixed(3)}px`);

    if (settled) previousFrameTime = 0;
    else parallaxFrame = requestAnimationFrame(renderParallax);
  }

  function scheduleParallax() {
    if (bannerVisible && !reducedMotion.matches && parallaxFrame === null) {
      parallaxFrame = requestAnimationFrame(renderParallax);
    }
  }

  function configureParallax() {
    stopParallax();
    backgroundOffset = 0;
    parallaxBanner.style.setProperty('--parallax-offset', '0px');
    parallaxBanner.classList.toggle('has-parallax', !reducedMotion.matches);
    scheduleParallax();
  }

  new IntersectionObserver(([entry]) => {
    bannerVisible = entry.isIntersecting;
    if (bannerVisible) scheduleParallax();
    else stopParallax();
  }, { rootMargin: '100px 0px' }).observe(parallaxBanner);

  window.addEventListener('scroll', scheduleParallax, { passive: true });
  window.addEventListener('resize', scheduleParallax);
  new ResizeObserver(scheduleParallax).observe(parallaxBanner);
  reducedMotion.addEventListener('change', configureParallax);
  configureParallax();
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

// Once the header has scrolled out of view it becomes fixed: hidden while reading down,
// shown again as soon as the visitor scrolls up. At the very top it returns to its place.
const header = document.querySelector('.site-header');
let lastScrollY = Math.max(0, window.scrollY);
let headerFrame = null;
function updateHeader() {
  headerFrame = null;
  const scrollY = Math.max(0, window.scrollY);
  const delta = scrollY - lastScrollY;
  lastScrollY = scrollY;
  const height = header.offsetHeight;
  const floating = header.classList.contains('is-floating');
  const shown = header.classList.contains('is-shown');

  if (scrollY === 0 || (floating && !shown && scrollY <= height)) {
    header.classList.remove('is-floating', 'is-shown', 'is-animated');
  } else if (!floating) {
    if (scrollY > height) {
      header.classList.add('is-floating');
      header.getBoundingClientRect();
      header.classList.add('is-animated');
    }
  } else if (Math.abs(delta) > 2) {
    const menuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('is-shown', delta < 0 || menuOpen || scrollY <= height);
  }
}
window.addEventListener('scroll', () => {
  if (headerFrame === null) headerFrame = requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

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
function showImage(index, direction = 0) {
  imageIndex = (index + galleryItems.length) % galleryItems.length;
  const source = galleryItems[imageIndex].querySelector('img');
  dialogImage.src = source.src;
  dialogImage.alt = source.alt;
  dialog.querySelector('.gallery-counter').textContent = `${imageIndex + 1} / ${galleryItems.length}`;
  if (direction && !reducedMotion.matches) {
    dialogImage.animate([{ opacity: 0, transform: `translateX(${direction * 32}px)` }, { opacity: 1, transform: 'none' }], { duration: 600, easing: easeOut });
  }
}
// The close animation plays before the dialog is actually closed.
function closeDialog() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  dialog.classList.add('is-closing');
  const animations = dialog.getAnimations({ subtree: true });
  Promise.allSettled(animations.map(animation => animation.finished)).then(() => dialog.close());
}
galleryItems.forEach((button, index) => button.addEventListener('click', () => {
  galleryTrigger = button;
  showImage(index);
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.querySelector('.dialog-previous').addEventListener('click', () => showImage(imageIndex - 1, -1));
dialog.querySelector('.dialog-next').addEventListener('click', () => showImage(imageIndex + 1, 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    showImage(imageIndex + direction, direction);
  }
});
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeDialog();
});
dialog.addEventListener('close', () => {
  dialog.classList.remove('is-closing');
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
// Cards glide from their previous place to the new one; a card that jumps across the row
// fades in from the side it moves towards instead of crossing over the others.
function animateTestimonials(previousBounds) {
  if (reducedMotion.matches) return;
  if (mobileLayout.matches) {
    track.firstElementChild.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: easeOut });
    return;
  }
  const slotWidth = track.children[1].getBoundingClientRect().left - track.children[0].getBoundingClientRect().left;
  cards.forEach(card => {
    const offset = previousBounds.get(card).left - card.getBoundingClientRect().left;
    if (Math.abs(offset) < 1) return;
    const keyframes = Math.abs(offset) > slotWidth * 1.5
      ? [{ opacity: 0, transform: `translateX(${Math.sign(-offset) * 48}px)` }, { opacity: 1, transform: 'none' }]
      : [{ transform: `translateX(${offset}px)` }, { transform: 'none' }];
    card.animate(keyframes, { duration: 800, easing: easeOut });
  });
}
function setTestimonialPosition(position) {
  const previousBounds = new Map(cards.map(card => [card, card.getBoundingClientRect()]));
  currentPosition = (position + dots.length) % dots.length;
  changingPosition = true;
  arrangements[currentPosition].forEach(index => track.append(cards[index]));
  track.scrollLeft = 0;
  updateIndicators();
  document.querySelector('#testimonial-status').textContent = mobileLayout.matches
    ? cards[arrangements[currentPosition][0]].querySelector('.customer-name').textContent
    : `Posição ${currentPosition + 1} de ${dots.length}`;
  requestAnimationFrame(() => { changingPosition = false; });
  animateTestimonials(previousBounds);
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
