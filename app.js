(() => {
  const $ = (id) => document.getElementById(id);
  const intro = $('intro');
  document.body.classList.add('intro-open');
  const closeIntro = () => { intro.classList.add('dismissed'); document.body.classList.remove('intro-open'); };
  $('enterExperience').addEventListener('click', closeIntro);
  $('skipIntro').addEventListener('click', closeIntro);

  const videoEl = $('cameraVideo');
  const imagePreview = $('previewImage');
  const videoPreview = $('previewVideo');
  const placeholder = $('cameraPlaceholder');
  const cameraStatus = $('cameraStatus');
  const actionButton = $('mainCameraAction');
  const actionLabel = $('cameraActionLabel');
  const recordingBadge = $('recordingBadge');
  const recordTimer = $('recordTimer');
  const fileInput = $('fileInput');
  const submitButton = $('submitButton');
  const formStatus = $('formStatus');
  let currentMode = 'video';
  let facingMode = 'user';
  let stream = null;
  let recorder = null;
  let chunks = [];
  let selectedFile = null;
  let previewUrl = null;
  let recordTimeout = null;
  let timerInterval = null;
  let recordingStartedAt = 0;
  let mediaSerial = 0;
  const MAX_VIDEO_SECONDS = 30;
  const MAX_FILE_BYTES = 100 * 1024 * 1024;

  const showToast = (message) => {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    window.clearTimeout(showToast.timeout); showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 3500);
  };
  const setStatus = (message, type = '') => { formStatus.textContent = message; formStatus.className = `form-status ${type}`.trim(); };
  const stopStream = () => {
    if (stream) { stream.getTracks().forEach(track => track.stop()); stream = null; }
    videoEl.srcObject = null;
  };
  const clearTimers = () => { window.clearTimeout(recordTimeout); window.clearInterval(timerInterval); recordTimeout = null; timerInterval = null; };
  const releasePreview = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = null; };
  const resetPreviewElements = () => { imagePreview.hidden = true; videoPreview.hidden = true; videoEl.hidden = true; placeholder.hidden = false; videoEl.srcObject = stream; };
  const updateSubmitState = () => { submitButton.disabled = !(selectedFile && $('consentSubmit').checked); };
  const formatTime = (seconds) => `00:${String(Math.max(0, seconds)).padStart(2, '0')}`;

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast(t('m0'));
      cameraStatus.textContent = t('m1'); return;
    }
    if (recorder && recorder.state === 'recording') return;
    stopStream();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: currentMode === 'video'
      });
      videoEl.srcObject = stream; videoEl.hidden = false; imagePreview.hidden = true; videoPreview.hidden = true; placeholder.hidden = true;
      cameraStatus.textContent = facingMode === 'user' ? t('m2') : t('m3');
      actionButton.disabled = false;
      if (currentMode === 'video') actionLabel.textContent = t('m4');
      else actionLabel.textContent = t('m5');
    } catch (error) {
      stopStream();
      const msg = error && (error.name === 'NotAllowedError' ? t('m6') : error.name === 'NotFoundError' ? t('m7') : t('m8'));
      cameraStatus.textContent = t('m9'); showToast(msg);
    }
  }

  function stopRecordingUI() {
    clearTimers(); recordingBadge.hidden = true; actionButton.classList.remove('recording');
    actionButton.disabled = false;
    actionLabel.textContent = currentMode === 'photo' ? t('m5') : t('m4');
  }

  function saveSelectedFile(file, fromRecorder = false) {
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'].includes(file.type)) {
      showToast(t('m10')); return;
    }
    if (file.size > MAX_FILE_BYTES) { showToast(t('m11')); return; }
    const serial = ++mediaSerial;
    releasePreview(); selectedFile = file;
    resetPreviewElements(); stopStream();
    previewUrl = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      imagePreview.src = previewUrl; imagePreview.hidden = false; placeholder.hidden = true;
      cameraStatus.textContent = fromRecorder ? t('m12') : t('m13');
    } else {
      videoPreview.src = previewUrl; videoPreview.hidden = false; placeholder.hidden = true;
      videoPreview.onloadedmetadata = () => {
        if (serial !== mediaSerial) return;
        if (Number.isFinite(videoPreview.duration) && videoPreview.duration > MAX_VIDEO_SECONDS + 0.5) {
          selectedFile = null; releasePreview(); videoPreview.removeAttribute('src'); videoPreview.load(); videoPreview.hidden = true; placeholder.hidden = false; cameraStatus.textContent = t('m14'); updateSubmitState();
          showToast(t('m15'));
        }
      };
      cameraStatus.textContent = fromRecorder ? t('m16') : t('m17');
    }
    updateSubmitState(); setStatus('');
  }

  async function beginRecording() {
    if (!stream) { await startCamera(); if (!stream) return; }
    const hasVideo = stream.getVideoTracks().some(t => t.readyState === 'live');
    if (!hasVideo) { await startCamera(); if (!stream) return; }
    if (currentMode === 'photo') {
      if (!videoEl.videoWidth || !videoEl.videoHeight) { showToast(t('m18')); return; }
      const canvas = document.createElement('canvas'); canvas.width = videoEl.videoWidth; canvas.height = videoEl.videoHeight;
      canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => { if (blob) saveSelectedFile(new File([blob], `neferdidi-photo-${Date.now()}.jpg`, { type: 'image/jpeg', lastModified: Date.now() }), true); }, 'image/jpeg', .92);
      return;
    }
    if (!window.MediaRecorder) { showToast(t('m19')); return; }
    const supportedTypes = ['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];
    const mimeType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type));
    try { recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream); }
    catch { showToast(t('m20')); return; }
    chunks = [];
    recorder.ondataavailable = (event) => { if (event.data && event.data.size) chunks.push(event.data); };
    recorder.onerror = () => { stopRecordingUI(); showToast(t('m21')); };
    recorder.onstop = () => {
      stopRecordingUI();
      if (!chunks.length) { cameraStatus.textContent = t('m22'); return; }
      const type = recorder.mimeType || 'video/webm';
      const ext = type.includes('mp4') ? 'mp4' : 'webm';
      const file = new File([new Blob(chunks, { type })], `neferdidi-video-${Date.now()}.${ext}`, { type, lastModified: Date.now() });
      saveSelectedFile(file, true); chunks = [];
    };
    recorder.start(250); recordingStartedAt = Date.now();
    actionButton.classList.add('recording'); actionLabel.textContent = t('m23'); recordingBadge.hidden = false;
    recordTimer.textContent = '00:00'; cameraStatus.textContent = t('m24');
    timerInterval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordingStartedAt) / 1000);
      recordTimer.textContent = formatTime(elapsed);
      if (elapsed >= MAX_VIDEO_SECONDS && recorder?.state === 'recording') stopRecording();
    }, 250);
    recordTimeout = window.setTimeout(() => { if (recorder?.state === 'recording') stopRecording(); }, MAX_VIDEO_SECONDS * 1000);
  }
  function stopRecording() {
    if (recorder && recorder.state === 'recording') recorder.stop();
    clearTimers();
  }

  actionButton.addEventListener('click', () => {
    if (recorder && recorder.state === 'recording') stopRecording(); else beginRecording();
  });
  $('startCamera').addEventListener('click', startCamera);
  $('switchCamera').addEventListener('click', async () => { facingMode = facingMode === 'user' ? 'environment' : 'user'; await startCamera(); });
  document.querySelectorAll('.mode-button').forEach(button => button.addEventListener('click', async () => {
    currentMode = button.dataset.mode;
    document.querySelectorAll('.mode-button').forEach(el => { const active = el === button; el.classList.toggle('active', active); el.setAttribute('aria-pressed', String(active)); });
    actionLabel.textContent = currentMode === 'video' ? t('m4') : t('m5');
    fileInput.accept = currentMode === 'video' ? 'video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime';
    if (stream) await startCamera();
  }));
  $('clearMedia').addEventListener('click', () => {
    if (recorder?.state === 'recording') stopRecording();
    clearTimers(); selectedFile = null; releasePreview(); resetPreviewElements(); stopStream();
    fileInput.value = ''; recordingBadge.hidden = true; actionButton.classList.remove('recording');
    cameraStatus.textContent = t('m25'); actionLabel.textContent = currentMode === 'video' ? t('m4') : t('m5');
    updateSubmitState(); setStatus('');
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0]; if (!file) return;
    if (file.type.startsWith('video/')) {
      const probe = document.createElement('video'); const url = URL.createObjectURL(file); probe.preload = 'metadata'; probe.src = url;
      probe.onloadedmetadata = () => { const tooLong = Number.isFinite(probe.duration) && probe.duration > MAX_VIDEO_SECONDS + 0.5; URL.revokeObjectURL(url); if (tooLong) { fileInput.value = ''; showToast(t('m15')); } else saveSelectedFile(file); };
      probe.onerror = () => { URL.revokeObjectURL(url); saveSelectedFile(file); };
    } else saveSelectedFile(file);
  });
  $('consentSubmit').addEventListener('change', updateSubmitState);

  // ---------- upload experience ----------
  const cfg = window.NEFERDIDI_CONFIG || {};
  const form = $('submissionForm'), successPanel = $('successPanel'), progressBox = $('uploadProgress'), bar = $('uploadBar'), pct = $('uploadPct');

  // Analytics stays disabled until a real GA4 measurement ID is configured.
  const measurementId = String(cfg.analyticsMeasurementId || '').trim();
  if (/^G-[A-Z0-9]+$/i.test(measurementId)) {
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(analyticsScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', measurementId, { anonymize_ip: true });
  }
  const track = (eventName, params = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
  };
  const safeText = (value) => String(value == null ? '' : value);
  const langNow = () => window.getLang ? window.getLang() : 'ar';
  const localValue = (item, enKey, arKey) => langNow() === 'en' ? (item[enKey] || item[arKey] || '') : (item[arKey] || item[enKey] || '');
  const element = (tag, text, className) => { const node = document.createElement(tag); if (className) node.className = className; node.textContent = safeText(text); return node; };

  function renderProducts() {
    const grid = $('productGrid'); if (!grid) return;
    grid.replaceChildren();
    (Array.isArray(cfg.products) ? cfg.products : []).forEach((item, index) => {
      const card = element('article', '', 'product-card');
      card.append(element('span', String(index + 1).padStart(2, '0'), 'product-number'));
      const orb = element('div', '✦', 'product-orb'); orb.setAttribute('aria-hidden', 'true'); card.append(orb);
      card.append(element('p', localValue(item, 'category', 'categoryAr'), 'product-category'));
      card.append(element('h3', localValue(item, 'name', 'nameAr')));
      card.append(element('p', localValue(item, 'description', 'descriptionAr'), 'product-description'));
      grid.append(card);
    });
    const menuLink = $('menuLink');
    if (menuLink) {
      if (cfg.menuUrl && /^https:\/\//i.test(cfg.menuUrl)) { menuLink.href = cfg.menuUrl; menuLink.hidden = false; }
      else menuLink.hidden = true;
    }
  }
  function renderGallery() {
    const grid = $('memoryGallery'); if (!grid) return;
    grid.replaceChildren();
    const all = Array.isArray(cfg.approvedMedia) ? cfg.approvedMedia : [];
    const approved = all.filter(item => item && /^https:\/\//i.test(item.src || '') && ['image', 'video'].includes(item.type));
    approved.forEach(item => {
      const card = element('article', '', 'memory-card');
      let media;
      if (item.type === 'video') { media = document.createElement('video'); media.controls = true; media.playsInline = true; media.preload = 'metadata'; }
      else { media = document.createElement('img'); media.loading = 'lazy'; }
      media.src = item.src; media.alt = localValue(item, 'altEn', 'altAr') || 'Neferdidi community moment';
      card.append(media);
      const captionText = localValue(item, 'captionEn', 'captionAr');
      if (captionText) card.append(element('p', captionText, 'memory-caption'));
      grid.append(card);
    });
    const note = document.querySelector('.gallery-note');
    if (note) note.hidden = approved.length > 0;
    if (!approved.length) grid.append(element('p', window.t ? window.t('gallery_empty') : 'Approved moments will appear here soon.', 'gallery-empty'));
  }
  function renderBranches() {
    const grid = $('branchGrid'); if (!grid) return;
    grid.replaceChildren();
    const branches = Array.isArray(cfg.branches) ? cfg.branches : [];
    const select = $('branch');
    if (select) {
      const previous = select.value;
      select.replaceChildren();
      const first = document.createElement('option'); first.value = ''; first.textContent = window.t ? window.t('opt_branch') : 'Choose a branch (optional)'; select.append(first);
      branches.forEach(branch => {
        const option = document.createElement('option'); option.value = branch.name;
        option.textContent = langNow() === 'en' ? branch.name : (branch.nameAr || branch.name); select.append(option);
      });
      const other = document.createElement('option'); other.value = 'فرع آخر'; other.textContent = window.t ? window.t('opt_other') : 'Other branch'; select.append(other);
      const none = document.createElement('option'); none.value = 'لسه مجربتش الفرع'; none.textContent = window.t ? window.t('opt_none') : 'Not visited yet'; select.append(none);
      if ([...select.options].some(option => option.value === previous)) select.value = previous;
    }
    branches.forEach((branch, index) => {
      const card = element('article', '', 'branch-card');
      card.append(element('span', String(index + 1).padStart(2, '0'), 'branch-number'));
      card.append(element('h3', langNow() === 'en' ? branch.name : (branch.nameAr || branch.name)));
      card.append(element('p', branch.area || '', 'branch-area'));
      const link = element('a', window.t ? window.t('branch_map') : 'Find on Maps ↗', 'branch-map-link');
      link.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Neferdidi ' + branch.name + ' ' + (branch.area || 'Egypt'));
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.addEventListener('click', () => track('branch_map_click', { branch_name: branch.name }));
      card.append(link); grid.append(card);
    });
  }
  function renderDiscovery() { renderProducts(); renderGallery(); renderBranches(); }
  renderDiscovery();
  window.addEventListener('langchange', renderDiscovery);
  document.querySelectorAll('a[href="#capture"]').forEach(link => link.addEventListener('click', () => track('share_cta_click')));
  document.querySelectorAll('.share-site').forEach(button => button.addEventListener('click', () => track('share_campaign_click')));
  const trackingMenuLink = $('menuLink'); if (trackingMenuLink) trackingMenuLink.addEventListener('click', () => track('menu_click'));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (v) => String(v ?? '').replace(/[=|\\]/g, (c) => '\\' + c).replace(/[\r\n]+/g, ' ');
  const setProgress = (f) => { const v = Math.max(0, Math.min(100, Math.round(f * 100))); bar.style.width = v + '%'; pct.textContent = v + '%'; bar.parentElement.setAttribute('aria-valuenow', String(v)); };

  async function prepareFile(file) {
    if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.size <= 1.5 * 1024 * 1024) return file;
    try {
      setStatus(t('up_prep'));
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const scale = Math.min(1, 2560 / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height); bmp.close && bmp.close();
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.86));
      if (blob && blob.size < file.size) return new File([blob], (file.name || 'moment').replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
    } catch (e) { /* fall back to the original file */ }
    return file;
  }
  function xhrUpload(url, body) {
    return new Promise((resolve, reject) => {
      const x = new XMLHttpRequest(); x.open('POST', url);
      x.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(e.loaded / e.total); };
      x.onload = () => { let data = {}; try { data = JSON.parse(x.responseText); } catch (e) {} (x.status >= 200 && x.status < 300) ? resolve(data) : reject(Object.assign(new Error('http'), { status: x.status, data })); };
      x.onerror = x.ontimeout = () => reject(Object.assign(new Error('network'), { network: true }));
      x.timeout = 10 * 60 * 1000; x.send(body);
    });
  }
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas'); cv.className = 'confetti'; cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
    const ctx = cv.getContext('2d'), colors = ['#FD890E', '#111111', '#ffffff', '#FFB35C'];
    const ps = Array.from({ length: 90 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.62, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 15 - 5, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[(Math.random() * colors.length) | 0] }));
    const t0 = performance.now();
    (function frame(now) {
      const k = (now - t0) / 1900; ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach((p) => { p.vy += 0.38; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * k); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      k < 1 ? requestAnimationFrame(frame) : cv.remove();
    })(t0);
  }
  function resetCapture() {
    form.reset(); selectedFile = null; releasePreview(); resetPreviewElements(); stopStream(); fileInput.value = ''; updateSubmitState();
    cameraStatus.textContent = t('m36'); actionButton.classList.remove('recording'); actionLabel.textContent = currentMode === 'video' ? t('m4') : t('m5');
  }
  async function shareSite() {
    const url = cfg.siteUrl || location.href.split('#')[0], data = { title: t('share_title'), text: t('share_text'), url };
    if (navigator.share) { try { await navigator.share(data); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(url); showToast(t('copied')); } catch (e) { window.prompt(url, url); }
  }
  document.querySelectorAll('.share-site').forEach((b) => b.addEventListener('click', shareSite));
  $('sendAnother').addEventListener('click', () => { successPanel.hidden = true; form.hidden = false; form.closest('.share-panel').classList.remove('is-done'); document.getElementById('capture').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!selectedFile) { setStatus(t('m26'), 'error'); showToast(t('m27')); return; }
    if (!$('consentSubmit').checked) { setStatus(t('m28'), 'error'); return; }
    if (!navigator.onLine) { setStatus(t('m29'), 'error'); return; }
    const name = $('customerName').value.trim();
    if (!name) { $('customerName').focus(); return; }
    submitButton.disabled = true; submitButton.innerHTML = t('m30'); setStatus(t('up_prep'));
    try {
      const file = await prepareFile(selectedFile);
      const meta = { lang: window.getLang ? window.getLang() : 'ar', name, branch: $('branch').value, note: $('momentNote').value.trim().slice(0, 300), type: file.type || '',
        orig: (selectedFile.name || '').slice(0, 120), at: new Date().toISOString(), cs: '1', cm: $('consentMarketing').checked ? '1' : '0' };
      const kind = (file.type || '').startsWith('video/') ? 'video' : 'image';
      const url = 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(cfg.cloudName) + '/' + kind + '/upload';
      const body = new FormData(); body.append('file', file, file.name); body.append('upload_preset', cfg.uploadPreset);
      body.append('context', Object.entries(meta).map(([k, v]) => k + '=' + esc(v)).join('|'));
      progressBox.hidden = false; setProgress(0); setStatus(t('m31'));
      for (let attempt = 1; ; attempt++) {
        try { await xhrUpload(url, body); break; }
        catch (err) {
          if (err.network && attempt < 3) { setStatus(t('up_retry')); setProgress(0); await sleep(1500 * attempt); continue; }
          console.error('Upload error', err.status, err.data);
          throw new Error(err.status === 413 || /size/i.test(JSON.stringify(err.data || {})) ? t('m32') : err.network ? t('m37') : t('m33'));
        }
      }
      setProgress(1); progressBox.hidden = true; setStatus('');
      track('moment_submission_success', { media_type: kind, branch: $('branch').value || 'not_selected', marketing_consent: $('consentMarketing').checked ? 'yes' : 'no' });
      resetCapture(); form.hidden = true; successPanel.hidden = false; form.closest('.share-panel').classList.add('is-done'); confetti();
      successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      progressBox.hidden = true; setStatus(error.message || t('m37'), 'error'); showToast(error.message || t('m38')); updateSubmitState();
    } finally {
      submitButton.innerHTML = t('m39'); updateSubmitState();
    }
  });

  // Social profiles are promoted in the header and a dedicated campaign panel; URLs come from config.js.
  function renderSocialNav(navId, variant, featuredOnly = false) {
    const nav = $(navId), socials = cfg.socials || {};
    if (!nav) return;
    nav.replaceChildren();
    const keys = featuredOnly ? ['instagram', 'tiktok'] : ['instagram', 'tiktok', 'facebook', 'whatsapp'];
    let count = 0;
    keys.forEach((key) => {
      const url = socials[key];
      if (!url || !/^https:\/\//i.test(url)) return;
      count++;
      const link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.className = variant === 'featured' ? `featured-social-link social-${key}` : variant === 'header' ? `header-social-link social-${key}` : variant === 'intro' ? `intro-social-link social-${key}` : 'footer-social-link';
      link.setAttribute('aria-label', `${t('social_follow')} ${t('soc_' + key)}`);
      if (variant === 'featured') {
        const icon = document.createElement('span'); icon.className = `social-brand-icon icon-${key}`; icon.setAttribute('aria-hidden', 'true'); icon.textContent = key === 'instagram' ? '◎' : key === 'tiktok' ? '♪' : key === 'facebook' ? 'f' : '↗';
        const textWrap = document.createElement('span'); textWrap.className = 'social-card-text';
        const title = document.createElement('strong'); title.setAttribute('data-i18n', 'soc_' + key); title.textContent = t('soc_' + key);
        const handle = document.createElement('small'); handle.setAttribute('data-i18n', 'social_handle_' + key); handle.textContent = t('social_handle_' + key);
        textWrap.append(title, handle);
        const arrow = document.createElement('span'); arrow.className = 'social-card-arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
        link.append(icon, textWrap, arrow);
      } else if (variant === 'header' || variant === 'intro') {
        const icon = document.createElement('span'); icon.className = variant === 'intro' ? 'intro-social-symbol' : 'header-social-symbol'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = key === 'instagram' ? '◎' : key === 'tiktok' ? '♪' : key === 'facebook' ? 'f' : '↗';
        const label = document.createElement('span'); label.setAttribute('data-i18n', 'soc_' + key); label.textContent = t('soc_' + key);
        link.append(icon, label);
      } else {
        link.setAttribute('data-i18n', 'soc_' + key); link.textContent = t('soc_' + key);
      }
      link.addEventListener('click', () => track('social_profile_click', { platform: key, placement: variant }));
      nav.appendChild(link);
    });
    nav.hidden = count === 0;
  }
  renderSocialNav('headerSocialLinks', 'header', true);
  renderSocialNav('introSocialLinks', 'intro', true);
  renderSocialNav('featuredSocialLinks', 'featured', true);
  renderSocialNav('socialLinks', 'footer', false);
  window.addEventListener('langchange', () => {
    // Dynamic nav labels are refreshed on language changes while keeping their profile URLs.
    ['headerSocialLinks', 'introSocialLinks', 'featuredSocialLinks', 'socialLinks'].forEach((id) => {
      const nav = $(id); if (!nav) return;
      nav.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.getAttribute('data-i18n')); });
      nav.querySelectorAll('a').forEach((a) => {
        const key = (a.className.match(/social-(instagram|tiktok|facebook|whatsapp)/) || [])[1];
        if (key) a.setAttribute('aria-label', `${t('social_follow')} ${t('soc_' + key)}`);
      });
    });
  });
  window.addEventListener('langchange', () => { if (!actionButton.classList.contains('recording')) actionLabel.textContent = currentMode === 'video' ? t('m4') : t('m5'); if (!submitButton.querySelector('.spinner')) submitButton.innerHTML = t('m39'); });
  window.addEventListener('pagehide', () => { clearTimers(); stopStream(); releasePreview(); });
})();
