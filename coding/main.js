// Imports and application state

import { loadGLTF } from '../libs/loader.js';

import { TARGETS, UI, STORAGE_KEY, sanitizeProgress } from './content.js';

const THREE = window.MINDAR?.IMAGE?.THREE;

const $ = id => document.getElementById(id);

let language = 'en',
  progress = sanitizeProgress(null),
  storageOK = true;

try {
  progress = sanitizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));
  language = localStorage.getItem('labuan-language') === 'ms' ? 'ms' : 'en';
  document.body.classList.toggle('theme-modern', localStorage.getItem('labuan-theme') === 'modern');
} catch {
  storageOK = false;
}

const text = value => typeof value === 'string' ? value : value?.[language] || value?.en || '';

const t = key => text(UI[key]);

const escape = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);

let session = null,
  generation = 0,
  active = null,
  detail = null,
  chapter = 0,
  selection = -1,
  dialogKind = null;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const audioCache = new Map();

let currentAudio = null,
  audioRequest = 0;

// Shared interface helpers

function feedback(message) {
  $('feedback').textContent = message;
}

function setBusy(value) {
  $('start-ar').disabled = value;
  $('start-preview').disabled = value;
}

function translate() {
  document.documentElement.lang = language;
  $('lang-select').value = language;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  if (session) {
    $('mode-label').textContent = t(session.mode === 'ar' ? 'arMode' : 'previewMode');
    refresh();
    renderDetail();
  }
  if ($('journal-dialog').open) openDialog(dialogKind);
}

function refresh() {
  const available = !!active?.model;
  $('landmark-title').textContent = active ? active.target.id === 'labuanclocktower' ? t('clock') : active.target.name : t('waiting');
  $('collection-progress').textContent = active ? `${progress[active.target.id].seen.length} / ${active.target.points.length} ${t(active.target.floorDiscovery ? 'floors' : 'discoveries')}` : 'LABUAN LEGENDS';
  ['discover-btn', 'story-btn', 'challenge-btn', 'info-btn', 'replay-btn', 'reset-view', 'zoom-in', 'zoom-out'].forEach(id => $(id).disabled = !available);
  $('tracking-status').textContent = session?.mode === 'preview' ? t(active?.failed ? 'modelError' : active?.model ? 'previewMode' : 'loading') : active?.tracked ? active.model ? t('ready') : active.failed ? t('modelError') : t('loading') : t('scan');
  $('scan-guide').hidden = session?.mode !== 'ar' || !!active?.tracked;
  for (const entry of session?.entries || []) for (let i = 0; i < entry.buttons.length; i++) {
    const done = progress[entry.target.id].seen.includes(entry.target.points[i].key);
    entry.buttons[i].classList.toggle('done', done);
    entry.buttons[i].textContent = entry.target.floorDiscovery ? `F${i + 1}` : done ? '✓' : String(i + 1);
    entry.buttons[i].setAttribute('aria-label', `${i + 1}. ${text(entry.target.points[i].title)}${done ? ' · ' + t('earned') : ''}`);
  }
  $('target-picker').replaceChildren();
  const choices = (session?.entries || []).filter(e => session.mode === 'preview' || e.tracked);
  if (choices.length > 1) for (const e of choices) {
    const b = document.createElement('button');
    b.textContent = e.target.id === 'labuanclocktower' ? t('clock') : e.target.name;
    b.setAttribute('aria-pressed', String(e === active));
    b.disabled = e.failed;
    b.addEventListener('click', () => setActive(e));
    $('target-picker').appendChild(b);
  }
  updateAudio();
}

// Audio narration

function getAudio() {
  const src = active?.target.audio?.[language];
  if (!src) return null;
  if (!audioCache.has(src)) {
    const a = new Audio(src);
    a.preload = 'none';
    a.addEventListener('ended', () => {
      if (currentAudio === a) updateAudio();
    });
    audioCache.set(src, a);
  }
  return audioCache.get(src);
}

function pauseAudio(reset = false) {
  audioRequest++;
  if (currentAudio) {
    currentAudio.pause();
    if (reset) currentAudio.currentTime = 0;
  }
  updateAudio();
}

function updateAudio() {
  const available = !!active?.target.audio?.[language];
  const playing = currentAudio && !currentAudio.paused;
  const resumed = currentAudio && currentAudio.currentTime > 0 && !currentAudio.ended;
  $('narrator-btn').disabled = !available || !active?.model;
  $('narrator-btn').textContent = t(playing ? 'pause' : resumed ? 'resume' : 'audio');
  $('audio-note').textContent = active && !available ? t('noAudio') : active?.audioBlocked ? t('autoAudio') : '';
  $('audio-unlock').hidden = !active?.audioBlocked || !available;
}

async function toggleAudio() {
  const audio = getAudio();
  if (!audio) return;
  if (!audio.paused) {
    pauseAudio();
    return;
  }
  const request = ++audioRequest;
  currentAudio = audio;
  try {
    await audio.play();
    if (active) active.audioBlocked = false;
    if (request !== audioRequest) {
      audio.pause();
      return;
    }
    updateAudio();
  } catch {
    if (request === audioRequest) {
      updateAudio();
      if (active) active.audioBlocked = true;
      updateAudio();
      feedback(t('autoAudio'));
    }
  }
}

// Automatic narration runs once per landmark/language in each session.
// Marker reacquisition never restarts a recording the visitor has already heard.
function autoNarrate(entry) {
  if (active !== entry || !entry.model || entry.animating || document.hidden ||
      (session?.mode === 'ar' && !entry.tracked) || detail || $('journal-dialog').open) return;
  if (!entry.target.audio?.[language] || entry.narrated.has(language)) return;
  entry.narrated.add(language);
  toggleAudio();
}

function setSheet(open) {
  const ar = session?.mode === 'ar';
  document.body.classList.toggle('sheet-open', ar && open);
  $('controls').inert = ar && !open;
  $('sheet-toggle').setAttribute('aria-expanded', String(ar && open));
  if (ar && !open && detail === 'story') renderDetail();
}

function stopStoryVideo() {
  $('detail-body').querySelectorAll('video').forEach(v => v.pause());
  $('detail-body').querySelectorAll('iframe').forEach(f => {
    if (f.storyPlayButton) f.replaceWith(f.storyPlayButton); else f.remove();
  });
}

function addStoryVideo(body, data) {
  const section = document.createElement('section'); section.className = 'story-video';
  const title = document.createElement('h4'); title.textContent = t('videoTitle'); section.appendChild(title);
  body.appendChild(section);
  const raw = text(data.storyVideo);
  if (!raw) { const p = document.createElement('p'); p.className = 'video-placeholder'; p.textContent = t('videoSoon'); section.appendChild(p); return; }
  let url;
  try { url = new URL(raw, location.href); if (!['https:', 'http:'].includes(url.protocol)) throw Error(); }
  catch { const p = document.createElement('p'); p.textContent = t('videoError'); section.appendChild(p); return; }
  const link = document.createElement('a'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = t('openVideo');
  let embed = null;
  const host = url.hostname.replace(/^www\./, '');
  if (['youtube.com','m.youtube.com','youtube-nocookie.com','youtu.be'].includes(host)) {
    const id = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    if (/^[\w-]{11}$/.test(id || '')) embed = 'https://www.youtube-nocookie.com/embed/' + id;
  } else if (['vimeo.com','player.vimeo.com'].includes(host)) {
    const id = url.pathname.match(/(?:^|\/)(\d+)(?:\/|$)/)?.[1];
    if (id) embed = 'https://player.vimeo.com/video/' + id;
  }
  if (embed) {
    const play = document.createElement('button'); play.textContent = t('watchVideo'); section.appendChild(play);
    play.addEventListener('click', () => {
      pauseAudio(); const frame = document.createElement('iframe'); frame.title = text(data.name) + ' — ' + t('videoTitle');
      frame.src = embed; frame.allow = 'fullscreen; picture-in-picture'; frame.allowFullscreen = true;
      frame.storyPlayButton = play;
      frame.referrerPolicy = 'strict-origin-when-cross-origin'; play.replaceWith(frame);
    });
  } else if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
    const video = document.createElement('video'); video.controls = true; video.playsInline = true; video.preload = 'none'; video.src = url.href;
    video.addEventListener('play', () => pauseAudio());
    video.addEventListener('error', () => { const p = document.createElement('p'); p.textContent = t('videoError'); section.appendChild(p); }, {once:true});
    section.appendChild(video);
  }
  section.appendChild(link);
}

// Progress and rewards

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    storageOK = false;
  }
}

function recordPoint(index) {
  if (!active) return;
  const data = progress[active.target.id],
    was = data.earned,
    key = active.target.points[index].key;
  if (!data.seen.includes(key)) data.seen.push(key);
  data.earned = data.seen.length === active.target.points.length || data.passed;
  persist();
  refresh();
  if (data.earned && !was) celebrate(t('unlocked'));
}

function celebrate(message) {
  feedback(message);
  $('feedback').classList.remove('toast-celebrate');
  void $('feedback').offsetWidth;
  $('feedback').classList.add('toast-celebrate');
}

// Landmark selection and detail panels

function setActive(entry) {
  if (active === entry) return;
  pauseAudio(true);
  active = entry;
  stopStoryVideo();
  detail = null;
  selection = -1;
  chapter = 0;
  feedback('');
  for (const e of session.entries) {
    if (session.mode === 'preview') e.host.visible = e === entry;
    if (e.user) e.user.visible = e === entry;
    highlight(e, -1);
  }
  if (entry.model && !entry.revealed) reveal(entry);
  renderDetail();
  refresh();
  if (session) resize(session);
  autoNarrate(entry);
  if (!entry.model && !entry.loading && session?.mode === 'preview') {
    const s = session;
    entry.loading = prepareModel(entry, s).catch(error => {
      if (session !== s) return;
      entry.failed = true;
      console.error('Model load:', entry.target.id, error);
      feedback(t('modelError'));
      refresh();
    });
  }
}

function highlight(entry, index) {
  if (!entry?.model) return;
  entry.floorBands?.forEach((band, i) => {
    band.fill.visible = i === index;
    band.outline.material.opacity = i === index ? 1 : .18;
  });
  const matches = index >= 0 ? entry.parts[index]?.meshes : [];
  entry.model.traverse(node => {
    if (!node.isMesh) return;
    for (const m of [node.material].flat()) {
      if (!m?.emissive) continue;
      m.emissive.copy(m.userData.originalEmissive);
      m.emissiveIntensity = m.userData.originalIntensity;
      if (matches?.includes(node)) {
        m.emissive.setHex(0xc99428);
        m.emissiveIntensity = .5;
      }
    }
  });
}

function selectPoint(index, record = true) {
  if (!active?.model) return;
  selection = index;
  highlight(active, index);
  if (record) recordPoint(index);
}

function openPoint(index) {
  setSheet(true);
  detail = 'point';
  pauseAudio();
  selectPoint(index);
  renderDetail();
}

function setFloorFocus(value) {
  if (!active?.target.floorDiscovery || session?.mode !== 'preview') return;
  active.floorFocus = value;
  resize(session);
  renderDetail();
}

function renderDetail() {
  stopStoryVideo();
  $('detail-panel').hidden = !detail || !active;
  if (!detail || !active) return;
  const data = active.target,
    body = $('detail-body');
  body.replaceChildren();
  const heading = (k, title) => {
    $('detail-kicker').textContent = k;
    $('detail-title').textContent = title;
  };
  const p = message => {
    const el = document.createElement('p');
    el.textContent = message;
    body.appendChild(el);
  };
  const button = (label, fn, parent = body, primary = false) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (primary) b.className = 'primary';
    b.addEventListener('click', fn);
    parent.appendChild(b);
    return b;
  };
  if (data.floorDiscovery) {
    const note = document.createElement('p');
    note.className = 'floor-demo-note';
    note.textContent = t('floorDemo');
    body.appendChild(note);
  }
  if (data.floorDiscovery && (detail === 'discover' || detail === 'point')) {
    const selected = detail === 'point' ? selection : -1;
    heading(t('discover'), selected >= 0 ? text(data.points[selected].title) : t('floorChoose'));
    p(selected >= 0 ? text(data.points[selected].text) : t('floorHint'));
    const grid = document.createElement('div');
    grid.className = 'floor-grid';
    grid.setAttribute('aria-label', t('floorChoose'));
    data.points.forEach((point, i) => {
      const seen = progress[data.id].seen.includes(point.key);
      const b = button(`${i + 1}${seen ? ' ✓' : ''}`, () => openPoint(i), grid);
      b.dataset.floor = String(i + 1);
      b.setAttribute('aria-label', text(point.title));
      b.setAttribute('aria-pressed', String(selected === i));
      b.classList.toggle('floor-visited', seen);
    });
    body.appendChild(grid);
    const row = document.createElement('div');row.className = 'row floor-navigation';
    button(t('previousFloor'), () => openPoint(selected - 1), row).disabled = selected <= 0;
    button(t('nextFloor'), () => openPoint(selected + 1), row).disabled = selected >= data.points.length - 1;
    if (session.mode === 'preview') button(t(active.floorFocus ? 'campusView' : 'focusTower'), () => setFloorFocus(!active.floorFocus), row);
    body.appendChild(row);
  } else if (detail === 'discover' || detail === 'point') {
    heading(t('discover'), detail === 'point' ? text(data.points[selection].title) : t('choose'));
    p(detail === 'point' ? text(data.points[selection].text) : t('tap'));
    const list = document.createElement('div');
    list.className = 'discovery-list row';
    data.points.forEach((point, i) => {
      const b = button(`${progress[data.id].seen.includes(point.key) ? '✓' : i + 1} · ${text(point.title)}`, () => openPoint(i), list);
      b.setAttribute('aria-pressed', String(detail === 'point' && selection === i));
    });
    body.appendChild(list);
  } else if (detail === 'story') {
    const c = data.chapters[chapter];
    selectPoint(c.point, false);
    heading(`${t('chapter')} ${chapter + 1} ${t('of')} ${data.chapters.length}`, text(c.title));
    p(text(c.text));
    addStoryVideo(body, data);
    const row = document.createElement('div');
    row.className = 'row';
    const back = button(t('previous'), () => {
      chapter--;
      renderDetail();
    }, row);
    back.disabled = chapter === 0;
    button(t(chapter === data.chapters.length - 1 ? 'quizNext' : 'next'), () => {
      if (chapter === data.chapters.length - 1) {
        setSheet(true);
  detail = 'challenge';
        selection = -1;
        highlight(active, -1);
      } else chapter++;
      renderDetail();
    }, row, true);
    body.appendChild(row);
  } else if (detail === 'challenge') {
    heading(t('challenge'), text(data.quiz.question));
    const answers = document.createElement('div');
    answers.className = 'answer-grid';
    data.quiz.answers.forEach((answer, i) => button(text(answer), () => {
      if (i !== data.quiz.correct) {
        feedback(`${t('tryAgain')} ${text(data.quiz.hint)}`);
        return;
      }
      progress[data.id].passed = true;
      progress[data.id].earned = true;
      persist();
      selectPoint(data.quiz.point, false);
      refresh();
      celebrate(t('correct'));
      for (const b of answers.children) b.disabled = true;
      button(t('passport'), () => openDialog('passport'), body, true);
    }, answers));
    body.appendChild(answers);
  }
}

// Passport, markers, and information dialogs

function openDialog(kind) {
  dialogKind = kind;
  const el = $('dialog-content');
  el.replaceChildren();
  if (kind === 'passport') {
    const count = TARGETS.filter(target => progress[target.id].earned).length;
    $('dialog-title').textContent = t('passport');
    el.innerHTML = `<p>${escape(t(count === TARGETS.length ? 'allDone' : 'passportHint'))}</p><div class="progress-track" role="progressbar" aria-label="${escape(t('passport'))}" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${TARGETS.length}"><span style="width:${count / TARGETS.length * 100}%"></span></div><p class="small">${count} / ${TARGETS.length} ${escape(t('earned'))}</p><div class="stamps">${TARGETS.map(target => `<div class="stamp ${progress[target.id].earned ? 'earned' : ''}"><div class="seal" aria-hidden="true">${progress[target.id].earned ? '✓' : '○'}</div><h3>${escape(target.id === 'labuanclocktower' ? t('clock') : target.name)}</h3><p>${escape(t(progress[target.id].earned ? 'earned' : 'locked'))}</p></div>`).join('')}</div><p class="small">${escape(t(storageOK ? 'local' : 'sessionOnly'))}</p>`;
  } else if (kind === 'markers') {
    $('dialog-title').textContent = t('markers');
    el.innerHTML = `<p>${escape(t('markerHint'))}</p><div class="marker-grid">${TARGETS.filter(target => target.marker && target.image).map(target => `<figure><img src="${encodeURI(target.image)}" alt="${escape(target.name)} marker"><figcaption>${escape(target.name)}<a href="${encodeURI(target.image)}" target="_blank" rel="noopener">${escape(t('openImage'))}</a></figcaption></figure>`).join('')}</div>`;
  } else if (kind === 'info' && active) {
    $('dialog-title').textContent = active.target.fullName;
    const p = document.createElement('p');
    p.textContent = text(active.target.info);
    el.appendChild(p);
    if (active.target.visitor) {
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = text(active.target.visitor);
      el.appendChild(meta);
    }
  }
  pauseAudio();
  stopStoryVideo();
  if (!$('journal-dialog').open) $('journal-dialog').showModal();
}

// The supplied files are MindAR v2 MessagePack dictionaries containing one image.
// Preserve their entries byte-for-byte, changing only the outer array length.

// Marker loading

// The supplied files are MindAR v2 MessagePack dictionaries containing one image.
// Preserve their entries byte-for-byte, changing only the outer array length.
async function combineTargets(targets) {
  const header = new Uint8Array([0x82, 0xa1, 0x76, 0x02, 0xa8, 0x64, 0x61, 0x74, 0x61, 0x4c, 0x69, 0x73, 0x74, 0x91]);
  if (!targets.length) throw Error('No AR markers configured.');
  if (new Set(targets.map(t => t.marker)).size !== targets.length) throw Error('Each location needs a unique marker file.');
  if (targets.length > 15) throw Error('Recompile targets together for more than 15 markers.');
  const parts = await Promise.all(targets.map(async target => {
    const response = await fetch(target.marker);
    if (!response.ok) throw Error('Marker file unavailable: ' + target.marker);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!header.every((v, i) => bytes[i] === v)) throw Error('Unsupported marker format: ' + target.marker);
    return bytes.subarray(header.length);
  }));
  const combined = new Uint8Array(header.length + parts.reduce((n, p) => n + p.length, 0));
  combined.set(header);
  combined[13] = 0x90 + parts.length;
  let offset = header.length;
  for (const p of parts) {
    combined.set(p, offset);
    offset += p.length;
  }
  return URL.createObjectURL(new Blob([combined]));
}

// 3D model preparation and disposal

function disposeModel(root) {
  const geometry = new Set(),
    materials = new Set(),
    textures = new Set();
  root?.traverse(n => {
    if (n.geometry) geometry.add(n.geometry);
    for (const m of [n.material].flat()) {
      if (!m) continue;
      materials.add(m);
      for (const v of Object.values(m)) if (v?.isTexture) textures.add(v);
    }
  });
  textures.forEach(t => t.dispose());
  materials.forEach(m => m.dispose());
  geometry.forEach(g => g.dispose());
}

async function prepareModel(entry, s) {
  const {
    scene: model
  } = await loadGLTF(entry.target.model);
  if (session !== s) {
    disposeModel(model);
    return;
  }
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model),
    size = bounds.getSize(new THREE.Vector3()),
    center = bounds.getCenter(new THREE.Vector3());
  if (!Number.isFinite(size.length()) || size.length() === 0) throw Error('Empty landmark model');
  entry.model = model;
  const offset = new THREE.Vector3(center.x, bounds.min.y, center.z);
  let towerBounds = null;
  if (entry.target.floorDiscovery) {
    towerBounds = new THREE.Box3();
    model.traverse(node => {
      if (entry.target.floorDiscovery.boundsNames.includes(node.name)) towerBounds.expandByObject(node);
    });
    if (towerBounds.isEmpty()) throw Error('Main tower geometry not found for floor discovery.');
    entry.floorFocus = false;
    entry.focusLocal = towerBounds.getCenter(new THREE.Vector3()).sub(offset);
    entry.focusSize = towerBounds.getSize(new THREE.Vector3());
  }
  entry.parts = entry.target.points.map(point => {
    if (towerBounds) {
      const step = (towerBounds.max.y - towerBounds.min.y) / entry.target.floorDiscovery.count;
      // The export has continuous facade meshes, not individually surveyed floors.
      // Thirteen equal-height demo bands are explicitly labelled approximate in the UI.
      return {position:new THREE.Vector3(towerBounds.max.x + 1.5, towerBounds.min.y + (point.floor - .5) * step, towerBounds.max.z + .7).sub(offset), meshes:[]};
    }
    const box = new THREE.Box3(),
      meshes = [];
    model.traverse(node => {
      if (point.match.some(prefix => node.name.startsWith(prefix))) {
        box.expandByObject(node);
        node.traverse(child => {
          if (child.isMesh && !meshes.includes(child)) meshes.push(child);
        });
      }
    });
    const pos = (box.isEmpty() ? bounds : box).getCenter(new THREE.Vector3());
    return {
      position: pos.sub(new THREE.Vector3(center.x, bounds.min.y, center.z)),
      meshes
    };
  });
  model.position.set(-center.x, -bounds.min.y, -center.z);
  entry.normalized = new THREE.Group();
  const fit = (s.mode === 'ar' ? entry.target.tabletop.size : 1.55) / Math.max(size.x, size.y, size.z);
  entry.normalized.scale.setScalar(fit);
  entry.previewHeight = size.y * fit;
  entry.normalized.add(model);
  if (towerBounds) {
    const step = entry.focusSize.y / entry.target.floorDiscovery.count;
    entry.floorBands = entry.target.points.map((point, i) => {
      const geometry = new THREE.BoxGeometry(entry.focusSize.x + .8, step * .82, entry.focusSize.z + .8);
      const material = new THREE.MeshBasicMaterial({color:0xdba537,transparent:true,opacity:.3,depthWrite:false});
      const fill = new THREE.Mesh(geometry,material);
      fill.position.set(entry.focusLocal.x, towerBounds.min.y - bounds.min.y + (i + .5) * step, entry.focusLocal.z);
      fill.visible = false;
      const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0xbd8e30,transparent:true,opacity:.18,depthWrite:false}));
      outline.position.copy(fill.position);
      entry.normalized.add(fill,outline);
      return {fill,outline};
    });
  }
  entry.revealGroup = new THREE.Group();
  entry.revealGroup.add(entry.normalized);
  entry.user = new THREE.Group();
  entry.user.add(entry.revealGroup);
  // MindAR's marker lies in local XY, with +Z pointing out of the printed face.
  // glTF models stand along +Y. Rotate their ground plane onto the marker plane.
  entry.tabletop = new THREE.Group();
  if (s.mode === 'ar') entry.tabletop.rotation.x = Math.PI / 2;
  entry.tabletop.add(entry.user);
  entry.host.add(entry.tabletop);
  entry.zoom = 1;
  entry.user.rotation.y = s.mode === 'preview' ? -.3 : THREE.MathUtils.degToRad(entry.target.tabletop.yawDegrees);
  entry.user.visible = active === entry;
  // The normalized model's lowest point is y=0: its base stays on the map.
  model.traverse(node => {
    if (!node.isMesh) return;
    for (const material of [node.material].flat()) {
      if (material.emissive) {
        material.userData.originalEmissive = material.emissive.clone();
        material.userData.originalIntensity = material.emissiveIntensity;
      }
    }
  });
  for (let i = 0; i < entry.parts.length; i++) {
    const p = new THREE.Object3D();
    p.position.copy(entry.parts[i].position);
    entry.normalized.add(p);
    entry.parts[i].anchor = p;
    const b = document.createElement('button');
    b.className = 'hotspot';
    if (entry.target.floorDiscovery) b.classList.add('floor-hotspot');
    b.type = 'button';
    b.hidden = true;
    b.textContent = i + 1;
    b.addEventListener('click', () => {
      if (active !== entry) setActive(entry);
      openPoint(i);
    });
    $('hotspots').appendChild(b);
    entry.buttons.push(b);
  }
  if (entry.tracked || s.mode === 'preview' && active === entry) reveal(entry);
  refresh();
  if (active === entry) resize(s);
}

function reveal(entry) {
  if (!entry?.model) return;
  entry.revealed = true;
  entry.revealStart = performance.now();
  entry.animating = !reducedMotion.matches;
  entry.revealGroup.scale.setScalar(entry.animating ? .02 : 1);
  entry.revealGroup.position.y = 0;
  autoNarrate(entry);
}

// Scene rendering and gestures

function updateScene(s, now) {
  for (const e of s.entries) {
    if (!e.model) continue;
    if (e.animating) {
      const t = Math.min(1, (now - e.revealStart) / 1300),
        ease = 1 - Math.pow(1 - t, 3);
      e.revealGroup.scale.setScalar(.02 + .98 * ease);
      e.revealGroup.position.y = 0;
      if (t === 1) { e.animating = false; autoNarrate(e); }
    }
  }
  s.scene.updateMatrixWorld(true);
  if (s.mode === 'preview' && active?.floorFocus && active.focusLocal) {
    const target = active.normalized.localToWorld(active.focusLocal.clone());
    const scale = active.normalized.getWorldScale(new THREE.Vector3()).x;
    const size = active.focusSize.clone().multiplyScalar(scale / active.zoom);
    const tangent = Math.tan(THREE.MathUtils.degToRad(s.camera.fov / 2));
    const distance = Math.max(size.y * .68 / tangent, size.x * .7 / tangent / s.camera.aspect) + size.z;
    s.camera.position.set(target.x, target.y + size.y * .08, target.z + distance);
    s.camera.lookAt(target);
  }
  s.camera.updateMatrixWorld(true);
  const rect = s.renderer.domElement.getBoundingClientRect(),
    stage = $('stage').getBoundingClientRect();
  for (const e of s.entries) {
    const visible = e === active && e.host.visible && (s.mode === 'preview' || e.tracked) && !e.animating;
    const placed = [];
    e.parts?.forEach((p, i) => {
      const b = e.buttons[i];
      // The floor picker exposes every level without 13 overlapping touch targets.
      if (!visible || (e.target.floorDiscovery && i !== Math.max(0, selection))) {
        b.hidden = true;
        return;
      }
      const v = p.anchor.getWorldPosition(new THREE.Vector3()).project(s.camera);
      let x = (v.x + 1) * rect.width / 2 + rect.left - stage.left,
        y = (1 - v.y) * rect.height / 2 + rect.top - stage.top;
      const behind = v.z < -1 || v.z > 1;
      if (behind || x < 22 || x > stage.width - 22 || y < 44 || y > stage.height - 60) {
        b.hidden = true;
        return;
      }
      // Separate nearby touch targets; the discovery list remains an alternative.
      const candidates = [[x, y], [x + 52, y], [x - 52, y], [x, y - 52], [x, y + 52]];
      const free = candidates.find(([cx, cy]) => cx >= 22 && cx <= stage.width - 22 && cy >= 44 && cy <= stage.height - 60 && placed.every(old => Math.hypot(cx - old.x, cy - old.y) >= 48));
      b.hidden = !free;
      if (free) {
        [x, y] = free;
        b.style.left = x + 'px';
        b.style.top = y + 'px';
        placed.push({
          x,
          y
        });
      }
    });
  }
  s.renderer.render(s.scene, s.camera);
}

function zoom(value) {
  if (!active?.user) return;
  active.zoom = Math.min(active.target.floorDiscovery ? 5 : 2.3, Math.max(.55, value));
  active.user.scale.setScalar(active.zoom);
}

function attachGestures(s) {
  const surface = s.renderer.domElement,
    pointers = new Map();
  let lastDistance = 0;
  const point = e => ({
    x: e.clientX,
    y: e.clientY
  });
  const distance = () => {
    const a = [...pointers.values()];
    return a.length < 2 ? 0 : Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
  };
  surface.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!active?.user || s.mode === 'ar' && !active.tracked) return;
    surface.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, point(e));
    lastDistance = distance();
  });
  surface.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId) || !active?.user) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, point(e));
    if (pointers.size >= 2) {
      const d = distance();
      if (lastDistance > 0) zoom(active.zoom * d / lastDistance);
      lastDistance = d;
    } else {
      active.user.rotation.y += (e.clientX - prev.x) * .009;
    }
  });
  const release = e => {
    pointers.delete(e.pointerId);
    lastDistance = distance();
  };
  surface.addEventListener('pointerup', release);
  surface.addEventListener('pointercancel', release);
  surface.addEventListener('lostpointercapture', release);
  surface.addEventListener('wheel', e => {
    if (!active?.model) return;
    e.preventDefault();
    zoom(active.zoom * Math.exp(-e.deltaY * .001));
  }, {
    passive: false
  });
  // Model selection is handled by explicit landmark buttons, so a drag never opens a card.
  s.clearPointers = () => {
    pointers.clear();
    lastDistance = 0;
  };
}

function resize(s) {
  if (session !== s) return;
  const width = $('stage').clientWidth,
    height = $('stage').clientHeight;
  if (!width || !height) return;
  if (s.mode === 'preview') {
    s.renderer.setSize(width, height);
    s.camera.aspect = width / height;
    const distance = Math.max(3.4, .95 / Math.tan(THREE.MathUtils.degToRad(s.camera.fov / 2)) / s.camera.aspect);
    const centerY = (active?.previewHeight || 1.4) / 2;
    s.camera.position.set(0, centerY + 1.1, distance);
    s.camera.lookAt(0, centerY, 0);
    s.camera.updateProjectionMatrix();
  } else if (s.mind.controller && s.mind.video?.videoWidth) s.mind.resize();
}

// Session lifecycle

function cleanup(s) {
  if (!s || s.closed) return;
  s.closed = true;
  s.observer?.disconnect();
  s.renderer?.setAnimationLoop(null);
  s.clearPointers?.();
  if (s.mind) {
    s.mind.controller?.stopProcessVideo();
    s.mind.controller?.worker?.terminate?.();
    s.mind.video?.srcObject?.getTracks().forEach(track => track.stop());
    s.mind.video?.remove();
    window.removeEventListener('resize', s.mind._onResize);
    s.mind.cssRenderer?.domElement.remove();
  }
  s.entries.forEach(e => {
    disposeModel(e.normalized || e.model);
    e.buttons.forEach(b => b.remove());
  });
  s.renderer?.dispose();
  s.renderer?.domElement.remove();
  if (s.targetURL) URL.revokeObjectURL(s.targetURL);
}

function exit() {
  generation++;
  pauseAudio(true);
  stopStoryVideo();
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  document.body.classList.remove('ar-mode', 'sheet-open');
  $('controls').inert = false;
  $('ar-dock').hidden = true;
  $('sheet-close').hidden = true;
  const old = session;
  session = null;
  active = null;
  cleanup(old);
  detail = null;
  $('hotspots').replaceChildren();
  $('ar-container').replaceChildren();
  $('experience').hidden = true;
  $('landing').hidden = false;
  setBusy(false);
  $('startup-status').textContent = '';
}

async function start(mode) {
  if (!THREE) {
    $('startup-status').textContent = 'The AR library could not load. Reload the page.';
    return;
  }
  if (mode === 'ar' && (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)) {
    $('startup-status').textContent = t('secure');
    return;
  }
  setBusy(true);
  // Requested inside the Start gesture; viewport layout remains full-screen if unsupported.
  if (mode === 'ar') document.documentElement.requestFullscreen?.().catch(() => {});
  $('startup-status').textContent = t('loading');
  const token = ++generation;
  const s = {
    mode,
    entries: [],
    targets: mode === 'ar' ? TARGETS.filter(t => t.marker) : TARGETS,
    closed: false
  };
  session = s;
  active = null;
  try {
    if (mode === 'ar') {
      s.targetURL = await combineTargets(s.targets);
      if (token !== generation) {
        URL.revokeObjectURL(s.targetURL);
        return;
      }
      s.mind = new window.MINDAR.IMAGE.MindARThree({
        container: $('ar-container'),
        imageTargetSrc: s.targetURL,
        maxTrack: 2,
        uiLoading: 'no',
        uiScanning: 'no',
        uiError: 'no'
      });
      // Keep camera errors and cancellation observable; the bundled loader otherwise rejects without a reason.
      s.mind._startVideo = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'environment'
          }
        });
        if (token !== generation) {
          stream.getTracks().forEach(track => track.stop());
          throw Error('Cancelled');
        }
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText = 'position:absolute;z-index:1';
        s.mind.video = video;
        $('ar-container').appendChild(video);
        video.srcObject = stream;
        await video.play();
        if (token !== generation) {
          stream.getTracks().forEach(track => track.stop());
          throw Error('Cancelled');
        }
        video.width = video.videoWidth;
        video.height = video.videoHeight;
      };
      s.renderer = s.mind.renderer;
      s.scene = s.mind.scene;
      s.camera = s.mind.camera;
      s.mind.cssRenderer.domElement.style.pointerEvents = 'none';
    } else {
      s.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      s.scene = new THREE.Scene();
      s.camera = new THREE.PerspectiveCamera(38, 1, .01, 100);
      s.camera.position.set(0, 1.1, 3);
      s.camera.lookAt(0, .42, 0);
      $('ar-container').appendChild(s.renderer.domElement);
    }
    s.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    s.renderer.setClearColor(0, 0);
    s.renderer.outputEncoding = THREE.sRGBEncoding;
    s.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    s.renderer.toneMappingExposure = 1;
    s.scene.add(new THREE.HemisphereLight(0xffffff, 0xb6a78b, .9));
    const light = new THREE.DirectionalLight(0xfff6e8, .85);
    light.position.set(2, 4, 4);
    s.scene.add(light);
    for (let i = 0; i < s.targets.length; i++) {
      const anchor = mode === 'ar' ? s.mind.addAnchor(i) : null;
      const entry = {
        target: s.targets[i],
        narrated: new Set(),
        host: anchor?.group || new THREE.Group(),
        anchor,
        model: null,
        buttons: [],
        tracked: false,
        revealed: false,
        failed: false
      };
      s.entries.push(entry);
      if (mode === 'preview') {
        s.scene.add(entry.host);
        entry.host.visible = i === 0;
      } else {
        anchor.onTargetFound = () => {
          if (session !== s) return;
          entry.tracked = true;
          if (!active || !active.tracked) setActive(entry);
          if (entry.model && !entry.revealed) reveal(entry);
          autoNarrate(entry);
          refresh();
        };
        anchor.onTargetLost = () => {
          if (session !== s) return;
          entry.tracked = false;
          if (active === entry) {
            pauseAudio();
            s.clearPointers?.();
            const other = s.entries.find(e => e !== entry && e.tracked);
            if (other) setActive(other);else {
              feedback(t('lost'));
              refresh();
            }
          }
        };
      }
    }
    document.body.classList.toggle('ar-mode', mode === 'ar');
    $('ar-dock').hidden = mode !== 'ar';
    $('sheet-close').hidden = mode !== 'ar';
    $('fullscreen-btn').hidden = mode !== 'ar' || !document.documentElement.requestFullscreen;
    setSheet(false);
    $('landing').hidden = true;
    $('experience').hidden = false;
    $('mode-label').textContent = t(mode === 'ar' ? 'arMode' : 'previewMode');
    feedback('');
    if (mode === 'preview') setActive(s.entries[0]);else refresh();
    s.observer = new ResizeObserver(() => resize(s));
    s.observer.observe($('stage'));
    resize(s);
    attachGestures(s);
    s.renderer.setAnimationLoop(time => {
      if (session === s) updateScene(s, time);
    });
    // Preview locations load on selection, keeping the first view quick on phones.
    const results = await Promise.allSettled(s.entries.map(e =>
      mode === 'preview' ? e.loading || Promise.resolve() : prepareModel(e, s)));
    if (token !== generation) return;
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        s.entries[i].failed = true;
        console.error('Model load:', s.entries[i].target.id, r.reason);
      }
    });
    if (results.every(r => r.status === 'rejected')) throw Error('All models failed to load. Check that all assets are uploaded.');
    if (mode === 'preview' && active.failed && s.entries.some(e => e.model)) setActive(s.entries.find(e => e.model));
    if (results.some(r => r.status === 'rejected')) feedback(t('modelError'));
    if (mode === 'ar') {
      $('tracking-status').textContent = t('camera');
      await s.mind.start();
      if (token !== generation) {
        s.mind.controller?.stopProcessVideo();
        s.mind.video?.srcObject?.getTracks().forEach(track => track.stop());
        return;
      }
      URL.revokeObjectURL(s.targetURL);
      s.targetURL = null;
      resize(s);
    }
    setBusy(false);
    refresh();
  } catch (error) {
    console.error('Labuan startup:', error);
    if (token !== generation) return;
    exit();
    $('startup-status').textContent = mode === 'ar' ? t('cameraError') : error?.message || t('modelError');
  }
}

// Event listeners and initialization

$('sheet-toggle').addEventListener('click', () => setSheet(!document.body.classList.contains('sheet-open')));
$('sheet-close').addEventListener('click', () => { setSheet(false); $('sheet-toggle').focus(); });
$('audio-unlock').addEventListener('click', toggleAudio);
$('fullscreen-btn').addEventListener('click', () => document.documentElement.requestFullscreen?.().catch(() => {}));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && session?.mode === 'ar') setSheet(false); });

$('start-ar').addEventListener('click', () => start('ar'));

$('start-preview').addEventListener('click', () => start('preview'));

$('exit-btn').addEventListener('click', exit);

['passport-btn', 'landing-passport'].forEach(id => $(id).addEventListener('click', () => openDialog('passport')));

$('markers-btn').addEventListener('click', () => openDialog('markers'));

$('info-btn').addEventListener('click', () => openDialog('info'));

$('close-dialog').addEventListener('click', () => $('journal-dialog').close());

$('discover-btn').addEventListener('click', () => {
  setSheet(true);
  detail = 'discover';
  if (active?.target.floorDiscovery && session.mode === 'preview') active.floorFocus = true;
  renderDetail();
  const controls = $('controls');
  controls.scrollTop += $('detail-panel').getBoundingClientRect().top - controls.getBoundingClientRect().top;
});

$('story-btn').addEventListener('click', () => {
  pauseAudio();
  setSheet(true);
  detail = 'story';
  chapter = 0;
  renderDetail();
});

$('challenge-btn').addEventListener('click', () => {
  pauseAudio();
  setSheet(true);
  detail = 'challenge';
  renderDetail();
});

$('close-detail').addEventListener('click', () => {
  detail = null;
  selection = -1;
  highlight(active, -1);
  renderDetail();
});

$('replay-btn').addEventListener('click', () => reveal(active));

$('narrator-btn').addEventListener('click', toggleAudio);

$('zoom-in').addEventListener('click', () => zoom(active.zoom * 1.15));

$('zoom-out').addEventListener('click', () => zoom(active.zoom / 1.15));

$('reset-view').addEventListener('click', () => {
  zoom(1);
  active.user.rotation.y = session.mode === 'preview' ? -.3 : THREE.MathUtils.degToRad(active.target.tabletop.yawDegrees);
});

$('lang-select').addEventListener('change', e => {
  pauseAudio(true);
  currentAudio = null;
  language = e.target.value;
  try {
    localStorage.setItem('labuan-language', language);
  } catch {}
  translate();
  if (active) autoNarrate(active);
});

$('theme-toggle-btn').addEventListener('click', () => {
  document.body.classList.toggle('theme-modern');
  try {
    localStorage.setItem('labuan-theme', document.body.classList.contains('theme-modern') ? 'modern' : 'vintage');
  } catch {}
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseAudio();
    stopStoryVideo();
    session?.clearPointers?.();
  }
});

window.addEventListener('pagehide', exit);

translate();
