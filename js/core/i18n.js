// Bilingual UI: English and Urdu. The choice is per device (pref 'lang'). Urdu switches the page to
// right-to-left, swaps Bootstrap to its RTL stylesheet, and shows Urdu product names where they exist.
import { pref } from './settings.js';
import { EN } from '../i18n/en.js';
import { UR } from '../i18n/ur.js';

const DICT = { en: EN, ur: UR };
const BS_LTR = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
const BS_RTL = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';

export const LANGS = ['en', 'ur'];
let current = 'en';

export const lang = () => current;
export const isUrdu = () => current === 'ur';

// Translate a key. {name} placeholders are filled from vars. Missing Urdu keys fall back to English.
export function t(key, vars = {}) {
  const s = DICT[current][key] ?? EN[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
}

// Product display name in the current language (Urdu name when the product has one).
export const itemName = (p) => (current === 'ur' && p?.nameUr ? p.nameUr : p?.name || '');

function apply() {
  const root = document.documentElement;
  root.lang = current;
  root.dir = current === 'ur' ? 'rtl' : 'ltr';
  document.body?.classList.toggle('is-urdu', current === 'ur');
  const css = document.getElementById('bs-css');
  if (css) css.href = current === 'ur' ? BS_RTL : BS_LTR;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.title = t('app.title');
  root.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', t('app.short'));
}

export function initLang() {
  const v = pref.get('lang', 'en');
  current = LANGS.includes(v) ? v : 'en';
  apply();
}

export function setLang(next) {
  if (!LANGS.includes(next) || next === current) return;
  pref.set('lang', next);
  current = next;
  apply();
  document.dispatchEvent(new CustomEvent('lang:changed', { detail: next }));
}

export const toggleLang = () => setLang(current === 'en' ? 'ur' : 'en');
