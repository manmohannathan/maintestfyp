// Camera capture only. Model zoom and MindAR projection belong to features/scene.js.
// Device labels are browser-provided hints, never guaranteed hardware identifiers.
const DEVICE_KEY = 'labuan-camera-device-v1';
const ZOOM_KEY = 'labuan-camera-zoom-v1';
const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const ultra = label => /ultra[ -]?wide|ultra grand|0[.,]5\s*[x×]/i.test(label);
const front = label => /front|user|selfie|facetime/i.test(label);
export function cameraScore(device) {
  const name = device?.label || '';
  if (front(name) || /telephoto|macro|depth|infrared/i.test(name)) return -100;
  if (ultra(name)) return -50;
  let score = /back|rear|environment|belakang|arrière/i.test(name) ? 100 : 0;
  if (/main|primary|standard|\b1\s*[x×]\b/i.test(name)) score += 40;
  return score;
}
export function chooseCamera(devices, currentId, android, preferredId) {
  const preferred = devices.find(d => d.deviceId === preferredId);
  if (preferred) return preferred; // An explicit visitor choice always wins.
  const current = devices.find(d => d.deviceId === currentId);
  if (!android) return current; // Keep the working iOS/default browser selection.
  const ranked = [...devices].sort((a,b) => cameraScore(b) - cameraScore(a));
  const best = ranked[0];
  return best && cameraScore(best) >= 100 && cameraScore(best) > cameraScore(current) ? best : current;
}
export function createCameraService({$,t,onLensChange,onZoomChange}) {
  let stream = null, devices = [], zoomRange = null, request = 0;
  const select = $('camera-select'), slider = $('camera-zoom'), output = $('camera-zoom-value');
  const android = /Android/i.test(navigator.userAgent);
  function release() { request++; stream?.getTracks().forEach(t => t.stop()); stream = null; zoomRange = null; }
  function translate() {
    const current = stream?.getVideoTracks()[0]?.getSettings?.().deviceId;
    select.replaceChildren(new Option(t('cameraAuto'), ''));
    devices.forEach((device, i) => select.add(new Option(device.label || `Camera ${i + 1}`, device.deviceId)));
    select.value = current || '';
    $('camera-zoom-group').hidden = !zoomRange;
    $('camera-note').textContent = t(zoomRange ? 'cameraZoomTip' : 'cameraNoZoom');
  }
  async function open(cancelled = () => false) {
    release(); const ticket = request;
    const check = () => { if (cancelled() || ticket !== request) { throw new DOMException('Camera request cancelled','AbortError'); } };
    const capture = async id => {
      const candidate = await navigator.mediaDevices.getUserMedia({ audio:false, video: {
        ...(id ? {deviceId:{exact:id}} : {facingMode:{ideal:'environment'}}),
        width:{ideal:1280}, height:{ideal:720}, frameRate:{ideal:30,max:30}
      }});
      try { check(); } catch (error) { candidate.getTracks().forEach(t => t.stop()); throw error; }
      stream = candidate; return candidate;
    };
    await capture();
    try { devices = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput'); }
    catch { devices = []; }
    check();
    let track = stream.getVideoTracks()[0];
    const currentId = track.getSettings?.().deviceId;
    const desired = chooseCamera(devices, currentId, android, read(DEVICE_KEY));
    if (desired?.deviceId && desired.deviceId !== currentId) {
      stream.getTracks().forEach(t => t.stop());
      try { await capture(desired.deviceId); }
      catch (error) { check(); await capture(); } // Stale/unavailable device: recover with the default rear camera.
      track = stream.getVideoTracks()[0];
    }
    let caps = {}; try { caps = track.getCapabilities?.() || {}; } catch {}
    zoomRange = caps.zoom && Number.isFinite(caps.zoom.min) && Number.isFinite(caps.zoom.max) && caps.zoom.max > caps.zoom.min ? caps.zoom : null;
    if (zoomRange) {
      const id = track.getSettings?.().deviceId || 'default';
      let saved = {}; try { saved = JSON.parse(read(ZOOM_KEY) || '{}'); } catch {}
      // 2× only for an explicitly labelled ultra-wide Android camera; never apply it to every phone.
      const fallback = android && ultra(track.label || '') ? 2 : 1;
      const wanted = Number.isFinite(saved[id]) ? saved[id] : fallback;
      const step = zoomRange.step || .1;
      const value = Math.min(zoomRange.max, Math.max(zoomRange.min, zoomRange.min + Math.round((wanted-zoomRange.min)/step)*step));
      try { await track.applyConstraints({advanced:[{zoom:value}]}); } catch {} // Zoom support may be advertised but unavailable.
      check();
      slider.min = zoomRange.min; slider.max = zoomRange.max; slider.step = step;
      slider.value = track.getSettings?.().zoom ?? value; output.textContent = Number(slider.value).toFixed(1) + '×';
    }
    translate(); return stream;
  }
  select.addEventListener('change', () => { write(DEVICE_KEY, select.value); onLensChange(); });
  slider.addEventListener('input', () => { output.textContent = Number(slider.value).toFixed(1) + '×'; });
  slider.addEventListener('change', async () => {
    const ticket = request, track = stream?.getVideoTracks()[0]; if (!track || !zoomRange) return;
    try {
      await track.applyConstraints({advanced:[{zoom:Number(slider.value)}]});
      if (ticket !== request) return;
      const actual = track.getSettings?.().zoom ?? Number(slider.value); slider.value = actual; output.textContent = actual.toFixed(1)+'×';
      let saved = {}; try { saved = JSON.parse(read(ZOOM_KEY) || '{}'); } catch {}
      saved[track.getSettings?.().deviceId || 'default'] = actual; write(ZOOM_KEY,JSON.stringify(saved));
      $('camera-note').textContent = t('cameraZoomTip'); onZoomChange();
    } catch { if (ticket === request) { slider.value = track.getSettings?.().zoom ?? slider.min; output.textContent = Number(slider.value).toFixed(1)+'×'; $('camera-note').textContent = t('cameraApplyError'); } }
  });
  return {open,release,translate};
}
