/* ----------------------------------------------------------
   Контакты: поменяйте здесь — обновятся все кнопки на сайте.
   ---------------------------------------------------------- */
const CONTACTS = {
  telegram: 'syu_curly',     // ник в Telegram без @
  vk: 'mrrs13',              // короткое имя страницы ВКонтакте
};

const DEFAULT_PLAN = 'бесплатная диагностика';

function messageFor(plan) {
  if (plan === 'вопрос') return 'Здравствуйте, Сью! У меня вопрос о занятиях.';
  return `Здравствуйте, Сью! Хочу записаться: ${plan}.`;
}

function linkFor(messenger, plan) {
  const text = encodeURIComponent(messageFor(plan));
  switch (messenger) {
    case 'telegram': return `https://t.me/${CONTACTS.telegram}?text=${text}`;
    case 'vk': return `https://vk.ru/${CONTACTS.vk}`;
  }
  return '#contact';
}

function setLinks(root, plan) {
  root.querySelectorAll('[data-messenger]').forEach((a) => {
    a.href = linkFor(a.dataset.messenger, plan);
  });
}

// Ссылки и подписи в разделе «Контакты»
setLinks(document.querySelector('#contact'), DEFAULT_PLAN);
const handles = {
  telegram: `@${CONTACTS.telegram}`,
  vk: `vk.ru/${CONTACTS.vk}`,
};
document.querySelectorAll('[data-handle]').forEach((el) => {
  el.textContent = handles[el.dataset.handle];
});

/* ---------- Окно записи ---------- */

const dialog = document.getElementById('book');
const planLabel = document.getElementById('book-plan');

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

document.querySelectorAll('[data-book]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan || DEFAULT_PLAN;
    planLabel.textContent = plan === 'вопрос' ? 'Вопрос о занятиях' : capitalize(plan);
    setLinks(dialog, plan);

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      document.getElementById('contact').scrollIntoView();
    }
  });
});

// Закрытие по клику на фон
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

/* ---------- Меню на мобильных ---------- */

const nav = document.getElementById('nav');
const toggle = document.querySelector('.nav-toggle');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Линия под шапкой при прокрутке ---------- */

const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Мобильная кнопка записи ----------
   Видна, когда кнопка первого экрана и раздел «Контакты» вне экрана. */

const bar = document.querySelector('.mobile-bar');
const heroCta = document.querySelector('.hero-cta');
const contact = document.getElementById('contact');

const inView = (el) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
};
const updateBar = () => {
  bar.classList.toggle('is-visible', !inView(heroCta) && !inView(contact));
};
updateBar();
window.addEventListener('scroll', updateBar, { passive: true });
window.addEventListener('resize', updateBar);
