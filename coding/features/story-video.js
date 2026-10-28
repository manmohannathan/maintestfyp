export function createStoryVideo({$,t,text,pauseAudio}) {
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

return {stopStoryVideo,addStoryVideo};
}
