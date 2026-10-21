// Editorial content lives here. Historical copy is retained from the uploaded project.
// New discoveries describe visible model features, rather than inventing folklore.
import { MEDIA } from './media-config.js';

const pair = (en, ms) => ({
  en,
  ms
});

// Landmark assets, discoveries, stories, and quizzes

export const TARGETS = [{
  id: 'umslic',
  name: 'UMSKAL',
  fullName: 'UMS Labuan International Campus (UMSLIC)',
  marker: './assets/targets/umskal.mind',
  image: './assets/targets/umskal.png',
  model: './assets/models/umskal_.gltf',

  // Audio narration
  audio: {
    en: './assets/audio/englishUmskal.mp3',
    ms: './assets/audio/malayUmskal.mp3'
  },
  info: pair(
    'Established in 1999, the Universiti Malaysia Sabah Labuan International Campus focuses on international business, finance, and computing sciences.',
    'Ditubuhkan pada tahun 1999, Universiti Malaysia Sabah Kampus Antarabangsa Labuan memfokuskan perniagaan antarabangsa, kewangan dan sains pengkomputeran.'
  ),
  visitor: pair(
    'Visitor information from the original project: Monday–Friday, 8:00 AM–5:00 PM; free entry with visitor registration; +60 87-503 000. Confirm current arrangements with the campus before visiting.',
    'Maklumat pelawat daripada projek asal: Isnin–Jumaat, 8:00 pagi–5:00 petang; masuk percuma dengan pendaftaran pelawat; +60 87-503 000. Sahkan aturan semasa dengan pihak kampus sebelum melawat.'
  ),
  progressVersion: 'umskal-floors-v1',
  floorDiscovery: {count:13, boundsNames:['Tower | cream shaft', 'Stepped tower crown']},
  points: [
  {
    "key": "floor-01",
    "floor": 1,
    "match": [],
    "title": {
      "en": "Floor 1 · Welcome & reception",
      "ms": "Aras 1 · Sambutan & penerimaan"
    },
    "text": {
      "en": "Sample use: A welcome desk, visitor check-in and a small campus information corner.",
      "ms": "Kegunaan contoh: Kaunter sambutan, pendaftaran pelawat dan sudut maklumat kampus."
    }
  },
  {
    "key": "floor-02",
    "floor": 2,
    "match": [],
    "title": {
      "en": "Floor 2 · Student services",
      "ms": "Aras 2 · Perkhidmatan pelajar"
    },
    "text": {
      "en": "Sample use: A student support counter for enquiries, appointments and campus activities.",
      "ms": "Kegunaan contoh: Kaunter sokongan pelajar untuk pertanyaan, janji temu dan aktiviti kampus."
    }
  },
  {
    "key": "floor-03",
    "floor": 3,
    "match": [],
    "title": {
      "en": "Floor 3 · Learning commons",
      "ms": "Aras 3 · Ruang pembelajaran"
    },
    "text": {
      "en": "Sample use: An open study area with shared tables and a quiet reading corner.",
      "ms": "Kegunaan contoh: Ruang belajar terbuka dengan meja berkongsi dan sudut bacaan yang tenang."
    }
  },
  {
    "key": "floor-04",
    "floor": 4,
    "match": [],
    "title": {
      "en": "Floor 4 · Computer laboratory",
      "ms": "Aras 4 · Makmal komputer"
    },
    "text": {
      "en": "Sample use: A computer lab for programming practice and introductory technology workshops.",
      "ms": "Kegunaan contoh: Makmal komputer untuk latihan pengaturcaraan dan bengkel asas teknologi."
    }
  },
  {
    "key": "floor-05",
    "floor": 5,
    "match": [],
    "title": {
      "en": "Floor 5 · Multimedia studio",
      "ms": "Aras 5 · Studio multimedia"
    },
    "text": {
      "en": "Sample use: A creative space for recording audio, editing video and designing digital media.",
      "ms": "Kegunaan contoh: Ruang kreatif untuk rakaman audio, penyuntingan video dan reka bentuk media digital."
    }
  },
  {
    "key": "floor-06",
    "floor": 6,
    "match": [],
    "title": {
      "en": "Floor 6 · Business learning hub",
      "ms": "Aras 6 · Pusat pembelajaran perniagaan"
    },
    "text": {
      "en": "Sample use: A collaborative classroom for business presentations and group case studies.",
      "ms": "Kegunaan contoh: Bilik pembelajaran kolaboratif untuk pembentangan perniagaan dan kajian kes berkumpulan."
    }
  },
  {
    "key": "floor-07",
    "floor": 7,
    "match": [],
    "title": {
      "en": "Floor 7 · Research lounge",
      "ms": "Aras 7 · Ruang penyelidikan"
    },
    "text": {
      "en": "Sample use: A discussion area where students can exchange ideas and plan research projects.",
      "ms": "Kegunaan contoh: Ruang perbincangan untuk pelajar bertukar idea dan merancang projek penyelidikan."
    }
  },
  {
    "key": "floor-08",
    "floor": 8,
    "match": [],
    "title": {
      "en": "Floor 8 · Innovation workshop",
      "ms": "Aras 8 · Bengkel inovasi"
    },
    "text": {
      "en": "Sample use: A hands-on space for prototyping ideas and trying interactive technologies.",
      "ms": "Kegunaan contoh: Ruang amali untuk menghasilkan prototaip idea dan mencuba teknologi interaktif."
    }
  },
  {
    "key": "floor-09",
    "floor": 9,
    "match": [],
    "title": {
      "en": "Floor 9 · Seminar rooms",
      "ms": "Aras 9 · Bilik seminar"
    },
    "text": {
      "en": "Sample use: Flexible rooms for guest talks, small seminars and student-led sessions.",
      "ms": "Kegunaan contoh: Bilik fleksibel untuk ceramah jemputan, seminar kecil dan sesi kendalian pelajar."
    }
  },
  {
    "key": "floor-10",
    "floor": 10,
    "match": [],
    "title": {
      "en": "Floor 10 · Academic meeting suite",
      "ms": "Aras 10 · Ruang mesyuarat akademik"
    },
    "text": {
      "en": "Sample use: Meeting rooms for project consultations, team reviews and academic discussions.",
      "ms": "Kegunaan contoh: Bilik mesyuarat untuk konsultasi projek, semakan pasukan dan perbincangan akademik."
    }
  },
  {
    "key": "floor-11",
    "floor": 11,
    "match": [],
    "title": {
      "en": "Floor 11 · Digital heritage gallery",
      "ms": "Aras 11 · Galeri warisan digital"
    },
    "text": {
      "en": "Sample use: A sample gallery displaying photographs, student stories and digital heritage exhibits.",
      "ms": "Kegunaan contoh: Galeri contoh yang memaparkan foto, cerita pelajar dan pameran warisan digital."
    }
  },
  {
    "key": "floor-12",
    "floor": 12,
    "match": [],
    "title": {
      "en": "Floor 12 · Collaboration lounge",
      "ms": "Aras 12 · Ruang kolaborasi"
    },
    "text": {
      "en": "Sample use: A shared lounge for interdisciplinary teamwork and informal idea sharing.",
      "ms": "Kegunaan contoh: Ruang bersama untuk kerja berpasukan antara disiplin dan perkongsian idea santai."
    }
  },
  {
    "key": "floor-13",
    "floor": 13,
    "match": [],
    "title": {
      "en": "Floor 13 · Project showcase",
      "ms": "Aras 13 · Pameran projek"
    },
    "text": {
      "en": "Sample use: An exhibition space where final-year students can demonstrate projects to supervisors and visitors.",
      "ms": "Kegunaan contoh: Ruang pameran untuk pelajar tahun akhir menunjukkan projek kepada penyelia dan pelawat."
    }
  }
],
  chapters: [
  {
    "point": 0,
    "title": {
      "en": "Start at Floor 1",
      "ms": "Bermula di Aras 1"
    },
    "text": {
      "en": "Begin at the sample welcome and reception area. Select a floor to see its position on the main tower.",
      "ms": "Mulakan di ruang contoh sambutan dan penerimaan. Pilih aras untuk melihat kedudukannya pada menara utama."
    }
  },
  {
    "point": 6,
    "title": {
      "en": "Explore the middle floors",
      "ms": "Terokai aras pertengahan"
    },
    "text": {
      "en": "Floor 7 is a sample research lounge. Move between floors to compare the highlighted levels and their example uses.",
      "ms": "Aras 7 ialah ruang penyelidikan contoh. Tukar aras untuk membandingkan bahagian yang diserlahkan dan contoh kegunaannya."
    }
  },
  {
    "point": 12,
    "title": {
      "en": "Reach Floor 13",
      "ms": "Sampai di Aras 13"
    },
    "text": {
      "en": "The top demo floor is a project showcase. Imagine presenting your final-year project here. Try the short challenge next.",
      "ms": "Aras demo teratas ialah ruang pameran projek. Bayangkan anda membentangkan projek tahun akhir di sini. Cuba cabaran ringkas seterusnya."
    }
  }
],
  quiz: {
  "question": {
    "en": "In this demo, which floor has the project showcase?",
    "ms": "Dalam demo ini, aras manakah mempunyai ruang pameran projek?"
  },
  "answers": [
    {
      "en": "Floor 13",
      "ms": "Aras 13"
    },
    {
      "en": "Floor 1",
      "ms": "Aras 1"
    },
    {
      "en": "Floor 7",
      "ms": "Aras 7"
    }
  ],
  "correct": 0,
  "point": 12,
  "hint": {
    "en": "Explore the top floor in the sample directory.",
    "ms": "Terokai aras teratas dalam direktori contoh."
  }
}
}, {
  id: 'labuanclocktower',
  name: 'Clock Tower',
  fullName: 'Labuan Clock Tower',
  marker: './assets/targets/labuanclocktower.mind',
  image: './assets/targets/labuan clock tower.png',
  model: './assets/models/Labuan_Clock_Tower.gltf',
  audio: null,
  info: pair(
    'Explore this 3D model of the Labuan Clock Tower. Drag to rotate it and view its architectural details.',
    'Terokai model 3D Menara Jam Labuan ini. Seret untuk memutarkannya dan melihat butiran seni binanya.'
  ),
  points: [{
    key: 'clock',
    match: ['Clock ivory dial', 'Clock hour hand', 'Clock minute hand'],
    title: pair(
      'The clock faces',
      'Muka jam'
    ),
    text: pair(
      'Look closely at the clock faces. Find the hands and numerals, then rotate the model to see the other sides.',
      'Lihat muka jam dengan lebih dekat. Cari jarum dan angka, kemudian putarkan model untuk melihat sisi yang lain.'
    )
  }, {
    key: 'roof',
    match: ['Broad terracotta hip roof', 'Back roof eave'],
    title: pair(
      'The roof',
      'Bumbung'
    ),
    text: pair(
      'The sloping roof sits above the clock chamber. Turn the model to inspect its shape and overhanging edges.',
      'Bumbung condong terletak di atas ruang jam. Putarkan model untuk melihat bentuk dan tepi bumbungnya.'
    )
  }, {
    key: 'path',
    match: ['Brick_Path'],
    title: pair(
      'The approach',
      'Laluan masuk'
    ),
    text: pair(
      'Trace the path leading toward the tower. Zoom out to see how the tower and its base fit together.',
      'Ikuti laluan menuju ke menara. Zum keluar untuk melihat hubungan antara menara dengan tapaknya.'
    )
  }],
  chapters: [{
    point: 0,
    title: pair(
      'Read the landmark',
      'Kenali mercu tanda'
    ),
    text: pair(
      'Start with the feature that gives the Clock Tower its name: the clock faces. Find their hands and numerals.',
      'Mulakan dengan ciri yang memberikan nama kepada Menara Jam: muka jam. Cari jarum dan angkanya.'
    )
  }, {
    point: 1,
    title: pair(
      'Look above',
      'Lihat ke atas'
    ),
    text: pair(
      'Move your attention to the roof. The model lets you inspect its shape from different directions.',
      'Alihkan perhatian kepada bumbung. Model ini membolehkan anda melihat bentuknya dari pelbagai arah.'
    )
  }, {
    point: 2,
    title: pair(
      'Follow the path',
      'Ikuti laluan'
    ),
    text: pair(
      'Finish at the path and base. Together, these details turn a quick glance into a closer exploration. Try the challenge to collect your stamp.',
      'Akhiri penerokaan di laluan dan tapak. Butiran ini membantu anda mengenali model dengan lebih dekat. Cuba cabaran untuk mengumpul cap anda.'
    )
  }],
  quiz: {
    question: pair(
      'What can you find on the clock faces?',
      'Apakah yang terdapat pada muka jam?'
    ),
    answers: [pair(
      'Windows and balconies',
      'Tingkap dan balkoni'
    ), pair(
      'Hands and numerals',
      'Jarum dan angka'
    ), pair(
      'Doors and pillars',
      'Pintu dan tiang'
    )],
    correct: 1,
    point: 0,
    hint: pair(
      'Revisit discovery point 1 and look at the clock dial.',
      'Lihat semula titik penemuan 1 dan perhatikan muka jam.'
    )
  }
}];

TARGETS.push(...[
  {
    "id": "surrenderpoint",
    "name": "Surrender Point",
    "fullName": "Labuan Surrender Point",
    "model": "./assets/models/labuan_surrender_point.gltf",
    "info": {
      "en": "Explore the supplied Surrender Point model. Discoveries describe its visible features; detailed location information can be added later.",
      "ms": "Terokai model Surrender Point yang dibekalkan. Penemuan menerangkan ciri yang kelihatan; maklumat lokasi terperinci boleh ditambah kemudian."
    },
    "points": [
      {
        "key": "arch",
        "title": {
          "en": "Entrance arch",
          "ms": "Gerbang masuk"
        },
        "match": [
          "Main entrance arch",
          "Arch front"
        ],
        "text": {
          "en": "Rotate the model to see the shape and layered edges of the entrance arch.",
          "ms": "Putarkan model untuk melihat bentuk dan lapisan tepi gerbang masuk."
        }
      },
      {
        "key": "memorial",
        "title": {
          "en": "Memorial stone",
          "ms": "Batu peringatan"
        },
        "match": [
          "Memorial upright granite stone",
          "Memorial bronze plaque"
        ],
        "text": {
          "en": "Find the upright stone and its plaque at the memorial.",
          "ms": "Cari batu tegak dan plak pada tugu peringatan."
        }
      },
      {
        "key": "tablet",
        "title": {
          "en": "Information tablet",
          "ms": "Papan maklumat"
        },
        "match": [
          "Blue interpretive tablet"
        ],
        "text": {
          "en": "Look for the blue information tablet and its supporting frame.",
          "ms": "Cari papan maklumat biru dan rangka penyokongnya."
        }
      }
    ],
    "chapters": [
      {
        "point": 0,
        "title": {
          "en": "Entrance arch",
          "ms": "Gerbang masuk"
        },
        "text": {
          "en": "Rotate the model to see the shape and layered edges of the entrance arch.",
          "ms": "Putarkan model untuk melihat bentuk dan lapisan tepi gerbang masuk."
        }
      },
      {
        "point": 1,
        "title": {
          "en": "Memorial stone",
          "ms": "Batu peringatan"
        },
        "text": {
          "en": "Find the upright stone and its plaque at the memorial.",
          "ms": "Cari batu tegak dan plak pada tugu peringatan."
        }
      },
      {
        "point": 2,
        "title": {
          "en": "Information tablet",
          "ms": "Papan maklumat"
        },
        "text": {
          "en": "Look for the blue information tablet and its supporting frame.",
          "ms": "Cari papan maklumat biru dan rangka penyokongnya."
        }
      }
    ],
    "quiz": {
      "question": {
        "en": "Which feature did you explore first?",
        "ms": "Ciri manakah yang anda terokai dahulu?"
      },
      "answers": [
        {
          "en": "Entrance arch",
          "ms": "Gerbang masuk"
        },
        {
          "en": "Memorial stone",
          "ms": "Batu peringatan"
        },
        {
          "en": "Information tablet",
          "ms": "Papan maklumat"
        }
      ],
      "correct": 0,
      "point": 0,
      "hint": {
        "en": "Revisit discovery point 1.",
        "ms": "Lihat semula titik penemuan 1."
      }
    }
  },
  {
    "id": "lisc",
    "name": "LISC",
    "fullName": "LISC",
    "model": "./assets/models/lisc.gltf",
    "info": {
      "en": "Explore the supplied LISC model. Discoveries describe its visible features; detailed location information can be added later.",
      "ms": "Terokai model LISC yang dibekalkan. Penemuan menerangkan ciri yang kelihatan; maklumat lokasi terperinci boleh ditambah kemudian."
    },
    "points": [
      {
        "key": "hall",
        "title": {
          "en": "Central hall",
          "ms": "Dewan utama"
        },
        "match": [
        "Canopy hall | curved glass"
        ],
        "text": {
          "en": "Explore the curved facade of the central hall. Rotate to view it from different sides.",
          "ms": "Terokai fasad melengkung dewan utama. Putarkan untuk melihat sisi yang berbeza."
        }
      },
      {
        "key": "fountain",
        "title": {
          "en": "Arrival fountain",
          "ms": "Air pancut ketibaan"
        },
        "match": [
        "Fountain"
        ],
        "text": {
          "en": "Find the fountain in the arrival area. Zoom in to inspect its circular shape.",
          "ms": "Cari air pancut di kawasan ketibaan. Zum masuk untuk melihat bentuk bulatnya."
        }
      },
      {
        "key": "promenade",
        "title": {
          "en": "Promenade",
          "ms": "Persiaran"
        },
        "match": [
          "Beach promenade"
        ],
        "text": {
          "en": "Zoom out to see how the promenade connects with the wider site model.",
          "ms": "Zum keluar untuk melihat hubungan persiaran dengan keseluruhan model tapak."
        }
      }
    ],
    "chapters": [
      {
        "point": 0,
        "title": {
          "en": "Central hall",
          "ms": "Dewan utama"
        },
        "text": {
          "en": "Explore the curved facade of the central hall. Rotate to view it from different sides.",
          "ms": "Terokai fasad melengkung dewan utama. Putarkan untuk melihat sisi yang berbeza."
        }
      },
      {
        "point": 1,
        "title": {
          "en": "Arrival fountain",
          "ms": "Air pancut ketibaan"
        },
        "text": {
          "en": "Find the fountain in the arrival area. Zoom in to inspect its circular shape.",
          "ms": "Cari air pancut di kawasan ketibaan. Zum masuk untuk melihat bentuk bulatnya."
        }
      },
      {
        "point": 2,
        "title": {
          "en": "Promenade",
          "ms": "Persiaran"
        },
        "text": {
          "en": "Zoom out to see how the promenade connects with the wider site model.",
          "ms": "Zum keluar untuk melihat hubungan persiaran dengan keseluruhan model tapak."
        }
      }
    ],
    "quiz": {
      "question": {
        "en": "Which feature did you explore first?",
        "ms": "Ciri manakah yang anda terokai dahulu?"
      },
      "answers": [
        {
          "en": "Central hall",
          "ms": "Dewan utama"
        },
        {
          "en": "Arrival fountain",
          "ms": "Air pancut ketibaan"
        },
        {
          "en": "Promenade",
          "ms": "Persiaran"
        }
      ],
      "correct": 0,
      "point": 0,
      "hint": {
        "en": "Revisit discovery point 1.",
        "ms": "Lihat semula titik penemuan 1."
      }
    }
  }
]);
for (const target of TARGETS) Object.assign(target, MEDIA[target.id]);

// Interface translations: English first, Malay second

export const UI = {
  controls: {"en": "Explore & listen", "ms": "Teroka & dengar"},
  hideControls: {"en": "Hide controls", "ms": "Sembunyikan kawalan"},
  fullscreen: {"en": "Full screen", "ms": "Skrin penuh"},
  videoTitle: {"en": "Watch the story", "ms": "Tonton cerita"},
  videoSoon: {"en": "Video coming soon", "ms": "Video akan datang"},
  watchVideo: {"en": "Play video", "ms": "Mainkan video"},
  openVideo: {"en": "Open video", "ms": "Buka video"},
  videoError: {"en": "Video unavailable. Check the URL or try opening it directly.", "ms": "Video tidak tersedia. Semak URL atau cuba membukanya secara terus."},
  markerPending: {"en": "3D preview available · AR marker coming soon", "ms": "Pratonton 3D tersedia · Penanda AR akan datang"},
  autoAudio: {"en": "Tap Play narration to enable sound.", "ms": "Ketik Mainkan narasi untuk mengaktifkan suara."},
  tabletopHint: {"en": "Lay the marker flat on your map. Point the rear camera down at it, then view from an angle.", "ms": "Letakkan penanda rata di atas peta. Halakan kamera belakang ke bawah, kemudian lihat dari sudut condong."},

  floor: pair('Floor', 'Aras'),
  floors: pair('floors explored', 'aras diterokai'),
  floorChoose: pair('Explore the 13 floors', 'Terokai 13 aras'),
  floorHint: pair('Choose a floor below. The highlighted band follows the tower as you rotate or zoom.', 'Pilih aras di bawah. Jalur yang diserlahkan mengikuti menara apabila diputar atau dizum.'),
  floorDemo: pair('Demo content · Example floor uses; positions are approximate.', 'Kandungan demo · Kegunaan aras ialah contoh; kedudukan adalah anggaran.'),
  focusTower: pair('Focus tower', 'Fokus menara'),
  campusView: pair('Campus view', 'Pandangan kampus'),
  previousFloor: pair('← Lower floor', '← Aras bawah'),
  nextFloor: pair('Upper floor →', 'Aras atas →'),

  // Landing page and navigation
  passport: pair(
    'My passport',
    'Pasport saya'
  ),
  island: pair(
    'AN ISLAND OF STORIES',
    'SEBUAH PULAU PENUH CERITA'
  ),
  welcome: pair(
    'A little closer to Labuan.',
    'Kenali Labuan dengan lebih dekat.'
  ),
  intro: pair(
    'Bring a landmark to life. Explore its details, follow its story, and collect a memory along the way.',
    'Hidupkan sebuah mercu tanda. Terokai butirannya, ikuti ceritanya dan kumpulkan kenangan sepanjang perjalanan.'
  ),
  clock: pair(
    'Clock Tower',
    'Menara Jam'
  ),
  start: pair(
    'Open AR camera',
    'Buka kamera AR'
  ),
  preview: pair(
    'Explore in 3D first',
    'Terokai dalam 3D dahulu'
  ),
  startHint: pair(
    'Allow your camera, then point it at one of the two printed markers. No app download needed.',
    'Benarkan kamera, kemudian halakannya ke salah satu daripada dua penanda bercetak. Tidak perlu muat turun aplikasi.'
  ),
  markers: pair(
    'View the markers',
    'Lihat penanda'
  ),
  footer: pair(
    'Four landmarks. Your own journey.',
    'Empat mercu tanda. Perjalanan anda sendiri.'
  ),
  back: pair(
    '← Home',
    '← Utama'
  ),

  // Viewer preferences and controls
  theme: pair(
    'Change theme',
    'Tukar tema'
  ),
  reset: pair(
    'Reset view',
    'Tetap semula'
  ),
  replay: pair(
    'Replay reveal',
    'Ulang kemunculan'
  ),
  gesture: pair(
    'Drag to rotate · Pinch to zoom · Tap a numbered point',
    'Seret untuk putar · Cubit untuk zum · Ketik titik bernombor'
  ),
  discover: pair(
    'Discover',
    'Terokai'
  ),
  story: pair(
    'Story',
    'Cerita'
  ),
  challenge: pair(
    'Challenge',
    'Cabaran'
  ),
  info: pair(
    'View info',
    'Maklumat'
  ),
  audio: pair(
    'Play narration',
    'Mainkan narasi'
  ),
  pause: pair(
    'Pause narration',
    'Jeda narasi'
  ),
  resume: pair(
    'Resume narration',
    'Sambung narasi'
  ),
  noAudio: pair(
    'No narration recording is available for this landmark yet.',
    'Rakaman narasi untuk mercu tanda ini belum tersedia.'
  ),

  // Tracking and loading status
  scan: pair(
    'Point your camera at a marker',
    'Halakan kamera ke penanda'
  ),
  ready: pair(
    'Marker found · explore the landmark',
    'Penanda ditemui · terokai mercu tanda'
  ),
  lost: pair(
    'Marker lost · point back to continue',
    'Penanda hilang · halakan semula untuk sambung'
  ),
  previewMode: pair(
    '3D preview · no camera',
    'Pratonton 3D · tanpa kamera'
  ),
  arMode: pair(
    'Live AR',
    'AR langsung'
  ),
  loading: pair(
    'Loading your landmarks…',
    'Memuatkan mercu tanda…'
  ),
  camera: pair(
    'Allow camera access to continue…',
    'Benarkan akses kamera untuk meneruskan…'
  ),

  // Discoveries and story navigation
  discoveries: pair(
    'discoveries',
    'penemuan'
  ),
  choose: pair(
    'Choose a discovery',
    'Pilih penemuan'
  ),
  tap: pair(
    'Tap a numbered point on the model or choose a detail below.',
    'Ketik titik bernombor pada model atau pilih butiran di bawah.'
  ),
  next: pair(
    'Next chapter →',
    'Bab seterusnya →'
  ),
  previous: pair(
    '← Previous',
    '← Sebelumnya'
  ),
  quizNext: pair(
    'Try the challenge →',
    'Cuba cabaran →'
  ),
  chapter: pair(
    'Chapter',
    'Bab'
  ),
  of: pair(
    'of',
    'daripada'
  ),

  // Passport progress and rewards
  earned: pair(
    'Stamp collected',
    'Cap dikumpulkan'
  ),
  locked: pair(
    'Not yet collected',
    'Belum dikumpulkan'
  ),
  passportHint: pair(
    'Explore all discoveries for a landmark or answer its challenge correctly to earn its stamp.',
    'Terokai semua penemuan bagi mercu tanda atau jawab cabarannya dengan betul untuk mendapat cap.'
  ),
  local: pair(
    'Saved in this browser. Stamps record AR or 3D exploration, not a physical visit.',
    'Disimpan dalam pelayar ini. Cap merekod penerokaan AR atau 3D, bukan lawatan fizikal.'
  ),
  allDone: pair(
    'Both landmarks explored. Your Labuan collection is complete!',
    'Kedua-dua mercu tanda telah diterokai. Koleksi Labuan anda lengkap!'
  ),
  correct: pair(
    'Correct! Your landmark stamp is unlocked.',
    'Betul! Cap mercu tanda anda telah dibuka.'
  ),
  tryAgain: pair(
    'Try again.',
    'Cuba lagi.'
  ),
  unlocked: pair(
    'All discoveries complete! A new stamp is waiting in your passport.',
    'Semua penemuan selesai! Cap baharu menanti dalam pasport anda.'
  ),

  // Errors and availability messages
  modelError: pair(
    'This model could not load. Try the other landmark or return home to retry.',
    'Model ini tidak dapat dimuatkan. Cuba mercu tanda lain atau kembali ke halaman utama untuk mencuba semula.'
  ),
  cameraError: pair(
    'The camera could not start. Allow camera access in your browser, close other camera apps, and try again. You can still use the 3D preview.',
    'Kamera tidak dapat dimulakan. Benarkan akses kamera, tutup aplikasi kamera lain dan cuba semula. Anda masih boleh menggunakan pratonton 3D.'
  ),
  secure: pair(
    'Camera AR needs HTTPS or localhost. Open your published HTTPS site on your phone, or use the 3D preview here.',
    'Kamera AR memerlukan HTTPS atau localhost. Buka laman HTTPS pada telefon anda, atau gunakan pratonton 3D di sini.'
  ),
  audioError: pair(
    'Audio could not play. Tap narration to retry.',
    'Audio tidak dapat dimainkan. Ketik narasi untuk mencuba semula.'
  ),
  sessionOnly: pair(
    'Browser storage is unavailable; progress will last for this session only.',
    'Storan pelayar tidak tersedia; kemajuan hanya disimpan untuk sesi ini.'
  ),

  // Marker instructions
  markerHint: pair(
    'Print a marker or open it on a second screen. Keep the full image visible and avoid glare.',
    'Cetak penanda atau buka pada skrin kedua. Pastikan keseluruhan imej kelihatan dan elakkan silau.'
  ),
  openImage: pair(
    'Open full marker image',
    'Buka imej penanda penuh'
  ),
  waiting: pair(
    'Scan a landmark to begin',
    'Imbas mercu tanda untuk bermula'
  )
};

Object.assign(UI, {
  startHint: pair('Place a supported marker flat on your map, then open the AR camera. All four models are available in 3D preview.', 'Letakkan penanda yang disokong rata pada peta, kemudian buka kamera AR. Keempat-empat model tersedia dalam pratonton 3D.'),
  markerHint: pair('Print the complete image flat on your map. Keep it visible, evenly lit and free of glare. New locations need their own compiled marker.', 'Cetak imej penuh secara rata pada peta. Pastikan imej kelihatan, bercahaya sekata dan tanpa silau. Lokasi baharu memerlukan penanda tersendiri.'),
  noAudio: pair('Narration coming soon for this language.', 'Narasi akan datang untuk bahasa ini.')
});

// Saved progress

export const STORAGE_KEY = 'labuan-legends-journal-v1';

// Keep only valid discovery keys and completed challenges.
export function sanitizeProgress(value) {
  const result = {};
  for (const target of TARGETS) {
    const raw = value?.[target.id];
    const seen = Array.isArray(raw?.seen) ? [...new Set(raw.seen.filter(key => target.points.some(p => p.key === key)))] : [];
    const passed = raw?.passed === true && (!target.progressVersion || raw.version === target.progressVersion);
    result[target.id] = {
      seen,
      version: target.progressVersion || null,
      passed,
      earned: seen.length === target.points.length || passed
    };
  }
  return result;
}
