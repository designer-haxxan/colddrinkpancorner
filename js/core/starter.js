// Starter items for a cold drink + paan shop in Pakistan. Prices are SAMPLE values in Rs (not verified
// market prices): the owner must review them in Items after loading. Loading never overwrites an
// existing item with the same name, so it is safe to press more than once.
// Stock tracking is OFF by default: with no opening stock, a tracked item would refuse every sale
// ("Insufficient stock"). The owner can turn tracking on per item in Items, after entering stock.
import { lc } from './utils.js';
import * as Catalog from '../services/catalog.js';
import * as Posting from '../services/posting.js';

export const STARTER_CATEGORIES = ['Cold Drinks', 'Water & Ice', 'Paan', 'Snacks & Biscuits', 'Dairy', 'Mobile Load', 'Other'];

// [name, nameUr, category, emoji, salePrice, purchasePrice, options]
const RAW = [
  ['Coca-Cola 250ml', 'کوکا کولا 250ml', 'Cold Drinks', '🥤', 60, 50],
  ['Coca-Cola 500ml', 'کوکا کولا 500ml', 'Cold Drinks', '🥤', 100, 88],
  ['Coca-Cola 1.5L', 'کوکا کولا 1.5 لیٹر', 'Cold Drinks', '🥤', 180, 160],
  ['Pepsi 250ml', 'پیپسی 250ml', 'Cold Drinks', '🥤', 60, 50],
  ['Pepsi 500ml', 'پیپسی 500ml', 'Cold Drinks', '🥤', 100, 88],
  ['Pepsi 1.5L', 'پیپسی 1.5 لیٹر', 'Cold Drinks', '🥤', 180, 160],
  ['Sprite 500ml', 'سپرائٹ 500ml', 'Cold Drinks', '🍋', 100, 88],
  ['7UP 500ml', 'سیون اپ 500ml', 'Cold Drinks', '🍋', 100, 88],
  ['Fanta 500ml', 'فانٹا 500ml', 'Cold Drinks', '🍊', 100, 88],
  ['Pakola 1.5L', 'پاکولا 1.5 لیٹر', 'Cold Drinks', '🥤', 170, 150],
  ['Sting 250ml', 'اسٹنگ 250ml', 'Cold Drinks', '⚡', 120, 100],
  ['Mineral water 500ml', 'منرل واٹر 500ml', 'Water & Ice', '💧', 40, 30],
  ['Mineral water 1.5L', 'منرل واٹر 1.5 لیٹر', 'Water & Ice', '💧', 80, 65],
  ['Ice bag', 'برف کا تھیلا', 'Water & Ice', '🧊', 50, 30],
  ['Meetha paan', 'میٹھا پان', 'Paan', '🌿', 50, 25],
  ['Saada paan', 'سادہ پان', 'Paan', '🍃', 40, 20],
  ['Chips small', 'چپس چھوٹا', 'Snacks & Biscuits', '🍟', 30, 22],
  ['Chips large', 'چپس بڑا', 'Snacks & Biscuits', '🍟', 100, 80],
  ['Biscuit packet', 'بسکٹ پیکٹ', 'Snacks & Biscuits', '🍪', 50, 40],
  ['Matchbox', 'ماچس', 'Other', '🔥', 5, 3],
  ['Milk pack 1L', 'دودھ پیک 1 لیٹر', 'Dairy', '🥛', 230, 215],
  ['Mobile load 100', 'موبائل لوڈ 100', 'Mobile Load', '📱', 100, 100, { trackStock: false }],
  ['Mobile load 500', 'موبائل لوڈ 500', 'Mobile Load', '📱', 500, 500, { trackStock: false }],
];

export const STARTER_PRODUCTS = RAW.map(([name, nameUr, category, emoji, salePrice, purchasePrice, opts = {}]) => ({
  name, nameUr, category, emoji, salePrice, purchasePrice, wholesalePrice: 0, unit: 'pcs', minStock: 5, trackStock: false, ...opts,
}));

// Adds missing categories and items. Returns the number of items added.
export async function loadStarterItems() {
  const catIds = new Map(Catalog.allCategories().map((c) => [lc(c.name), c.id]));
  for (const name of STARTER_CATEGORIES) {
    if (!catIds.has(lc(name))) catIds.set(lc(name), await Posting.saveCategory({ name }));
  }
  const existing = new Set(Catalog.allProducts().map((p) => lc(p.name)));
  let added = 0;
  for (const p of STARTER_PRODUCTS) {
    if (existing.has(lc(p.name))) continue;
    await Posting.saveProduct({ ...p, categoryId: catIds.get(lc(p.category)) || '', openingStock: 0, active: true });
    added++;
  }
  return added;
}
