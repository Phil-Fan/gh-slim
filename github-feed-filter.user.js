// ==UserScript==
// @name         gh-slim
// @namespace    gh-slim
// @version      2.1
// @description  在 GitHub Feed 的 Filter 菜单下增加自定义开关，隐藏PR记录
// @author       PhilFan
// @match        https://github.com/feed
// @match        https://github.com/
// @match        https://github.com/dashboard*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const KEY = 'gh_slim';

  const TYPES = {
    pr: { title: 'PR contributions', desc: 'Hide "contributed to" cards', icon: '.octicon-git-pull-request' },
    star: { title: 'Starred repos', desc: 'Hide "starred" cards', icon: '.octicon-star' },
    trending: { title: 'Trending repos', desc: 'Hide trending cards', icon: '.octicon-graph' },
    recommended: { title: 'Recommended repos', desc: 'Hide recommended cards', icon: '.octicon-heart' },
  };

  const keys = Object.keys(TYPES);
  const cfg = Object.fromEntries(keys.map(k => [k, true]));
  try { Object.assign(cfg, JSON.parse(GM_getValue(KEY, '{}') || '{}')); } catch {}

  function classify(item) {
    const h = item.querySelector('h3')?.textContent || '';
    if (h.includes('contributed to') && item.querySelector('a[href*="/pull/"]')) return 'pr';
    if (h.includes('starred') && h.includes('repositories')) return 'star';
    if (h.includes('Trending repositories')) return 'trending';
    if (h.includes('Recommended for you')) return 'recommended';
    return null;
  }

  function apply() {
    document.querySelectorAll('article.js-feed-item-component').forEach(item => {
      const type = classify(item);
      if (!type) return;
      if (cfg[type]) item.style.removeProperty('display');
      else item.style.setProperty('display', 'none', 'important');
    });
  }

  function save() { GM_setValue(KEY, JSON.stringify(cfg)); }

  function icon(sel) {
    const el = document.querySelector(sel);
    return el ? el.cloneNode(true).outerHTML.replace(/id="[^"]*"/g, '') : '';
  }

  function inject() {
    if (document.getElementById('gh-slim')) return;
    const nativeList = document.querySelector('.feed-filter-menu-body .SelectMenu-list');
    if (!nativeList) return;

    const section = document.createElement('div');
    section.id = 'gh-slim';
    section.className = 'border-top pt-2 mt-2';
    section.innerHTML = '<div class="tmp-px-3 mt-2"><h5>gh-slim</h5></div>';

    Object.entries(TYPES).forEach(([key, { title, desc, icon: sel }]) => {
      const label = document.createElement('label');
      label.className = 'd-flex pl-0 my-2 tmp-px-3 flex-column flex-items-start text-normal SelectMenu-item';
      label.innerHTML = `
        <div class="d-flex flex-items-center">
          <input type="checkbox" data-key="${key}" ${cfg[key] ? 'checked' : ''}>
          ${icon(sel)}
          <h5 class="d-flex flex-items-center ml-1">${title}</h5>
        </div>
        <span class="small color-fg-muted mt-1" style="margin-left:21px">${desc}</span>
      `;
      label.querySelector('input').addEventListener('change', e => {
        cfg[key] = e.target.checked;
        save();
        apply();
      });
      section.appendChild(label);
    });

    nativeList.parentElement.insertBefore(section, nativeList.nextSibling);
  }

  function init() {
    apply();
    inject();
    const feed = document.querySelector('.js-for-you-feed-items, .news');
    if (feed) new MutationObserver(apply).observe(feed, { childList: true, subtree: true });
    const details = document.getElementById('feed-filter-menu');
    if (details) details.addEventListener('toggle', () => details.open && inject());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('turbo:load', init);
})();
