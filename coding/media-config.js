// EDIT HERE: paths are relative to index.html. Empty strings mean not supplied yet.
// Markers: use a UNIQUE single-image .mind file and its matching printed image.
// Story video: HTTPS YouTube/Vimeo page URL, or a direct .mp4/.webm URL.
// Audio: local MP3 path or HTTPS audio URL, separately for English and Malay.
// Tabletop: yawDegrees turns the building on the map; size is relative to marker width.
export const MEDIA = {
  umslic: {
    marker: './assets/targets/umskal.mind', image: './assets/targets/umskal.png',
    audio: { en: './assets/audio/englishUmskal.mp3', ms: './assets/audio/malayUmskal.mp3' },
    storyVideo: { en: '', ms: '' }, tabletop: { size: .9, yawDegrees: 0 }
  },
  labuanclocktower: {
    marker: './assets/targets/labuanclocktower.mind', image: './assets/targets/labuan clock tower.png',
    audio: { en: '', ms: '' }, storyVideo: { en: '', ms: '' },
    tabletop: { size: .9, yawDegrees: 0 }
  },
  surrenderpoint: {
    marker: '', // Add ./assets/targets/surrenderpoint.mind when ready.
    image: '', // Add the matching marker image path here.
    audio: { en: '', ms: '' }, storyVideo: { en: '', ms: '' },
    tabletop: { size: .9, yawDegrees: 0 }
  },
  lisc: {
    marker: '', // Add ./assets/targets/lisc.mind when ready.
    image: '', // Add the matching marker image path here.
    audio: { en: '', ms: '' }, storyVideo: { en: '', ms: '' },
    tabletop: { size: .9, yawDegrees: 0 }
  }
};
