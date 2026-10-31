/*
 * MY PORTAL — CLASSROOM DEMO
 * Not an official government system or an identity credential.
 * All demo data is stored in this device's browser storage.
 */
(() => {
  'use strict';
  const STORAGE_KEY = 'classroom-portal-demo-v1';
  const defaults = {
    profileName: 'Б. Тэмүүлэн',
    email: 'student@example.com',
    avatar: '',
    noticeCount: '6',
    noticeText: 'үйлчилгээ авч дараах хэмнэлтийг хийсэн байна.',
    familyName: 'Бат',
    givenName: 'Тэмүүлэн',
    birthDate: '2001-08-15',
    gender: 'Эрэгтэй',
    registration: 'DEMO-РД-0000',
    idNumber: 'DEMO-000001',
    issueDate: '2026-01-01',
    expiryDate: '2031-01-01',
    address: 'Улаанбаатар хот — жишээ хаяг',
    phone: '0000 0000',
    cardTitle: 'ХУВИЙН МЭДЭЭЛЛИЙН КАРТ',
    cardSubtitle: 'PERSONAL INFORMATION CARD · SAMPLE',
    studentCardTitle: 'ОЮУТНЫ КАРТ · ДЕМО',
    university: 'Жишээ их сургууль',
    program: 'Программ хангамж',
    studentNumber: 'STUDENT-DEMO-001',
    enrollmentYear: '2025',
    accent: '#1558ea',
    history: [],
    feedback: []
  };
  const keys = Object.keys(defaults).filter(k => !['history','feedback'].includes(k));
  const app = document.getElementById('app');
  const overlay = document.getElementById('overlay-root');
  const toastEl = document.getElementById('toast');
  let toastTimer;
  let route = 'profile';
  let currentSheet = null;
  let currentDoc = 'identity';
  let currentSide = 'front';
  let pendingPhoto = '';
  let state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const clean = { ...defaults };
      for (const key of keys) {
        if (typeof saved[key] === 'string') clean[key] = saved[key].slice(0, 300000);
      }
      for (const key of ['history','feedback']) {
        if (Array.isArray(saved[key])) clean[key] = saved[key].filter(s => s && typeof s.title === 'string').slice(-40);
      }
      return clean;
    } catch { return { ...defaults }; }
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      toast('Хадгалах зай хүрэлцэхгүй байна. Зургийн хэмжээг багасгана уу.');
      return false;
    }
  }
  function e(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  }
  function d(value) { return String(value || '—').replaceAll('-', '.'); }
  function setAccent(){
    if (/^#[0-9a-fA-F]{6}$/.test(state.accent)) document.documentElement.style.setProperty('--blue', state.accent);
  }
  function toast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 2700);
  }
  function icon(name) {
    const paths = {
      home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
      file:'<path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v6h6M8 13h8M8 17h7"/>',
      scan:'<rect x="8" y="8" width="8" height="8" rx="2"/><path d="M9 3H7a4 4 0 0 0-4 4v2m12-6h2a4 4 0 0 1 4 4v2M3 15v2a4 4 0 0 0 4 4h2m12-6v2a4 4 0 0 1-4 4h-2"/>',
      wallet:'<path d="M3 7h17a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h13"/><path d="M22 12h-6a2 2 0 0 0 0 4h6"/>',
      user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
      pencil:'<path d="m3 17 1 4 4-1L20 8l-5-5L3 17z"/><path d="m13 5 5 5"/>',
      settings:'<circle cx="12" cy="12" r="3"/><path d="M19 13a7 7 0 0 0 0-2l2-2-2-3-3 1a7 7 0 0 0-2-1l-1-3H9L8 6a7 7 0 0 0-2 1L3 6 1 9l2 2a7 7 0 0 0 0 2l-2 2 2 3 3-1a7 7 0 0 0 2 1l1 3h4l1-3a7 7 0 0 0 2-1l3 1 2-3z"/>',
      download:'<path d="M12 3v13m-5-5 5 5 5-5M4 19h16"/>',
      upload:'<path d="M12 19V5m-5 5 5-5 5 5M4 19h16"/>',
      check:'<path d="m4 12 5 5L20 6"/>',
      shield:'<path d="M12 2 4 6v6c0 6 4 9 8 10 4-1 8-4 8-10V6z"/><path d="m8 12 3 3 5-6"/>',
      arrow:'<path d="m9 18 6-6-6-6"/>',
      back:'<path d="m15 18-6-6 6-6"/>',
      info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v.5"/>',
      clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
      heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
      link:'<path d="M10 13a5 5 0 0 0 8 .5l3-3a5 5 0 0 0-7-7l-2 2"/><path d="M14 11a5 5 0 0 0-8-.5l-3 3a5 5 0 0 0 7 7l2-2"/>',
      refresh:'<path d="M3 12a9 9 0 0 1 15-7l3 3V2M21 12a9 9 0 0 1-15 7l-3-3v6"/>',
      help:'<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 1-1.5 1.3-1.5 3M12 18h.01"/>'
    };
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.info}</svg>`;
  }
  const face = `<svg viewBox="0 0 100 120" aria-hidden="true"><circle cx="50" cy="38" r="24"/><path d="M1 119c2-40 25-48 49-48s47 8 49 48Z"/></svg>`;
  function avatar() {return `<span class="avatar">${state.avatar ? `<img alt="" src="${e(state.avatar)}">` : icon('user')}</span>`;}
  function card(doc='identity', side='front') {
    const isStudent = doc === 'student';
    const title = isStudent ? state.studentCardTitle : state.cardTitle;
    const subtitle = isStudent ? 'STUDENT CARD · CLASSROOM SAMPLE' : state.cardSubtitle;
    const fields = isStudent ? [
      ['Овог, нэр', `${state.familyName} ${state.givenName}`],
      ['Сургуулийн нэр', state.university],
      ['Мэргэжил', state.program],
      ['Оюутны дугаар', state.studentNumber],
      ['Элссэн он', state.enrollmentYear]
    ] : [
      ['Овог / Family name', state.familyName],
      ['Нэр / Given name', state.givenName],
      ['Хүйс / Sex', state.gender],
      ['Төрсөн өдөр', d(state.birthDate)],
      ['Демо картын дугаар', state.idNumber]
    ];
    if (side === 'back') {
      return `<div class="id-card back" aria-label="Демо картын ар тал">
       <div class="card-top"><span class="card-symbol">D</span><div><div class="card-title">${e(title)}</div><div class="card-subtitle">${e(subtitle)}</div></div></div>
       <div class="back-content"><div class="back-details"><b>Зөвхөн сургалтын загвар</b><div>Нэр: ${e(state.familyName)} ${e(state.givenName)}</div><div>${isStudent ? 'Оюутны дугаар' : 'Демо бүртгэл'}: ${e(isStudent ? state.studentNumber : state.registration)}</div><div>Огноо: ${e(d(state.issueDate))}</div><div>Энэ карт таних, нотлох хэрэгсэл биш.</div></div><div class="back-seal">SAMPLE<br>ONLY</div></div>
       <div class="card-footer"><span>CLASSROOM PROJECT</span><span>NOT VALID ID</span></div><div class="card-watermark">DEMO</div></div>`;
    }
    return `<div class="id-card" aria-label="Демо картын нүүр тал">
     <div class="card-top"><span class="card-symbol">D</span><div><div class="card-title">${e(title)}</div><div class="card-subtitle">${e(subtitle)}</div></div></div>
     <div class="card-main"><div class="portrait">${state.avatar ? `<img alt="" src="${e(state.avatar)}">` : face}</div><div class="card-fields">${fields.map(([k,v])=>`<div class="card-field"><div class="card-label">${e(k)}</div><div class="card-value">${e(v)}</div></div>`).join('')}</div><div class="card-side"><div class="circuit"></div></div></div>
     <div class="card-footer"><span>СУРГАЛТЫН ЗАГВАР</span><span>NOT VALID ID</span></div><div class="card-watermark">DEMO</div></div>`;
  }
  const menuItems = [
    ['info','🪪','Төрд байгаа миний мэдээлэл','orange'],
    ['wallet','💳','Цахим хэтэвч','teal'],
    ['history','🕒','Үйлчилгээний түүх','blue'],
    ['mail','📨','Үндэсний шуудан','orange'],
    ['thanks','💜','Талархал','lilac'],
    ['survey','🧩','Санал асуулга','green'],
    ['feedback','📬','Өргөдөл, гомдол','teal'],
    ['verify','🛡️','Баталгаажуулалт','blue'],
    ['logout','🚪','Системээс гарах','pink']
  ];
  function menuLink([id,emoji,label,tone]) {
    return `<button class="menu-link" type="button" data-action="menu" data-id="${id}"><span class="menu-icon tone-${tone}">${emoji}</span><span class="label">${label}</span><span class="mini-chevron">›</span></button>`;
  }
  function heading(title,action,actionLabel){
    return `<div class="section-heading"><h2>${title}</h2>${action ? `<button class="small-button" data-action="${action}">${actionLabel}</button>` : ''}</div>`;
  }
  function demoWarning(){ return `<p class="muted-note">Энэ бол хичээлийн зориулалттай <strong>DEMO</strong> загвар. Албан ёсны баримт, баталгаажуулалт, төрийн үйлчилгээ биш.</p>`; }
  function profilePage(){
    return `<section class="header-card">
       <button class="profile-line" data-action="edit" aria-label="Хувийн мэдээллээ өөрчлөх">${avatar()}<span class="profile-copy"><span class="profile-name">${e(state.profileName)}</span><span class="profile-email">${e(state.email)}</span></span><span class="chevron">›</span></button>
       <div class="header-tip"><span>Та нийт <strong>${e(state.noticeCount)}</strong> ${e(state.noticeText)}</span><button class="tip-dot" data-action="tip" aria-label="Дэлгэрэнгүй">⌄</button><span class="tip-bg"></span></div>
     </section>
     ${heading('Миний бичиг баримтууд','refresh','Шинэчлэх')}
     <div class="document-track" aria-label="Демо бичиг баримтууд">
       <button class="doc-touch" data-action="card" data-doc="identity">${card('identity')}</button>
       <button class="doc-touch" data-action="card" data-doc="student">${card('student')}</button>
     </div>
     <div class="action-row"><button class="pill-action" data-action="navigate" data-route="documents">Бүх бичиг баримтыг харах</button></div>
     <div class="menu-panel">${menuItems.slice(0,2).map(menuLink).join('')}</div>
     <div class="menu-panel">${menuItems.slice(2,8).map(menuLink).join('')}</div>
     <div class="menu-panel">${menuItems.slice(8).map(menuLink).join('')}</div>
     ${demoWarning()}`;
  }
  function homePage(){
    return `<h1 class="page-heading">Сайн байна уу, ${e(state.givenName)}!</h1><p class="page-sub">Таны сургалтын демо портал. Бүх мэдээллийг өөрөө өөрчлөх боломжтой.</p>
      <div class="panel"><div class="row-between"><div><span class="tag">DEMO APP</span><h3 style="margin-top:11px">Миний профайл</h3><p>${e(state.profileName)} · ${e(state.email)}</p></div>${avatar()}</div>
      <div class="button-stack"><button class="big-button" data-action="navigate" data-route="profile">Профайл харах</button><button class="big-button soft" data-action="edit">Мэдээлэл засах</button></div></div>
      ${heading('Хурдан хандах')}
      <div class="menu-panel">${[menuItems[0],menuItems[1],menuItems[2],menuItems[5]].map(menuLink).join('')}</div>${demoWarning()}`;
  }
  function docsPage(){
    return `<h1 class="page-heading">Миний бичиг баримтууд</h1><p class="page-sub">Карт бүрийг дарж урд, ар талыг үзээрэй.</p>
      <div class="doc-list"><button class="doc-touch" data-action="card" data-doc="identity">${card('identity')}</button><button class="doc-touch" data-action="card" data-doc="student">${card('student')}</button></div>
      <div class="panel"><div class="button-stack"><button class="big-button" data-action="edit">Картын мэдээлэл засах</button></div></div>${demoWarning()}`;
  }
  function fieldLine(label,value){return `<div class="field-line"><span>${e(label)}</span><b>${e(value || '—')}</b></div>`;}
  function infoPage(){
    const lines = [
      ['Дэлгэцийн нэр',state.profileName],['Имэйл',state.email],['Овог',state.familyName],['Нэр',state.givenName],['Төрсөн огноо',d(state.birthDate)],['Хүйс',state.gender],
      ['Демо бүртгэл',state.registration],['Картын дугаар',state.idNumber],['Олгосон огноо',d(state.issueDate)],['Дуусах огноо',d(state.expiryDate)],['Хаяг',state.address],['Утас',state.phone]
    ];
    return `<h1 class="page-heading">Миний мэдээлэл</h1><p class="page-sub">Энд зөвхөн таны оруулсан жишээ мэдээлэл харагдана.</p><div class="panel">${lines.map(([a,b])=>fieldLine(a,b)).join('')}<div class="button-stack"><button class="big-button" data-action="edit">Мэдээллээ өөрчлөх</button></div></div>${demoWarning()}`;
  }
  function walletPage(){return `<h1 class="page-heading">Цахим хэтэвч</h1><p class="page-sub">Сургалтын төслийн жишээ хэтэвч.</p><div class="panel"><span class="tag">ЖИШЭЭ КАРТ</span><h3 style="margin:15px 0">${e(state.profileName)}</h3>${fieldLine('Демо дугаар',state.idNumber)}${fieldLine('Төлөв','Жишээ / Идэвхгүй')}<div class="button-stack"><button class="big-button soft" data-action="card" data-doc="student">Оюутны картаа харах</button></div></div>${demoWarning()}`;}
  function historyPage(){
    const items = state.history || [];
    return `<h1 class="page-heading">Үйлчилгээний түүх</h1><p class="page-sub">Демо дотор хийсэн үйлдлүүдийн локал жагсаалт.</p>
      <div class="panel">${items.length ? items.slice().reverse().map(item=>`<div class="field-line"><span>${e(item.date||'')}</span><b>${e(item.title)}</b></div>`).join('') : `<div class="empty-state">Одоогоор бүртгэл алга.</div>`}
      <div class="button-stack"><button class="big-button soft" data-action="add-history">Жишээ үйлдэл нэмэх</button></div></div>${demoWarning()}`;
  }
  function mailPage(){return `<h1 class="page-heading">Үндэсний шуудан</h1><p class="page-sub">Албан системтэй холбогдоогүй сургалтын дэлгэц.</p><div class="panel"><h3>Тавтай морил</h3><p>Энэ нь зөвхөн загвар шуудангийн хэсэг. Бодит зурвас авах, илгээхгүй.</p></div>${demoWarning()}`;}
  function verifyPage(){return `<h1 class="page-heading">Баталгаажуулалт</h1><p class="page-sub">Демо системийн тайлбар.</p><div class="panel"><h3>Бодит баталгаажуулалт хийгдэхгүй</h3><p>Энд байгаа карт, нэр, дугаар, зураг, бусад мэдээлэл нь хэрэглэгчийн өөрөө оруулсан өгөгдөл юм. Албан ёсны үнэмлэх, цахим гарын үсэг, QR баталгаажуулалт үүсгэхгүй.</p></div>${demoWarning()}`;}
  function settingsPage(){return `<h1 class="page-heading">Тохиргоо</h1><p class="page-sub">Демо өгөгдөл зөвхөн энэ төхөөрөмж дээр хадгалагдана.</p>
    <button class="setting-tile" data-action="edit">${icon('pencil')}<span class="setting-text">Бүх мэдээллийг засах</span>${icon('arrow')}</button>
    <button class="setting-tile" data-action="export">${icon('download')}<span class="setting-text">Өгөгдлөө JSON файлаар хадгалах</span>${icon('arrow')}</button>
    <button class="setting-tile" data-action="import">${icon('upload')}<span class="setting-text">JSON файлаас сэргээх</span>${icon('arrow')}</button>
    <button class="setting-tile" data-action="reset-confirm">${icon('refresh')}<span class="setting-text">Анхны демо мэдээлэл рүү буцаах</span>${icon('arrow')}</button>
    <input id="json-import" type="file" accept="application/json,.json" style="display:none" aria-label="JSON файл сонгох">
    ${demoWarning()}<p class="tiny">LocalStorage ашигладаг: Safari, Home Screen app, өөр төхөөрөмж болон өөр хөтөч хооронд мэдээлэл автоматаар синхрончлогдохгүй. Нөөц хуулбар үүсгэхдээ JSON экспорт ашиглана уу.</p>`;}
  function servicesPage(){return `<h1 class="page-heading">Үйлчилгээ</h1><p class="page-sub">Туршилтын хэсгүүд. Албан үйлчилгээ үзүүлэхгүй.</p><div class="menu-panel">${menuItems.slice(0,8).map(menuLink).join('')}</div>${demoWarning()}`;}
  function extrasPage(){return `<h1 class="page-heading">Нэмэлт</h1><p class="page-sub">Танд хэрэгтэй демо функцууд.</p><div class="menu-panel">${[menuItems[2],menuItems[5],menuItems[6],menuItems[7]].map(menuLink).join('')}</div><div class="panel"><button class="big-button soft" data-action="navigate" data-route="settings">Тохиргоо</button></div>${demoWarning()}`;}
  function bottomNav(){
    const items = [['home','Нүүр','home'],['services','Үйлчилгээ','file'],['scan','Скан','scan'],['extras','Нэмэлт','wallet'],['profile','Профайл','user']];
    return `<nav class="bottom-nav" aria-label="Үндсэн цэс"><div class="nav-inner">${items.map(([id,label,ic]) => {
      if (id === 'scan') return `<button class="nav-btn" aria-label="QR демо" data-action="scan"><span class="nav-scan">${icon('scan')}</span></button>`;
      return `<button class="nav-btn ${route===id||(route==='settings'&&id==='profile')?'active':''}" data-action="navigate" data-route="${id}">${icon(ic)}<span>${label}</span></button>`;
    }).join('')}</div></nav>`;
  }
  function render(){
    setAccent();
    const pages = {profile:profilePage, home:homePage, documents:docsPage, info:infoPage, wallet:walletPage,history:historyPage,mail:mailPage,verify:verifyPage,settings:settingsPage,services:servicesPage,extras:extrasPage};
    const page = (pages[route] || profilePage)();
    app.innerHTML = `<main class="screen"><header class="topline"><div><span class="topbrand">Миний портал</span> <span class="demo-chip">DEMO / СУРГАЛТ</span></div><div class="top-actions"><button class="icon-button" data-action="edit" aria-label="Мэдээлэл засах">${icon('pencil')}</button><button class="icon-button" data-action="navigate" data-route="settings" aria-label="Тохиргоо">${icon('settings')}</button></div></header>${page}</main>${bottomNav()}`;
  }
  function openSheet(type,options={}){
    currentSheet = type;
    document.body.style.overflow = 'hidden';
    if (type==='card') {
      currentDoc=options.doc||'identity';currentSide=options.side||'front';
      return renderCardSheet();
    }
    if (type==='edit') {pendingPhoto=state.avatar;return renderEditSheet();}
    if (type==='feedback') return renderFeedbackSheet(options.kind || 'feedback');
    if (type==='tip') return renderNoticeSheet();
    if (type==='scan') return showMessageSheet('QR дэлгэц — DEMO', 'Энэ нь зөвхөн визуал загвар. QR код унших, үүсгэх, албан ёсны баталгаажуулалт хийхгүй.');
    if (type==='reset') return showMessageSheet('Мэдээллийг шинэчлэх үү?', 'Одоогийн оруулсан бүх демо өгөгдөл, зураг, түүхийг устгаж анхны жишээ рүү буцаана.', '<button class="big-button" data-action="reset-now">Тийм, шинэчлэх</button><button class="big-button ghost" data-action="close">Болих</button>');
  }
  function wrapSheet(inner){
    overlay.innerHTML = `<div class="overlay" data-action="close-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-label="Демо цонх">${inner}</section></div>`;
  }
  function sheetHeading(title,sub){return `<div class="sheet-title-row"><h2 class="sheet-title">${e(title)}</h2><button class="sheet-close" data-action="close" aria-label="Хаах">×</button></div>${sub?`<p class="sheet-sub">${e(sub)}</p>`:''}`;}
  function renderCardSheet(){
    wrapSheet(`${sheetHeading(currentDoc==='student'?'Оюутны карт':'Мэдээллийн карт','Сургалтын демо · Бодит үнэмлэх биш')}
    ${card(currentDoc,currentSide)}<div class="tabs"><button class="tab ${currentSide==='front'?'active':''}" data-action="side" data-side="front">Нүүр тал</button><button class="tab ${currentSide==='back'?'active':''}" data-action="side" data-side="back">Ар тал</button></div>
    <div class="button-stack"><button class="big-button" data-action="edit">Мэдээлэл засах</button><button class="big-button soft" data-action="close">Буцах</button></div>
    <p class="notice">DEMO • NOT VALID ID — Энд харагдах бүх өгөгдөл нь хэрэглэгч өөрөө бичсэн жишээ мэдээлэл.</p>`);
  }
  function field(name,label,type='text',wide=false,extra='') {
    const value = state[name] ?? '';
    if (type === 'select') return `<div class="field ${wide?'wide':''}"><label for="f_${name}">${e(label)}</label><select id="f_${name}" name="${name}"><option ${value==='Эрэгтэй'?'selected':''}>Эрэгтэй</option><option ${value==='Эмэгтэй'?'selected':''}>Эмэгтэй</option><option ${value==='Бусад'?'selected':''}>Бусад</option></select></div>`;
    if(type === 'textarea') return `<div class="field ${wide?'wide':''}"><label for="f_${name}">${e(label)}</label><textarea id="f_${name}" name="${name}" maxlength="220">${e(value)}</textarea></div>`;
    return `<div class="field ${wide?'wide':''}"><label for="f_${name}">${e(label)}</label><input id="f_${name}" name="${name}" type="${type}" value="${e(value)}" maxlength="220" ${extra}></div>`;
  }
  function renderEditSheet(){
    wrapSheet(`${sheetHeading('Мэдээллээ өөрчлөх','Өөрчлөлтүүдийг хадгалахад бүх дэлгэц дээр шинэчлэгдэнэ.')}
    <form id="edit-form">
      <div class="form-section">Профайл</div>
      <div class="form-grid">${field('profileName','Профайлын нэр','text',true)}${field('email','Имэйл','email',true)}${field('noticeCount','Үйлчилгээний тоо','text')}${field('noticeText','Тайлбар','textarea',true)}</div>
      <div class="photo-upload">${avatar()}<div><label for="photo-input" style="font-size:13px;font-weight:750">Профайл / картын зураг</label><input id="photo-input" class="input-file" type="file" accept="image/*"><p class="photo-help">iPhone Photos-оос зураг сонгоно. Энэ төхөөрөмж дээр хадгална.</p><button type="button" class="small-button" data-action="remove-photo" style="background:#eef4fd;margin-top:7px">Зураг арилгах</button></div></div>
      <div class="form-section">Хувийн мэдээлэл</div>
      <div class="form-grid">${field('familyName','Овог')}${field('givenName','Нэр')}${field('birthDate','Төрсөн огноо','date')}${field('gender','Хүйс','select')}${field('registration','Бүртгэлийн демо дугаар','text',true)}${field('idNumber','Картын демо дугаар','text',true)}${field('issueDate','Олгосон огноо','date')}${field('expiryDate','Хүчинтэй огноо','date')}${field('address','Хаяг','textarea',true)}${field('phone','Утас','tel',true)}</div>
      <div class="form-section">Картын гарчиг</div>
      <div class="form-grid">${field('cardTitle','Картын гарчиг','text',true)}${field('cardSubtitle','Тайлбар','text',true)}</div>
      <div class="form-section">Оюутны карт</div>
      <div class="form-grid">${field('studentCardTitle','Картын гарчиг','text',true)}${field('university','Сургууль','text',true)}${field('program','Мэргэжил','text',true)}${field('studentNumber','Оюутны дугаар','text',true)}${field('enrollmentYear','Элссэн он')}</div>
      <div class="form-section">Өнгө</div><div class="form-grid">${field('accent','Үндсэн өнгө','color')}</div>
      <div class="form-bottom"><button class="big-button" type="submit">Өөрчлөлтийг хадгалах</button><button class="big-button ghost" style="margin-top:9px" type="button" data-action="close">Болих</button></div>
    </form><p class="notice">Сургалтын демо картууд дээрх DEMO тэмдэг өөрчлөгдөхгүй.</p>`);
  }
  function renderFeedbackSheet(kind){
    const title=kind==='survey'?'Санал асуулга':kind==='thanks'?'Талархал':'Өргөдөл, санал';
    wrapSheet(`${sheetHeading(title,'Демо форм — сервер рүү илгээхгүй.')}
      <form id="feedback-form" data-kind="${kind}"><div class="field"><label for="feedback-content">Таны бичих зүйл</label><textarea id="feedback-content" name="message" maxlength="1000" rows="4" placeholder="Энд бичнэ үү..." required style="height:115px"></textarea></div>
      <div class="button-stack"><button class="big-button" type="submit">Локалаар хадгалах</button><button class="big-button ghost" type="button" data-action="close">Болих</button></div></form>`);
  }
  function showMessageSheet(title,msg,buttons='<button class="big-button" data-action="close">Ойлголоо</button>'){
    currentSheet='message';
    wrapSheet(`${sheetHeading(title,'')}<p style="line-height:1.65;color:#566b85;margin:9px 0 20px">${e(msg)}</p><div class="button-stack">${buttons}</div>`);
  }
  function renderNoticeSheet(){showMessageSheet('Мэдээлэл — DEMO',`Та нийт ${state.noticeCount} ${state.noticeText} Энэ үзүүлэлтийг Засах хэсгээс өөрчилж болно.`);}
  function closeSheet(){ overlay.innerHTML='';currentSheet=null;document.body.style.overflow=''; }
  function navigate(next){closeSheet();route=next;render();window.scrollTo(0,0);}
  function menuClick(id){
    if(['info','wallet','history','mail','verify'].includes(id)) return navigate(id);
    if(id==='thanks'||id==='survey'||id==='feedback') return openSheet('feedback',{kind:id});
    if(id==='logout') return showMessageSheet('Демо горим', 'Энэ апп нэвтрэлт ашиглахгүй. Бүх өөрчлөлт зөвхөн таны төхөөрөмжид хадгалагдана.');
  }
  function addHistory(title){state.history.push({title,date:new Date().toLocaleString('mn-MN')});state.history=state.history.slice(-40);save();}
  function saveEdit(form){
    const fd = new FormData(form);
    state.avatar=pendingPhoto;
    for(const key of keys){
      if(key==='avatar')continue;
      if(fd.has(key)) state[key] = String(fd.get(key)||'').slice(0,220);
    }
    const ok = save();closeSheet();render();toast(ok?'Мэдээлэл хадгалагдлаа':'Хадгалах үед алдаа гарлаа');
  }
  async function compressPhoto(file){
    if(!file || !file.type.startsWith('image/')) throw new Error('Зургийн файл сонгоно уу.');
    if(file.size>15*1024*1024) throw new Error('15 МБ-ээс бага хэмжээтэй зураг сонгоно уу.');
    const blobUrl=URL.createObjectURL(file);
    try{
      const image = new Image();
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=blobUrl;});
      const max=540;let w=image.naturalWidth,h=image.naturalHeight;
      const scale=Math.min(1,max/Math.max(w,h));w=Math.round(w*scale);h=Math.round(h*scale);
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Зураг боловсруулах боломжгүй.');
      ctx.drawImage(image,0,0,w,h);
      return canvas.toDataURL('image/jpeg',.76);
    }finally{URL.revokeObjectURL(blobUrl);}
  }
  function exportState(){
    const data=new Blob([JSON.stringify({...state,exportedFrom:'Classroom Portal DEMO'},null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download='portal-demo-data.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    toast('JSON файл татах хүсэлт илгээгдлээ');
  }
  async function importState(file){
    if(!file)return;
    try{
      if(file.size>3000000) throw new Error('Файл хэт том байна.');
      const data=JSON.parse(await file.text());
      if(!data || typeof data !== 'object' || !('profileName' in data)) throw new Error('Демо өгөгдлийн файл биш байна.');
      const next={...defaults};
      keys.forEach(k=>{if(typeof data[k]==='string')next[k]=data[k].slice(0,300000);});
      if(next.avatar && !/^data:image\/(png|jpeg|webp);base64,/.test(next.avatar)) next.avatar='';
      for(const k of ['history','feedback'])if(Array.isArray(data[k]))next[k]=data[k].filter(v=>v&&typeof v.title==='string').slice(-40);
      state=next;if(save()){render();toast('Мэдээллийг амжилттай сэргээв');}
    } catch(err){toast(err.message||'JSON файл унших боломжгүй');}
  }
  app.addEventListener('click', event=>{
    const button=event.target.closest('[data-action]');if(!button)return;
    const action=button.dataset.action;
    if(action==='navigate')return navigate(button.dataset.route);
    if(action==='edit')return openSheet('edit');
    if(action==='card')return openSheet('card',{doc:button.dataset.doc});
    if(action==='refresh')return toast('Демо мэдээлэл шинэчлэгдсэн');
    if(action==='tip')return openSheet('tip');
    if(action==='menu')return menuClick(button.dataset.id);
    if(action==='scan')return openSheet('scan');
    if(action==='add-history'){addHistory('Демо үйлчилгээний хүсэлт');render();return toast('Жишээ түүх нэмэгдлээ');}
    if(action==='export')return exportState();
    if(action==='import')return document.getElementById('json-import')?.click();
    if(action==='reset-confirm')return openSheet('reset');
  });
  overlay.addEventListener('click',event=>{
    const target=event.target.closest('[data-action]');
    if(!target)return;
    const action=target.dataset.action;
    if(action==='close' || (action==='close-backdrop' && event.target===target))return closeSheet();
    if(action==='side'){currentSide=target.dataset.side;return renderCardSheet();}
    if(action==='edit')return openSheet('edit');
    if(action==='remove-photo'){pendingPhoto='';const img=overlay.querySelector('.photo-upload .avatar');if(img)img.innerHTML=icon('user');return toast('Хадгалах үед зураг арилна');}
    if(action==='reset-now'){state={...defaults,history:[],feedback:[]};save();closeSheet();route='profile';render();return toast('Анхны мэдээлэл сэргэлээ');}
  });
  overlay.addEventListener('submit',event=>{
    event.preventDefault();
    if(event.target.id==='edit-form')return saveEdit(event.target);
    if(event.target.id==='feedback-form'){
      const msg=new FormData(event.target).get('message');
      state.feedback.push({title:`${event.target.dataset.kind}: ${String(msg).slice(0,130)}`,date:new Date().toLocaleString('mn-MN')});
      state.feedback=state.feedback.slice(-40);
      addHistory('Демо санал хадгалсан');closeSheet();toast('Зөвхөн төхөөрөмж дээр хадгаллаа');
    }
  });
  overlay.addEventListener('change',async event=>{
    if(event.target.id==='photo-input'){
      try{
        const photo=await compressPhoto(event.target.files[0]);
        pendingPhoto=photo;
        toast('Зураг сонгогдлоо. Хадгалах товчийг дарна уу.');
        const img=overlay.querySelector('.photo-upload .avatar');
        if(img)img.innerHTML=`<img alt="" src="${e(photo)}">`;
      }catch(err){toast(err.message||'Зураг уншиж чадсангүй');}
    }
  });
  app.addEventListener('change',event=>{if(event.target.id==='json-import')importState(event.target.files[0]);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&currentSheet)closeSheet();});
  if('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
  render();
})();
