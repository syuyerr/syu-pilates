/* ----------------------------------------------------------
   Контакты: поменяйте здесь — обновятся все кнопки на сайте.
   ---------------------------------------------------------- */
const CONTACTS = {
  telegram: 'syu_curly',     // ник в Telegram без @
  vk: 'mrrs13',              // короткое имя страницы ВКонтакте
};

/* Тарифы: label — подпись в окне записи,
   what — что подставить во фразу «Хочу записаться на …». */
const PLANS = {
  diag: { label: 'Бесплатная диагностика', what: 'бесплатную диагностику' },
  single: { label: 'Разовое занятие', what: 'разовое занятие' },
  pack4: { label: 'Пакет из 4 занятий', what: 'пакет из 4 занятий' },
  pack8: { label: 'Пакет из 8 занятий', what: 'пакет из 8 занятий' },
  question: { label: 'Вопрос о занятиях', message: 'Здравствуйте, Сью! У меня вопрос о занятиях.' },
};
const DEFAULT_PLAN = 'diag';

function messageFor(key) {
  const plan = PLANS[key] || PLANS[DEFAULT_PLAN];
  return plan.message || `Здравствуйте, Сью! Хочу записаться на ${plan.what}.`;
}

function linkFor(messenger, message) {
  switch (messenger) {
    case 'telegram': return `https://t.me/${CONTACTS.telegram}?text=${encodeURIComponent(message)}`;
    case 'vk': return `https://vk.ru/${CONTACTS.vk}`;
  }
  return '#contact';
}

function setLinks(root, key) {
  const message = messageFor(key);
  root.querySelectorAll('[data-messenger]').forEach((a) => {
    a.href = linkFor(a.dataset.messenger, message);
    a.dataset.message = message;
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

document.querySelectorAll('[data-book]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = PLANS[btn.dataset.plan] ? btn.dataset.plan : DEFAULT_PLAN;
    planLabel.textContent = PLANS[key].label;
    setLinks(dialog, key);

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

/* ---------- Копирование текста сообщения ----------
   ВКонтакте не умеет подставлять текст по ссылке, а Telegram —
   не во всех приложениях. Поэтому текст заранее копируем в буфер. */

const toast = document.querySelector('.toast');
let toastTimer;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 5000);
}

document.querySelectorAll('[data-messenger]').forEach((a) => {
  a.addEventListener('click', () => {
    if (a.closest('dialog')) dialog.close();
    const message = a.dataset.message;
    if (!message || !navigator.clipboard) return;
    navigator.clipboard.writeText(message)
      .then(() => showToast('Текст сообщения скопирован — если он не появился в чате, просто вставьте его.'))
      .catch(() => {});
  });
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
