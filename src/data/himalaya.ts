/* ═══════════════════════════════════════════════════════════════════
 *  himalaya.ts — Hierarchical data for the 4-region Himalayan atlas
 * ═══════════════════════════════════════════════════════════════════ */

export type PlaceType = 'road' | 'trek' | 'spiritual' | 'scenic' | 'adventure' | 'lake'

export interface HimalayaPlace {
  id:          string
  name:        string
  meta?:       string        // "Gateway town · Spiti HQ"
  emoji:       string        // used in info card only
  lat:         number
  lng:         number
  elevation?:  string
  season?:     string
  desc:        string
  experience?: string
  tips?:       string[]
  stats?:      HimalayaStat[]
  videos?:     HimalayaVideo[]
  type:        PlaceType
}

export interface HimalayaStat {
  label: string
  value: string
}

export interface HimalayaVideo {
  youtubeId: string
  title: string
  thumbUrl: string
  views: string
}

export interface HimalayaSubRegion {
  id:       string
  name:     string
  lat?:     number          // position of sub-region marker (required if parent has showSubRegionsFirst)
  lng?:     number
  zoom?:    number
  tilt?:    number
  heading?: number
  places:   HimalayaPlace[]
}

export interface HimalayaRegion {
  id:                  string
  name:                string
  state?:              string    // e.g. "Union Territory"
  emoji:               string    // shown ONLY on the 4 main state markers
  lat:                 number
  lng:                 number
  elevation?:          string    // e.g. "1,400–3,528m"
  zoom:                number
  tilt:                number
  heading:             number
  maxAlt:              string    // for stats bar
  badge?:              string    // "Paradise on Earth"
  cardDesc?:           string    // editorial intro
  tags?:               string[]  // card tags
  travelTypes:         PlaceType[]
  showSubRegionsFirst?: boolean   // when true, clicking shows sub-region hubs first
  subregions:          HimalayaSubRegion[]
}

/* ── Colour per type ─────────────────────────────────────────────── */
export const TYPE_COLOR: Record<PlaceType, string> = {
  road:      '#e8c97a',
  trek:      '#4ab8a0',
  spiritual: '#c47ef5',
  scenic:    '#7eb6e8',
  adventure: '#e87a4a',
  lake:      '#4a9de8',
}
export const TYPE_LABEL: Record<PlaceType, string> = {
  road:      'Road Trip',
  trek:      'Trek',
  spiritual: 'Spiritual',
  scenic:    'Scenic',
  adventure: 'Adventure',
  lake:      'Lake',
}

/* ───────────────────────────────────────────────────────────────────
 *  Region data
 * ─────────────────────────────────────────────────────────────────── */
export const HIMALAYA_REGIONS: HimalayaRegion[] = [

  /* ── 1. JAMMU & KASHMIR ─────────────────────────────────────────── */
  {
    id: 'jammu-kashmir', name: 'Jammu & Kashmir', state: 'Union Territory', emoji: '🏔️',
    lat: 33.70, lng: 74.90, zoom: 9, tilt: 55, heading: 350,
    elevation: '1,400–3,528m', maxAlt: '3,528m (Zojila)',
    badge: 'Paradise on Earth',
    cardDesc: 'From the alpine meadows of Rajouri to the Dal Lake houseboats of Srinagar — J&K is where every road leads to something extraordinary.',
    tags: ['kashmir', 'rajouri', 'passes', 'meadows'],
    travelTypes: ['road', 'scenic', 'spiritual'],
    showSubRegionsFirst: true,
    subregions: [
      {
        id: 'rajouri', name: 'Rajouri',
        lat: 33.65, lng: 74.35, zoom: 10.2, tilt: 55, heading: 0,
        places: [
          { 
            id: 'peer-ki-gali', name: 'Peer Ki Gali', emoji: '🌿', lat: 33.89, lng: 74.07, elevation: '3,490m', 
            meta: 'High-altitude pass · Mughal Road', season: 'May – October',
            desc: 'A stunning high-altitude pass on the Mughal Road, draped in alpine meadows and mist. The drive across Pir Panjal ridge is one of the most scenic in the region.',
            experience: 'The Mughal Road was shrouded in low cloud as I crossed Peer Ki Gali. The alpine meadow appeared out of the mist like something from another world — vast, silent, and impossibly green.',
            tips: ['Road is open June–November; check BRO updates.', 'Carry food and water — very few dhabas.'],
            stats: [{ label: 'Altitude', value: '3,490 m' }, { label: 'Route', value: 'Mughal Road' }],
            type: 'road'
          },
          { id: 'dera-ki-gali', name: 'Dera Ki Gali', emoji: '🏕️', lat: 33.85, lng: 74.12, elevation: '3,200m', desc: 'Dense pine forests and open grasslands on the Pir Panjal ridge, ideal for camping.', type: 'trek' },
          { id: 'dharal', name: 'Dharal Waterfall', emoji: '🌲', lat: 33.55, lng: 74.81, elevation: '1,800m', desc: 'A stunning waterfall in a quiet Gujjar village in the Chenab valley, gateway to untouched alpine meadows.', type: 'scenic' },
          { id: 'bakori', name: 'Bakori', emoji: '🗺️', lat: 33.52, lng: 73.89, elevation: '1,400m', desc: 'Near JNV Kotranka / Budhal — largely unexplored and far off any tourist circuit.', type: 'road' },
        ],
      },
      {
        id: 'jammu', name: 'Jammu',
        lat: 33.18, lng: 75.28, zoom: 11, tilt: 55, heading: 0,
        places: [
          { id: 'patnitop', name: 'Patnitop', emoji: '🏔️', lat: 33.21, lng: 75.31, elevation: '2,024m', desc: 'A hill station blanketed in snow in winter, offering skiing and meadow treks in summer.', type: 'adventure' },
          { id: 'nathatop', name: 'Nathatop', emoji: '🌄', lat: 33.19, lng: 75.28, elevation: '2,700m', desc: 'A breathtaking viewpoint above Patnitop with sweeping views of the Chenab Valley.', type: 'scenic' },
          { id: 'sanasar', name: 'Sanasar Lake', emoji: '🏞️', lat: 33.15, lng: 75.25, elevation: '2,050m', desc: 'A serene bowl-shaped meadow with a glacial lake — silent and perfect for camping.', type: 'lake' },
        ],
      },
      {
        id: 'kashmir-valley', name: 'Kashmir Valley',
        lat: 34.20, lng: 75.10, zoom: 10, tilt: 55, heading: 0,
        places: [
          { id: 'zojila-pass', name: 'Zojila Pass', emoji: '🏔️', lat: 34.21, lng: 75.47, elevation: '3,528m', desc: 'The dramatic gateway between Kashmir and Ladakh — open only in summer.', type: 'road' },
          { 
            id: 'srinagar', name: 'Srinagar', emoji: '🛶', lat: 34.08, lng: 74.79, elevation: '1,585m',
            meta: 'Summer capital of J&K', season: 'March – October',
            desc: 'The summer capital of J&K — Dal Lake houseboats, Mughal gardens, and the fragrance of saffron fields at every turn.',
            experience: 'Waking up on a houseboat on Dal Lake as the shikara men begin their morning rounds is one of travel\'s finest pleasures.',
            tips: ['Negotiate shikara prices before boarding.', 'Visit Nishat Bagh early morning.'],
            stats: [{ label: 'Altitude', value: '1,585 m' }, { label: 'Famous For', value: 'Dal Lake, Houseboats' }],
            type: 'scenic'
          },
          { 
            id: 'sonmarg-jk', name: 'Sonmarg', emoji: '🌾', lat: 34.30, lng: 75.29, elevation: '2,800m',
            meta: 'Meadow of Gold', season: 'May – October',
            desc: '"Meadow of Gold" — a glacial valley at the end of Kashmir, just before Ladakh begins.',
            experience: 'Sonmarg surprised me with its scale. I found a wide glacial valley fringed with soaring peaks.',
            tips: ['Hire a local guide for trekking.', 'Arrive early to avoid crowds.'],
            stats: [{ label: 'Altitude', value: '2,800 m' }, { label: 'Distance', value: '80 km from Srinagar' }],
            type: 'trek'
          },
        ],
      },
    ],
  },

  /* ── 2. LADAKH ──────────────────────────────────────────────────── */
  {
    id: 'ladakh', name: 'Ladakh', state: 'Union Territory', emoji: '🏜️',
    lat: 33.90, lng: 77.50, zoom: 9, tilt: 60, heading: 10,
    elevation: '3,500–5,600m', maxAlt: '5,359m (Khardung La)',
    badge: 'Land of High Passes',
    cardDesc: 'A dramatic high-altitude desert where turquoise lakes mirror jagged peaks and whitewashed monasteries guard ancient Silk Road trade routes.',
    tags: ['lakes', 'monasteries', 'biking', 'adventure'],
    travelTypes: ['road', 'adventure', 'spiritual'],
    subregions: [
      {
        id: 'leh-beyond', name: 'Leh & Beyond',
        places: [
          { id: 'leh', name: 'Leh', emoji: '🏯', lat: 34.15, lng: 77.58, elevation: '3,524m', desc: 'The legendary capital of Ladakh — ancient monasteries, prayer flags and the widest skies you have ever seen.', type: 'spiritual' },
          { id: 'gurudwara-pathar-sahib', name: 'Gurudwara Pathar Sahib', emoji: '🛕', lat: 34.12, lng: 77.26, elevation: '3,500m', desc: 'A sacred Sikh shrine 25km from Leh, embedded into the mountain itself.', type: 'spiritual' },
          { id: 'khardung-la', name: 'Khardung La', emoji: '🚵', lat: 34.28, lng: 77.60, elevation: '5,359m', desc: 'One of the world\'s highest motorable roads — the gateway to the Nubra Valley.', type: 'road' },
          { 
            id: 'pangong-tso', name: 'Pangong Tso', emoji: '🌊', lat: 33.76, lng: 78.63, elevation: '4,350m',
            meta: 'Endorheic high-altitude lake', season: 'May – September',
            desc: 'A 134-km-long lake stretching from India into Tibet at an altitude of 4,350 m. Shifting palette of azure and turquoise.',
            experience: 'Nothing prepares you for Pangong. An impossible stripe of electric blue wedged between rust-coloured mountains.',
            tips: ['Inner Line Permit (ILP) is mandatory.', 'Carry extra water and snacks.'],
            stats: [{ label: 'Altitude', value: '4,350 m' }, { label: 'Length', value: '134 km' }],
            type: 'lake'
          },
          { 
            id: 'nubra-valley', name: 'Nubra Valley', emoji: '🐪', lat: 34.57, lng: 77.58, elevation: '3,150m',
            meta: 'Valley of flowers & sand dunes', season: 'June – September',
            desc: 'Startling juxtaposition of landscapes — white sand dunes alongside the braided Shyok River and lush apricot orchards.',
            experience: 'Crossing Khardung La felt like being launched into space. The sand dunes at Hunder were surreal.',
            stats: [{ label: 'Altitude', value: '3,150 m' }, { label: 'Distance', value: '120 km from Leh' }],
            type: 'road'
          },
        ],
      },
    ],
  },

  /* ── 3. HIMACHAL PRADESH — 3-level hierarchy ────────────────────── */
  {
    id: 'himachal-pradesh', name: 'Himachal Pradesh', state: 'Himachal Pradesh', emoji: '⛰️',
    lat: 32.00, lng: 77.10, zoom: 9, tilt: 55, heading: 330,
    elevation: '640–3,978m', maxAlt: '3,978m (Rohtang)',
    badge: 'Dev Bhoomi',
    cardDesc: 'Manali to Lahaul, Shimla to Kinnaur — Himachal is a state that keeps revealing itself the further you push into the mountains.',
    tags: ['manali', 'kullu', 'lahaul', 'kinnaur'],
    travelTypes: ['road', 'trek', 'adventure'],
    showSubRegionsFirst: true,
    subregions: [
      {
        id: 'kullu', name: 'Kullu-Manali',
        lat: 32.28, lng: 77.19, zoom: 10.5, tilt: 55, heading: 0,
        places: [
          { 
            id: 'manali', name: 'Manali', emoji: '🏘️', lat: 32.24, lng: 77.19, elevation: '2,050m',
            meta: 'Adventure base · Kullu Valley', season: 'Year-round',
            desc: 'The adventure capital of Himachal — starting gun for Spiti, Lahaul and Ladakh expeditions.',
            experience: 'Manali is the last town before the mountains swallow the road. A town permanently on the edge of departure.',
            tips: ['Old Manali has better cafes.', 'Stay in Sethan to escape crowds.'],
            stats: [{ label: 'Altitude', value: '2,050 m' }, { label: 'Capital', value: 'Adventure' }],
            type: 'road'
          },
          { id: 'solang-valley', name: 'Solang Valley', emoji: '🎿', lat: 32.33, lng: 77.15, elevation: '2,480m', desc: 'World-class skiing in winter, paragliding in summer.', type: 'adventure' },
          { id: 'rohtang-pass', name: 'Rohtang Pass', emoji: '🏔️', lat: 32.37, lng: 77.24, elevation: '3,978m', desc: 'The great divide between green Kullu Valley and the cold desert of Lahaul.', type: 'road' },
          { id: 'sethan', name: 'Sethan', emoji: '❄️', lat: 32.19, lng: 77.24, elevation: '2,750m', desc: 'A hidden shoulder above Manali that becomes a complete snowfield in winter.', type: 'scenic' },
        ],
      },
      {
        id: 'mandi', name: 'Mandi',
        lat: 31.71, lng: 76.93, zoom: 11, tilt: 50, heading: 0,
        places: [
          { id: 'prashar-lake', name: 'Prashar Lake', emoji: '💎', lat: 31.77, lng: 77.06, elevation: '2,730m', desc: 'High-altitude glacial lake with a three-tiered pagoda temple.', type: 'trek' },
          { id: 'rewalsar-lake', name: 'Rewalsar Lake', emoji: '🌊', lat: 31.64, lng: 76.83, elevation: '1,360m', desc: 'Sacred lake revered by Hindus, Buddhists and Sikhs.', type: 'lake' },
        ],
      },
      {
        id: 'lahaul', name: 'Lahaul',
        lat: 32.55, lng: 77.05, zoom: 10, tilt: 55, heading: 350,
        places: [
          { id: 'jispa', name: 'Jispa', emoji: '🌊', lat: 32.65, lng: 77.05, elevation: '3,200m', desc: 'A riverside camp on the pristine Bhaga River — my favourite stop on the Manali–Leh route.', type: 'scenic' },
          { id: 'sissu', name: 'Sissu', emoji: '💧', lat: 32.43, lng: 77.24, elevation: '3,100m', desc: 'Village above the Atal Tunnel exit with a dramatic waterfall.', type: 'scenic' },
        ],
      },
      {
        id: 'kinnaur', name: 'Kinnaur',
        lat: 31.60, lng: 78.35, zoom: 11, tilt: 55, heading: 20,
        places: [
          { 
            id: 'kalpa', name: 'Kalpa', emoji: '🍎', lat: 31.54, lng: 78.26, elevation: '2,960m',
            meta: 'Kinnaur · Kinner Kailash views', season: 'April – November',
            desc: 'A Kinnauri village overlooking the Kinner Kailash range — sunrise turns the peaks completely pink.',
            experience: 'I woke at 5:30 AM in Kalpa and stepped outside into complete silence. Kinner Kailash was rose and gold.',
            tips: ['Book early; limited stays.', 'Apple season is August–October.'],
            stats: [{ label: 'Altitude', value: '2,960 m' }, { label: 'Fruit', value: 'Apples' }],
            type: 'scenic'
          },
          { id: 'chitkul', name: 'Chitkul', emoji: '🏔️', lat: 31.36, lng: 78.43, elevation: '3,450m', desc: 'The last inhabited village before the Indo-China border — raw and remote.', type: 'road' },
        ],
      },
    ],
  },

  /* ── 4. UTTARAKHAND ─────────────────────────────────────────────── */
  {
    id: 'uttarakhand', name: 'Uttarakhand', state: 'Uttarakhand', emoji: '🌿',
    lat: 30.55, lng: 79.00, zoom: 9, tilt: 55, heading: 10,
    elevation: '1,500–6,638m', maxAlt: '3,583m (Kedarnath)',
    badge: 'Dev Bhoomi',
    cardDesc: 'The abode of the gods — glacial rivers carve through dense oak forests while ancient temples and wildflower meadows dot the high Garhwal Himalayas.',
    tags: ['pilgrimage', 'trekking', 'wildflowers', 'rivers'],
    travelTypes: ['trek', 'spiritual'],
    subregions: [
      {
        id: 'garhwal', name: 'Garhwal',
        places: [
          { 
            id: 'kedarnath', name: 'Kedarnath', emoji: '⛩️', lat: 30.74, lng: 79.07, elevation: '3,583m',
            meta: 'Sacred Shiva temple', season: 'May – June, Sep – Oct',
            desc: 'One of the twelve Jyotirlingas, perched at 3,583 m. Survived miracles for over 1,200 years.',
            experience: 'The 16-km trek from Gaurikund is a pilgrimage in every sense. Grey stone against white snow.',
            tips: ['Start the trek by 5 AM.', 'Prepare for rapid weather changes.'],
            stats: [{ label: 'Altitude', value: '3,583 m' }, { label: 'Trek', value: '16 km' }],
            type: 'spiritual'
          },
          { 
            id: 'valley-of-flowers', name: 'Valley of Flowers', emoji: '🌸', lat: 30.73, lng: 79.61, elevation: '3,658m',
            meta: 'UNESCO World Heritage Site', season: 'July – September',
            desc: 'A high-altitude valley carpeted with over 600 species of rare flowering plants.',
            experience: 'Walking here felt like stepping through a portal. Waves of deep violet and golden potentillas.',
            tips: ['Visit in late July for peak bloom.', 'Wear waterproof trekking shoes.'],
            stats: [{ label: 'Altitude', value: '3,658 m' }, { label: 'Species', value: '600+' }],
            type: 'trek'
          },
        ],
      },
    ],
  },
]

/* ── Helpers ─────────────────────────────────────────────────────── */
export function countPlaces(region: HimalayaRegion): number {
  return region.subregions.reduce((n, sr) => n + sr.places.length, 0)
}
