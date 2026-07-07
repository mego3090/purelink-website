/**
 * Floating support chat for the marketing site (all pages, en + ar).
 *
 * Two modes:
 *
 * 1. Crisp live chat — create a free workspace at https://crisp.chat, copy the
 *    Website ID (Crisp → Settings → Workspace Settings → Setup & Integrations)
 *    and paste it into CRISP_WEBSITE_ID below. The official widget then loads
 *    in the page's language and this file's fallback UI is skipped.
 *    NOTE: enabling Crisp sends visitor chat data to Crisp IM SAS (EU-hosted) —
 *    add them as a processor in privacy.html / privacy-ar.html before enabling.
 *
 * 2. Email fallback (default, no third parties) — a "Need help?" bubble that
 *    opens a small card with a mailto button, styled from the site's CSS
 *    variables. Works out of the box.
 */
(function () {
  'use strict';

  var CRISP_WEBSITE_ID = '218bdd6b-711c-4d17-890d-d9cdc9af5457'; // set '' to fall back to the email bubble
  var SUPPORT_EMAIL = 'ahmed.magdy@purelinkchemicals.com';

  var isArabic = (document.documentElement.lang || 'en').indexOf('ar') === 0;

  /* ── Mode 1: official Crisp embed ─────────────────────────────────────── */
  if (CRISP_WEBSITE_ID) {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
    window.CRISP_RUNTIME_CONFIG = { locale: isArabic ? 'ar' : 'en' };
    var loader = document.createElement('script');
    loader.src = 'https://client.crisp.chat/l.js';
    loader.async = true;
    document.head.appendChild(loader);
    return;
  }

  /* ── Mode 2: email bubble fallback ────────────────────────────────────── */
  var t = isArabic
    ? {
        launcher: 'محادثة الدعم',
        close: 'إغلاق',
        title: 'تحتاج مساعدة؟',
        body: 'فريقنا هنا من أجلك. راسلنا عبر البريد الإلكتروني وسنرد عليك في أقرب وقت ممكن.',
        emailUs: 'راسلنا عبر البريد'
      }
    : {
        launcher: 'Support chat',
        close: 'Close',
        title: 'Need help?',
        body: "Our team is here for you. Email us and we'll get back to you as soon as possible.",
        emailUs: 'Email us'
      };

  var CHAT_ICON =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var CLOSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var MAIL_ICON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

  var style = document.createElement('style');
  style.textContent =
    '.plsc-launcher{position:fixed;inset-block-end:24px;inset-inline-end:24px;z-index:9999;' +
    'width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;' +
    'background:var(--primary,#0D6B5E);color:#fff;display:flex;align-items:center;justify-content:center;' +
    'box-shadow:var(--shadow-primary,0 6px 20px rgba(13,107,94,.25));' +
    'transition:transform .15s ease,background .15s ease;}' +
    '.plsc-launcher:hover{background:var(--primary-dark,#095349);transform:scale(1.05);}' +
    '.plsc-card{position:fixed;inset-block-end:96px;inset-inline-end:24px;z-index:9999;' +
    'width:min(340px,calc(100vw - 32px));background:var(--white,#fff);overflow:hidden;' +
    'border-radius:var(--radius-md,12px);border:1px solid var(--border,#E5E7EB);' +
    'box-shadow:var(--shadow-lg,0 12px 40px rgba(0,0,0,.12));font-family:inherit;}' +
    '.plsc-card[hidden]{display:none;}' +
    '.plsc-head{background:var(--primary,#0D6B5E);color:#fff;padding:20px;}' +
    '.plsc-head-top{display:flex;align-items:flex-start;justify-content:space-between;}' +
    '.plsc-close{background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;padding:2px;}' +
    '.plsc-close:hover{color:#fff;}' +
    '.plsc-title{font-size:18px;font-weight:600;margin:12px 0 0;}' +
    '.plsc-body{padding:20px;}' +
    '.plsc-text{font-size:14px;color:var(--text-light,#666);line-height:1.5;margin:0 0 16px;}' +
    '.plsc-mail{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;' +
    'background:var(--primary,#0D6B5E);color:#fff;text-decoration:none;font-size:14px;font-weight:500;' +
    'border-radius:var(--radius-sm,6px);padding:11px 16px;transition:background .15s ease;}' +
    '.plsc-mail:hover{background:var(--primary-dark,#095349);}' +
    '.plsc-addr{font-size:12px;color:var(--text-muted,#999);text-align:center;margin:12px 0 0;direction:ltr;}';
  document.head.appendChild(style);

  var card = document.createElement('div');
  card.className = 'plsc-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', t.title);
  card.hidden = true;
  card.innerHTML =
    '<div class="plsc-head">' +
    '<div class="plsc-head-top">' + CHAT_ICON +
    '<button type="button" class="plsc-close" aria-label="' + t.close + '">' + CLOSE_ICON + '</button>' +
    '</div>' +
    '<h2 class="plsc-title">' + t.title + '</h2>' +
    '</div>' +
    '<div class="plsc-body">' +
    '<p class="plsc-text">' + t.body + '</p>' +
    '<a class="plsc-mail" href="mailto:' + SUPPORT_EMAIL + '">' + MAIL_ICON + t.emailUs + '</a>' +
    '<p class="plsc-addr">' + SUPPORT_EMAIL + '</p>' +
    '</div>';

  var launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'plsc-launcher';
  launcher.setAttribute('aria-label', t.launcher);
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = CHAT_ICON;

  function setOpen(open) {
    card.hidden = !open;
    launcher.innerHTML = open ? CLOSE_ICON : CHAT_ICON;
    launcher.setAttribute('aria-expanded', String(open));
  }

  launcher.addEventListener('click', function () {
    setOpen(card.hidden);
  });
  card.querySelector('.plsc-close').addEventListener('click', function () {
    setOpen(false);
  });

  document.body.appendChild(card);
  document.body.appendChild(launcher);
})();
