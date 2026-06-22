/* ═══════════════════════════════════════════════════════════════════
 *  himalaya.ts — Hierarchical data for the 4-region Himalayan atlas
 * ═══════════════════════════════════════════════════════════════════ */

import { buildRootCloudinaryUrl } from '../lib/cloudinary'

export type PlaceType = 'road' | 'trek' | 'spiritual' | 'scenic' | 'adventure' | 'lake'

/* ── Discriminated union on TrekStop.type ──────────────────────────
 *  'photo' and 'video' stops REQUIRE a mediaUrl; 'text' and 'summit'
 *  never carry one (mediaUrl is absent from those branches entirely).
 *  This lets TypeScript narrow mediaUrl to `string` (never undefined)
 *  inside photo/video branches without a non-null assertion.
 * ─────────────────────────────────────────────────────────────────── */
type TrekStopBase = {
  id:             string
  scrollDepth:    number        // 0–100 — percentage of page scroll
  altitude:       number        // metres
  title:          string
  moment:         string        // Space Mono field-notes captions
  cinematicText?: string        // Playfair italic emotional narration
  coordinates?:   { lat: number; lng: number }
  aspectRatio?:   string        // optional CSS aspect ratio, e.g., '3/4', '16/9'
}

export type TrekStop =
  | (TrekStopBase & { type: 'text';    mediaUrl?: never })
  | (TrekStopBase & { type: 'summit';  mediaUrl?: string })  // summit MAY have a hero image
  | (TrekStopBase & { type: 'photo';   mediaUrl: string })   // photo MUST have an image URL
  | (TrekStopBase & { type: 'video';   mediaUrl: string })   // video MUST have a YouTube ID

export interface HimalayaPlace {
  id:          string
  name:        string
  meta?:       string        // "Gateway town · Spiti HQ"
  emoji:       string        // used as fallback when no image
  image?:      string        // optional custom icon path (relative to /public)
  lat:         number
  lng:         number
  heading?:    number        // ideal compass bearing for fly-to camera
  elevation?:  string
  season?:     string
  desc:        string
  experience?: string
  tips?:       string[]
  stats?:      HimalayaStat[]
  videos?:     HimalayaVideo[]
  trekStops?:  TrekStop[]
  trekPath?: Array<{ lat: number; lng: number }>  // Route polyline drawn on map after fly-to
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

/* ── Cinematic camera preset ─────────────────────────────────────── */
export interface CameraPreset {
  lat:     number
  lng:     number
  zoom:    number
  tilt:    number
  heading: number
}

export interface HimalayaSubRegion {
  id:       string
  name:     string
  lat?:     number          // position of sub-region marker (required if parent has showSubRegionsFirst)
  lng?:     number
  zoom?:    number
  tilt?:    number
  heading?: number
  camera?:  CameraPreset    // cinematic angle for this sub-region
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
  camera?:             CameraPreset   // cinematic angle for region overview
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
    lat: 33.50, lng: 74.80, zoom: 9, tilt: 65, heading: 350,
    camera: { lat: 33.20, lng: 74.80, zoom: 9, tilt: 65, heading: 350 },
    elevation: '1,400–3,528m', maxAlt: '3,528m (Zojila)',
    badge: 'Paradise on Earth',
    cardDesc: 'From the alpine meadows of Rajouri to the Dal Lake houseboats of Srinagar — J&K is where every road leads to something extraordinary.',
    tags: ['kashmir', 'rajouri', 'passes', 'meadows'],
    travelTypes: ['road', 'scenic', 'spiritual'],
    showSubRegionsFirst: true,
    subregions: [
      {
        id: 'rajouri', name: 'Rajouri',
        lat: 33.47, lng: 74.43, zoom: 10.8, tilt: 60, heading: 0,
        camera: { lat: 33.2200, lng: 74.4000, zoom: 10.5, tilt: 75, heading: 0 },
        places: [
          { 
            id: 'rajouri-home', name: 'Ghar', emoji: '🏠', lat: 33.306694, lng: 74.349544, heading: 0, elevation: '915m', 
            desc: 'A personal sanctuary in the heart of Rajouri, where the hills meet the horizon.',
            trekPath: [
              { lat: 33.3088, lng: 74.3566 }, // LookAt position
              { lat: 33.306694, lng: 74.349544 }, // Ghar position
            ],
            type: 'scenic' 
          },
          { 
            id: 'peer-ki-gali', name: 'Peer Ki Gali', emoji: '🌿', lat: 33.6297724909923, lng: 74.51998442871115, heading: 180, elevation: '3,490m', 
            meta: 'High-altitude pass · Mughal Road', season: 'May – October',
            desc: 'A stunning high-altitude pass on the Mughal Road, draped in alpine meadows and mist. The drive across Pir Panjal ridge is one of the most scenic in the region.',
            experience: 'The Mughal Road was shrouded in low cloud as I crossed Peer Ki Gali. The alpine meadow appeared out of the mist like something from another world — vast, silent, and impossibly green.',
            tips: ['Road is open June–November; check BRO updates.', 'Carry food and water — very few dhabas.'],
            stats: [{ label: 'Altitude', value: '3,490 m' }, { label: 'Route', value: 'Mughal Road' }],
            trekPath: [
              { lat: 33.72, lng: 74.18 },  // Shopian side start
              { lat: 33.70, lng: 74.24 },  // Hirpora
              { lat: 33.67, lng: 74.38 },  // Upper switchbacks
              { lat: 33.6316, lng: 74.5368 }, // Pass approach
              { lat: 33.6297724909923, lng: 74.51998442871115 },  // Peer Ki Gali pass
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1800, title: 'Mughal Road begins', moment: 'The tarmac narrows. Pine forests close in on both sides of the Mughal Road.', type: 'text' },
              { id: 'forest', scrollDepth: 25, altitude: 2400, title: 'Through the pines', moment: 'The road climbs through dense deodar forest. Mist curls between the trunks.', type: 'photo', mediaUrl: '' },
              { id: 'meadow', scrollDepth: 50, altitude: 3100, title: 'Alpine meadows', moment: 'The treeline breaks. A vast green carpet rolls out beneath a grey sky.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 3490, title: 'Peer Ki Gali Pass', moment: 'The highest point on the Mughal Road. Nothing but meadow and mist and the Pir Panjal spine.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2800, title: 'Descending into Kashmir', moment: 'The road dips. The Valley is somewhere below, hidden in cloud.', type: 'text' },
            ],
            type: 'road'
          },
          { id: 'bakori', name: 'Bakori', emoji: '🗺️', lat: 33.3798561352325, lng: 74.49660914607517, heading: 300, elevation: '1,400m', desc: 'Near JNV Kotranka / Budhal — largely unexplored and far off any tourist circuit.',
            trekPath: [
              { lat: 33.36, lng: 74.52 },  // Budhal connection
              { lat: 33.3899, lng: 74.5132 },// Ridge overlook
              { lat: 33.3798561352325, lng: 74.49660914607517 },  // Bakori village center
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 900, title: 'Off the map', moment: 'No signboards. No tourists. Just a dirt road winding into Budhal valley.', type: 'text' },
              { id: 'village', scrollDepth: 50, altitude: 1200, title: 'Kotranka ridge', moment: 'The road climbs to a ridge. Below, terraced fields step down to a silver river.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 80, altitude: 1400, title: 'Bakori', moment: 'A crossroads village where the Pir Panjal begins to rise. Wild and untouched.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1100, title: 'Heading back', moment: 'The road back feels shorter. The mountains watch you leave.', type: 'text' },
            ],
            type: 'road' },
          { id: 'dera-ki-gali', name: 'Dera Ki Gali', emoji: '🏕️', lat: 33.58214546019835, lng: 74.3623380739086, heading: 140, elevation: '3,200m', desc: 'Dense pine forests and open grasslands on the Pir Panjal ridge, ideal for camping.',
            trekPath: [
              { lat: 33.51, lng: 74.34 },  // Thanamandi
              { lat: 33.53, lng: 74.35 },  // Climb start
              { lat: 33.55, lng: 74.38 },  // Forest approach
              { lat: 33.5686, lng: 74.4054 }, // Viewpoint 
              { lat: 33.58214546019835, lng: 74.3623380739086 },  // Dera Ki Gali top
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2000, title: 'The ridge path', moment: 'A narrow trail disappears into pine forest. The air smells of resin and rain.', type: 'text' },
              { id: 'pines', scrollDepth: 30, altitude: 2600, title: 'Deep in deodar', moment: 'Sunlight barely reaches the forest floor. Every sound is amplified.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 3200, title: 'Dera Ki Gali', moment: 'The trees give way to grassland. The Pir Panjal wind hits full force.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2400, title: 'Back through the trees', moment: 'The descent is quiet. Birdsong returns.', type: 'text' },
            ],
            type: 'trek' },
          { id: 'dharal', name: 'Dharal Water Fall', emoji: '🌲', lat: 33.49235317402844, lng: 74.44683246130484, heading: 270, elevation: '1,800m', desc: 'A stunning waterfall in a quiet Gujjar village in the Chenab valley, gateway to untouched alpine meadows.',
            trekPath: [
              { lat: 33.48, lng: 74.42 },  // Darhal bridge
              { lat: 33.485, lng: 74.44 }, // Village path
              { lat: 33.4979, lng: 74.4610 }, // Forest clearing
              { lat: 33.49235317402844, lng: 74.44683246130484 },  // Waterfall base
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1200, title: 'Gujjar village', moment: 'Smoke rises from mud-roof homes. Children wave from a wooden bridge.', type: 'text' },
              { id: 'trail', scrollDepth: 40, altitude: 1500, title: 'The forest trail', moment: 'The sound of water grows louder with every step through chestnut trees.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 1800, title: 'Dharal Waterfall', moment: 'A white column of water crashes into a rocky pool. Spray mists the entire clearing.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1300, title: 'The return', moment: 'Golden afternoon light filters through the canopy. The village reappears.', type: 'text' },
            ],
            type: 'scenic' },
        ],
      },
      {
        id: 'kashmir', name: 'Kashmir',
        lat: 34.20, lng: 75.10, zoom: 10, tilt: 55, heading: 0,
        camera: { lat: 34.10, lng: 74.70, zoom: 9.5, tilt: 65, heading: 330 },
        places: [
          { id: 'zojila-pass', name: 'Zojila Pass', emoji: '🏔️', lat: 34.21, lng: 75.47, heading: 90, elevation: '3,528m', desc: 'The dramatic gateway between Kashmir and Ladakh — open only in summer.',
            trekPath: [
              { lat: 34.18, lng: 75.33 },  // Sonmarg exit
              { lat: 34.19, lng: 75.38 },  // Lower switchbacks
              { lat: 34.20, lng: 75.43 },  // Snowfield approach
              { lat: 34.21, lng: 75.47 },  // Zojila summit
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2800, title: 'Sonmarg exit', moment: 'The last green valley disappears. Ahead is only rock and snow.', type: 'text' },
              { id: 'switchbacks', scrollDepth: 30, altitude: 3100, title: 'The switchbacks', moment: 'Trucks crawl. The road crumbles at the edges. One lane for both directions.', type: 'photo', mediaUrl: '' },
              { id: 'snowfield', scrollDepth: 55, altitude: 3350, title: 'Snowfields', moment: 'Walls of dirty snow line both sides. The world shrinks to gravel and ice.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 80, altitude: 3528, title: 'Zojila Pass', moment: 'The pass. Kashmir ends here. Ladakh begins beyond this wall of rock.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3200, title: 'Into Ladakh', moment: 'Brown mountains replace green. The desert begins.', type: 'text' },
            ],
            type: 'road' },
          { 
            id: 'sonmarg-jk', name: 'Sonmarg', emoji: '🌾', lat: 34.30, lng: 75.29, heading: 230, elevation: '2,800m',
            meta: 'Meadow of Gold', season: 'May – October',
            desc: '"Meadow of Gold" — a glacial valley at the end of Kashmir, just before Ladakh begins.',
            experience: 'Sonmarg surprised me with its scale. I found a wide glacial valley fringed with soaring peaks.',
            tips: ['Hire a local guide for trekking.', 'Arrive early to avoid crowds.'],
            stats: [{ label: 'Altitude', value: '2,800 m' }, { label: 'Distance', value: '80 km from Srinagar' }],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2200, title: 'The highway', moment: 'The Srinagar–Leh highway twists through poplar-lined corridors. Sonmarg is around the next bend.', type: 'text' },
              { id: 'valley', scrollDepth: 30, altitude: 2500, title: 'Valley floor', moment: 'The Sind river braids through a wide valley. Glaciers hang on every peak above.', type: 'photo', mediaUrl: '' },
              { id: 'glacier', scrollDepth: 55, altitude: 2700, title: 'Thajiwas Glacier', moment: 'Snow even in July. Ponies carry tourists but the walk is better alone.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 80, altitude: 2800, title: 'Meadow of Gold', moment: 'The meadow earns its name. Late light turns every blade of grass to gold.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2400, title: 'The road back', moment: 'Sonmarg shrinks in the mirror. Zojila waits ahead if you dare.', type: 'text' },
            ],
            type: 'trek'
          },
          { 
            id: 'dal-lake', name: 'Dal Lake', emoji: '🛶', lat: 34.08, lng: 74.79, heading: 310, elevation: '1,585m',
            meta: 'Summer capital of J&K', season: 'March – October',
            desc: 'The summer capital of J&K — Dal Lake houseboats, Mughal gardens, and the fragrance of saffron fields at every turn.',
            experience: 'Waking up on a houseboat on Dal Lake as the shikara men begin their morning rounds is one of travel\'s finest pleasures.',
            tips: ['Negotiate shikara prices before boarding.', 'Visit Nishat Bagh early morning.'],
            stats: [{ label: 'Altitude', value: '1,585 m' }, { label: 'Famous For', value: 'Dal Lake, Houseboats' }],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1585, title: 'Dal Gate', moment: 'The boulevard hums with shikara wallahs calling for passengers. The lake stretches ahead.', type: 'text' },
              { id: 'shikara', scrollDepth: 25, altitude: 1585, title: 'On the water', moment: 'The shikara glides through lotus gardens. Kingfishers dart between the stems.', type: 'photo', mediaUrl: '' },
              { id: 'houseboat', scrollDepth: 50, altitude: 1585, title: 'The houseboat', moment: 'Cedar-panelled rooms floating on still water. Tea arrives without being asked.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 1585, title: 'Dawn on Dal Lake', moment: 'The sun catches the Zabarwan hills. The whole lake turns to gold.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1585, title: 'Leaving the lake', moment: 'The boulevard crowds return. Dal Lake stays perfectly still behind you.', type: 'text' },
            ],
            type: 'scenic'
          },
        ],
      },
      {
        id: 'jammu', name: 'Jammu',
        lat: 33.18, lng: 75.28, zoom: 11, tilt: 55, heading: 0,
        camera: { lat: 33.10, lng: 75.25, zoom: 10.5, tilt: 62, heading: 10 },
        places: [
          { id: 'patnitop', name: 'Patnitop', emoji: '🏔️', lat: 33.21, lng: 75.31, heading: 200, elevation: '2,024m', desc: 'A hill station blanketed in snow in winter, offering skiing and meadow treks in summer.',
            trekPath: [
              { lat: 33.16, lng: 75.30 },  // NH44 turnoff
              { lat: 33.18, lng: 75.30 },  // Deodar forest entry
              { lat: 33.21, lng: 75.31 },  // Patnitop plateau
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1400, title: 'NH44 turnoff', moment: 'The highway bends upward. Chenab valley drops away behind you.', type: 'text' },
              { id: 'pines', scrollDepth: 35, altitude: 1700, title: 'Into the pines', moment: 'Deodar forest thickens. The air cools ten degrees in minutes.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 2024, title: 'Patnitop plateau', moment: 'A wide meadow opens — white in winter, impossibly green in summer.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1600, title: 'Back to the highway', moment: 'The warmth of the plains rises to meet you. Patnitop stays cold above.', type: 'text' },
            ],
            type: 'adventure' },
          { id: 'nathatop', name: 'Nathatop', emoji: '🌄', lat: 33.19, lng: 75.28, heading: 240, elevation: '2,700m', desc: 'A breathtaking viewpoint above Patnitop with sweeping views of the Chenab Valley.',
            trekPath: [
              { lat: 33.21, lng: 75.31 },  // Above Patnitop
              { lat: 33.20, lng: 75.29 },  // Switchback climb
              { lat: 33.19, lng: 75.28 },  // Nathatop viewpoint
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2024, title: 'Above Patnitop', moment: 'The road beyond Patnitop narrows. Clouds sit at eye level.', type: 'text' },
              { id: 'climb', scrollDepth: 40, altitude: 2400, title: 'The climb', moment: 'Each switchback reveals more of the Chenab valley below.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 2700, title: 'Nathatop viewpoint', moment: 'A 180-degree panorama. The Chenab is a silver thread thousands of feet below.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2200, title: 'Descending', moment: 'Sunset paints the western sky gold. The viewpoint disappears behind a ridge.', type: 'text' },
            ],
            type: 'scenic' },
          { id: 'sanasar', name: 'Sanasar', emoji: '🏞️', lat: 33.15, lng: 75.25, heading: 160, elevation: '2,050m', desc: 'A serene bowl-shaped meadow with a glacial lake — silent and perfect for camping.',
            trekPath: [
              { lat: 33.17, lng: 75.27 },  // Meadow path start
              { lat: 33.16, lng: 75.26 },  // Wildflower slope
              { lat: 33.15, lng: 75.25 },  // Sanasar Lake bowl
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1800, title: 'The meadow path', moment: 'A flat trail leads through wildflowers toward a bowl in the hills.', type: 'text' },
              { id: 'approach', scrollDepth: 40, altitude: 1950, title: 'Approaching the bowl', moment: 'The terrain dips. Trees ring a hidden depression in the mountainside.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 2050, title: 'Sanasar Lake', moment: 'A glacial mirror in a meadow bowl. The silence is total.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1850, title: 'Leaving the bowl', moment: 'The lake vanishes behind the rim. You carry the silence with you.', type: 'text' },
            ],
            type: 'lake' },
        ],
      },
    ],
  },

  /* ── 2. LADAKH ──────────────────────────────────────────────────── */
  {
    id: 'ladakh', name: 'Ladakh', state: 'Union Territory', emoji: '🏜️',
    lat: 33.90, lng: 77.50, zoom: 9, tilt: 60, heading: 10,
    camera: { lat: 33.80, lng: 77.60, zoom: 9, tilt: 67.5, heading: 320 },
    elevation: '3,500–5,600m', maxAlt: '5,359m (Khardung La)',
    badge: 'Land of High Passes',
    cardDesc: 'A dramatic high-altitude desert where turquoise lakes mirror jagged peaks and whitewashed monasteries guard ancient Silk Road trade routes.',
    tags: ['lakes', 'monasteries', 'biking', 'adventure'],
    travelTypes: ['road', 'adventure', 'spiritual'],
    showSubRegionsFirst: true,
    subregions: [
      {
        id: 'leh-beyond', name: 'Leh & Beyond',
        lat: 34.0, lng: 77.5, zoom: 9.5, tilt: 60, heading: 0,
        places: [
          { id: 'leh', name: 'Leh', emoji: '☸️', lat: 34.15, lng: 77.58, heading: 280, elevation: '3,524m', desc: 'The legendary capital of Ladakh — ancient monasteries, prayer flags and the widest skies you have ever seen.',
            trekPath: [
              { lat: 34.14, lng: 77.57 },  // Old town bazaar
              { lat: 34.15, lng: 77.58 },  // Leh Palace
              { lat: 34.16, lng: 77.58 },  // Shanti Stupa hill
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3500, title: 'Leh town', moment: 'Prayer flags snap in the wind above whitewashed walls. The palace watches over everything.', type: 'text' },
              { id: 'palace', scrollDepth: 30, altitude: 3524, title: 'Leh Palace', moment: 'Nine stories of mud-brick and timber. The Stok range fills the windows.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('leh-palace', 'png') },
              { id: 'summit', scrollDepth: 65, altitude: 3600, title: 'Shanti Stupa', moment: 'A white dome on a hill. The entire Indus valley unfolds below like a map.', type: 'summit', mediaUrl: buildRootCloudinaryUrl('shanti-stupa', 'png') },
              { id: 'descent', scrollDepth: 95, altitude: 3500, title: 'Back to the bazaar', moment: 'The old town hums. Chai steam rises from a roadside stall.', type: 'text' },
            ],
            type: 'spiritual' },
          { id: 'gurudwara-pathar-sahib', name: 'Gurudwara Pathar Sahib', emoji: '☬', lat: 34.12, lng: 77.26, heading: 320, elevation: '3,500m', desc: 'A sacred Sikh shrine 25km from Leh, embedded into the mountain itself.',
            trekPath: [
              { lat: 34.14, lng: 77.40 },  // Leh–Srinagar highway
              { lat: 34.13, lng: 77.33 },  // Magnetic hill approach
              { lat: 34.12, lng: 77.26 },  // Gurudwara Pathar Sahib
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3400, title: 'The approach', moment: 'The Leh–Srinagar highway cuts between magnetic hills. The shrine is in the rock itself.', type: 'text' },
              { id: 'shrine', scrollDepth: 50, altitude: 3500, title: 'Inside the mountain', moment: 'Cool air, oil lamps, and the sound of kirtan echoing off stone walls.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('gurudwara', 'png') },
              { id: 'summit', scrollDepth: 80, altitude: 3500, title: 'Pathar Sahib', moment: 'The boulder with the impression. Faith pressed into stone.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3400, title: 'Back on the highway', moment: 'The shrine disappears behind a bend. The magnetic hill pulls at the wheels.', type: 'text' },
            ],
            type: 'spiritual' },
          { id: 'khardung-la', name: 'Khardung La', emoji: '🚵', lat: 34.28, lng: 77.60, heading: 10, elevation: '5,359m', desc: 'One of the world\'s highest motorable roads — the gateway to the Nubra Valley.',
            trekPath: [
              { lat: 34.15, lng: 77.58 },  // Leh start
              { lat: 34.20, lng: 77.59 },  // South Pullu checkpoint
              { lat: 34.24, lng: 77.59 },  // Upper switchbacks
              { lat: 34.28, lng: 77.60 },  // Khardung La summit
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3524, title: 'Leaving Leh', moment: 'The road climbs immediately. Leh shrinks to a cluster of white dots.', type: 'text' },
              { id: 'south-pullu', scrollDepth: 20, altitude: 4200, title: 'South Pullu', moment: 'A military checkpoint. Permits checked. The oxygen thins noticeably.', type: 'photo', mediaUrl: '' },
              { id: 'switchbacks', scrollDepth: 40, altitude: 4800, title: 'The switchbacks', moment: 'Gravel roads cling to nothing. Prayer flags mark every bend.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 5359, title: 'Khardung La', moment: 'The top of the world. Wind so strong it steals your breath. Prayer flags in every direction.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 4500, title: 'Descending to Nubra', moment: 'The north face drops sharp. Nubra Valley waits — green and implausible — below.', type: 'text' },
            ],
            type: 'road' },
          { 
            id: 'pangong-tso', name: 'Pangong Tso', emoji: '🌊', lat: 33.76, lng: 78.63, heading: 260, elevation: '4,350m',
            meta: 'Endorheic high-altitude lake', season: 'May – September',
            desc: 'A 134-km-long lake stretching from India into Tibet at an altitude of 4,350 m. Shifting palette of azure and turquoise.',
            experience: 'Nothing prepares you for Pangong. An impossible stripe of electric blue wedged between rust-coloured mountains.',
            tips: ['Inner Line Permit (ILP) is mandatory.', 'Carry extra water and snacks.'],
            stats: [{ label: 'Altitude', value: '4,350 m' }, { label: 'Length', value: '134 km' }],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3524, title: 'Leaving Leh', moment: 'The road east begins flat, then rises. The Indus valley fades behind.', type: 'text' },
              { id: 'changla', scrollDepth: 20, altitude: 5360, title: 'Chang La', moment: 'The second-highest pass. Ice on the road even in July. Lungs burn.', type: 'photo', mediaUrl: '' },
              { id: 'plateau', scrollDepth: 45, altitude: 4600, title: 'The high plateau', moment: 'A brown emptiness stretches to every horizon. Marmots whistle from rock piles.', type: 'photo', mediaUrl: '' },
              { id: 'first-glimpse', scrollDepth: 65, altitude: 4400, title: 'First glimpse', moment: 'A line of impossible blue appears between two brown ridges. Your heart stops.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 85, altitude: 4350, title: 'Pangong Tso', moment: 'Electric blue stretching to the horizon. The water changes colour every hour. 134 kilometers of liquid sapphire.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 4350, title: 'Night at Pangong', moment: 'The Milky Way reflects in the lake. The silence is extraterrestrial.', type: 'text' },
            ],
            type: 'lake'
          },
          { 
            id: 'nubra-valley', name: 'Nubra Valley', emoji: '🐪', lat: 34.57, lng: 77.58, heading: 340, elevation: '3,150m',
            meta: 'Valley of flowers & sand dunes', season: 'June – September',
            desc: 'Startling juxtaposition of landscapes — white sand dunes alongside the braided Shyok River and lush apricot orchards.',
            experience: 'Crossing Khardung La felt like being launched into space. The sand dunes at Hunder were surreal.',
            stats: [{ label: 'Altitude', value: '3,150 m' }, { label: 'Distance', value: '120 km from Leh' }],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 5359, title: 'Over Khardung La', moment: 'The world\'s roof behind you. The road drops into a valley that shouldn\'t exist.', type: 'text' },
              { id: 'north-pullu', scrollDepth: 20, altitude: 4500, title: 'North Pullu descent', moment: 'Hairpins carved into dust. The valley floor beckons, green and improbable.', type: 'photo', mediaUrl: '' },
              { id: 'diskit', scrollDepth: 40, altitude: 3200, title: 'Diskit Monastery', moment: 'A giant Maitreya Buddha watches the valley. Apricot orchards line the road below.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 3050, title: 'Hunder Sand Dunes', moment: 'White sand dunes in the Himalayas. Bactrian camels move across like ghosts. Surreal doesn\'t begin to describe it.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3150, title: 'Village evening', moment: 'The Shyok river catches the last light. Stars come out impossibly fast.', type: 'text' },
            ],
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
    camera: { lat: 31.80, lng: 77.20, zoom: 9, tilt: 60, heading: 340 },
    elevation: '640–3,978m', maxAlt: '3,978m (Rohtang)',
    badge: 'Abode of Snow',
    cardDesc: 'Manali to Lahaul, Shimla to Kinnaur — Himachal is a state that keeps revealing itself the further you push into the mountains.',
    tags: ['manali', 'kullu', 'lahaul', 'kinnaur'],
    travelTypes: ['road', 'trek', 'adventure'],
    showSubRegionsFirst: true,
    subregions: [
      {
        id: 'kullu', name: 'Kullu-Manali',
        lat: 32.28, lng: 77.19, zoom: 10.5, tilt: 55, heading: 0,
        camera: { lat: 32.15, lng: 77.10, zoom: 12, tilt: 65, heading: 330 },
        places: [
          { 
            id: 'manali', name: 'Manali', emoji: '🏘️',
            image: buildRootCloudinaryUrl('manali', 'png'),
            lat: 32.24, lng: 77.19, heading: 330, elevation: '2,050m',
            meta: 'Adventure base · Kullu Valley', season: 'Year-round',
            desc: 'The adventure capital of Himachal — starting gun for Spiti, Lahaul and Ladakh expeditions.',
            experience: 'Manali is the last town before the mountains swallow the road. A town permanently on the edge of departure.',
            tips: ['Old Manali has better cafes.', 'Stay in Sethan to escape crowds.'],
            stats: [{ label: 'Altitude', value: '2,050 m' }, { label: 'Capital', value: 'Adventure' }],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1800, title: 'Kullu Valley road', moment: 'The Beas river races alongside. Apple orchards on every slope.', type: 'text' },
              { id: 'mall-road', scrollDepth: 25, altitude: 1950, title: 'Mall Road', moment: 'Tourist buzz, gear shops, and the smell of momos drifting from every lane.', type: 'photo', mediaUrl: '' },
              { id: 'old-manali', scrollDepth: 50, altitude: 2050, title: 'Old Manali', moment: 'Stone paths wind uphill. Backpacker cafés serve Israeli food and Himalayan chai.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 2050, title: 'Edge of departure', moment: 'Every road leads out and up. Spiti, Rohtang, Solang — pick your mountain.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1900, title: 'Dusk on the Beas', moment: 'The river quiets. The town glows amber against dark peaks.', type: 'text' },
            ],
            type: 'road'
          },
          { id: 'solang-valley', name: 'Solang Valley', emoji: '🎿', image: buildRootCloudinaryUrl('solang', 'png'), lat: 32.33, lng: 77.15, heading: 350, elevation: '2,480m', desc: 'World-class skiing in winter, paragliding in summer.',
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2050, title: 'Leaving Manali', moment: 'The road climbs north. Deodar forest flanks both sides.', type: 'text' },
              { id: 'gondola', scrollDepth: 35, altitude: 2300, title: 'The gondola base', moment: 'A cable car station at the valley mouth. Snow peaks fill every window.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 2480, title: 'Solang Valley', moment: 'A wide white bowl in winter. A green amphitheatre in summer. Always dramatic.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2200, title: 'The return', moment: 'Paragliders drift overhead. The valley catches the last golden light.', type: 'text' },
            ],
            type: 'adventure' },
          {
            id: 'rohtang-pass', name: 'Rohtang Pass', emoji: '🏔️',
            image: buildRootCloudinaryUrl('27_Main2'),
            lat: 32.37, lng: 77.25, heading: 280, elevation: '3,978m',
            meta: 'The Accidental Ascent · October', season: 'May – October',
            desc: 'We went for a scooty ride and ended up climbing Rohtang Pass on foot — through snow, no trail, in town shoes — reaching the top alone at sunset.',
            experience: 'We crossed the Atal Tunnel on a scooty, got stopped at Koksar, and decided to hike "a bit". Six and a half hours later we reached Rohtang at sunset, the only two people on the pass. One vehicle came down — they\'d lost a phone and turned back to find it. They took us home.',
            tips: [
              'Cross Atal Tunnel early — saves 2+ hours vs the old Rohtang road.',
              'If you hike from Koksar side, the snow is deep in October with no trail — start very early.',
              'Dress for the mountain, not the scooty. Cold feet on snow are no joke.',
              'The pass is deserted after tourist season ends. Carry food and water.',
            ],
            stats: [
              { label: 'Altitude',  value: '3,978 m' },
              { label: 'Duration',  value: '6.5 hrs on foot' },
              { label: 'Distance',  value: '~18 km total' },
              { label: 'Season',    value: 'Oct (off-season)' },
            ],
            trekPath: [
              // Real GPS track from Rohtangtrekroute.kml
              { lat: 32.394570, lng: 77.257042 },
              { lat: 32.393390, lng: 77.257237 },
              { lat: 32.392604, lng: 77.257661 },
              { lat: 32.392354, lng: 77.257990 },
              { lat: 32.392005, lng: 77.258440 },
              { lat: 32.391597, lng: 77.258691 },
              { lat: 32.391381, lng: 77.258395 },
              { lat: 32.391060, lng: 77.258375 },
              { lat: 32.390859, lng: 77.257885 },
              { lat: 32.390723, lng: 77.257413 },
              { lat: 32.390293, lng: 77.257245 },
              { lat: 32.389979, lng: 77.257520 },
              { lat: 32.389243, lng: 77.257313 },
              { lat: 32.389617, lng: 77.256453 },
              { lat: 32.390361, lng: 77.256093 },
              { lat: 32.390541, lng: 77.255828 },
              { lat: 32.390404, lng: 77.255440 },
              { lat: 32.389971, lng: 77.254804 },
              { lat: 32.389584, lng: 77.254232 },
              { lat: 32.389417, lng: 77.253504 },
              { lat: 32.391286, lng: 77.253253 },
              { lat: 32.392484, lng: 77.251798 },
              { lat: 32.392646, lng: 77.251355 },
              { lat: 32.391312, lng: 77.252593 },
              { lat: 32.389821, lng: 77.252781 },
              { lat: 32.388254, lng: 77.253246 },
              { lat: 32.390393, lng: 77.252127 },
              { lat: 32.390967, lng: 77.251524 },
              { lat: 32.391768, lng: 77.251003 },
              { lat: 32.392013, lng: 77.250352 },
              { lat: 32.390146, lng: 77.251478 },
              { lat: 32.389412, lng: 77.251585 },
              { lat: 32.390882, lng: 77.250194 },
              { lat: 32.391624, lng: 77.249438 },
              { lat: 32.391404, lng: 77.249343 },
              { lat: 32.389469, lng: 77.250643 },
              { lat: 32.388468, lng: 77.251979 },
              { lat: 32.388207, lng: 77.251726 },
              { lat: 32.388927, lng: 77.250851 },
              { lat: 32.390697, lng: 77.248223 },
              { lat: 32.386660, lng: 77.251517 },
              { lat: 32.388148, lng: 77.249630 },
              { lat: 32.389525, lng: 77.247715 },
              { lat: 32.389482, lng: 77.247394 },
              { lat: 32.389169, lng: 77.247782 },
              { lat: 32.388068, lng: 77.249073 },
              { lat: 32.386554, lng: 77.250107 },
              { lat: 32.385899, lng: 77.250683 },
              { lat: 32.385442, lng: 77.250871 },
              { lat: 32.386343, lng: 77.249336 },
              { lat: 32.388099, lng: 77.247174 },
              { lat: 32.388483, lng: 77.246165 },
              { lat: 32.387229, lng: 77.247430 },
              { lat: 32.385387, lng: 77.248892 },
              { lat: 32.382875, lng: 77.251280 },
              { lat: 32.382753, lng: 77.250903 },
              { lat: 32.383442, lng: 77.249976 },
              { lat: 32.384545, lng: 77.248612 },
              { lat: 32.386942, lng: 77.246031 },
              { lat: 32.385028, lng: 77.247804 },
              { lat: 32.383568, lng: 77.248878 },
              { lat: 32.380421, lng: 77.250939 },
              { lat: 32.379146, lng: 77.252311 },
              { lat: 32.377547, lng: 77.250795 },
              { lat: 32.375272, lng: 77.249516 },
              { lat: 32.372999, lng: 77.248059 },
            ],
            trekStops: [
              // ── Ch 01: Dawn in Manali ──────────────────────────────
              { id: 'photo-01',       scrollDepth: 0,  altitude: 2050, title: 'Manali · Early Morning', moment: 'Night bus. Cold air. No plan. The town asleep, peaks catching first light.', cinematicText: 'Every accidental journey starts somewhere.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('1_ReachedManaliEarlyMorning'), aspectRatio: '3/4' },
              { id: 'photo-02',       scrollDepth: 4,  altitude: 2050, title: 'Golden Sunrise', moment: 'Golden hour on the mountains.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('2_EarlyMorningSunriseGoldenMountainView'), aspectRatio: '9/20' },
              // ── Ch 02: Through the Atal Tunnel ─────────────────────
              { id: 'photo-03',       scrollDepth: 8,  altitude: 2300, title: 'On the Way', moment: 'Scooty pointed beyond the tunnel.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('3_WeDecidedToCrossTheGoBeyondAtalTunnelJustStartedOnthewaytoKoksarViaSolangValley'), aspectRatio: '16/9' },
              { id: 'photo-04',       scrollDepth: 11, altitude: 2480, title: 'Solang Valley', moment: 'Reached Solang. Mountains everywhere.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('4_ReachedSolangValley'), aspectRatio: '4/3' },
              { id: 'photo-05',       scrollDepth: 14, altitude: 3050, title: 'Snowy Peaks', moment: 'Snow-capped giants near the tunnel mouth.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('5SnowyMountainsNearbyAtalTunnelSouthPortal'), aspectRatio: '16/9' },
              { id: 'photo-06',       scrollDepth: 17, altitude: 3100, title: 'Atal Tunnel', moment: 'South portal. 8.8 km through the mountain.', cinematicText: 'One tunnel. Two worlds.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('6_AtalTunnelSouthPortal'), aspectRatio: '5/3' },
              { id: 'photo-07',       scrollDepth: 20, altitude: 3100, title: 'Crossed the Tunnel', moment: 'Lahaul opened up, brown and vast.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('7_CrossedTunnelAmazingViewOfMountains'), aspectRatio: '16/9' },
              { id: 'photo-07a',      scrollDepth: 22, altitude: 3100, title: 'A Good View', moment: 'Stopped. Looked. Kept going.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('7_1GoodView'), aspectRatio: '16/9' },
              { id: 'photo-08',       scrollDepth: 25, altitude: 3100, title: 'From the Scooty', moment: 'Breathtaking views at 40 km/h.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('8_breathTakingViewsFromOurScooty'), aspectRatio: '4/3' },
              { id: 'photo-09',       scrollDepth: 28, altitude: 3100, title: 'The Scenic Road', moment: 'The road itself was the destination.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('9_ScenericRoad'), aspectRatio: '4/3' },
              // ── Ch 03: Koksar — Where the Road Ends ────────────────
              { id: 'photo-10',       scrollDepth: 32, altitude: 3150, title: 'Koksar in Snow', moment: 'Reached Koksar. Snow on everything.', cinematicText: 'The road ends. The mountain begins.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('10_ReachedKoksarInSnow'), aspectRatio: '4/3' },
              { id: 'photo-11',       scrollDepth: 35, altitude: 3150, title: 'We Decided to Hike', moment: 'Scooty parked. We started walking.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('11_KoksarSnowWeDecidedToHikefromTheretoGetBetterViews'), aspectRatio: '16/9' },
              // ── Ch 04: Into the Snow. No Trail. ────────────────────
              { id: 'photo-12',       scrollDepth: 39, altitude: 3250, title: 'Started Hiking', moment: 'First steps into the white.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('12_StartedOurHikeTakingPhotos'), aspectRatio: '4/3' },
              { id: 'photo-13',       scrollDepth: 42, altitude: 3350, title: 'Mid-Climb', moment: 'Both of us, mid-slope, still smiling.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('13_BothofusinTheMiddleOfTheSteepClimp'), aspectRatio: '16/9' },
              { id: 'photo-14',       scrollDepth: 45, altitude: 3400, title: 'Cool Mountains', moment: 'The scale hit differently up here.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('14_coolMountiins'), aspectRatio: '16/9' },
              { id: 'photo-15',       scrollDepth: 48, altitude: 3500, title: 'We Have To Climb This', moment: 'Looking up. The slope didn\'t end.', cinematicText: 'The mountain doesn\'t care about your shoes.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('15_WeHaveToClimbThis'), aspectRatio: '3/4' },
              { id: 'photo-16',       scrollDepth: 51, altitude: 3550, title: 'Middle of the Mountains', moment: 'Surrounded. No trail. Just snow.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('16_InTheMiddleOftheMountains'), aspectRatio: '4/3' },
              // ── Ch 05: The Road Appears ────────────────────────────
              { id: 'photo-17',       scrollDepth: 61, altitude: 3700, title: 'Found the Road', moment: 'Exhausted. Decided to walk the road.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('17_WeHikedSteepSectionExaustedThenDecidedToCoverNextPartViaRoad'), aspectRatio: '4/3' },
              { id: 'photo-18',       scrollDepth: 64, altitude: 3750, title: 'Peaks and Road', moment: 'Snow peaks. Road covered in white.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('18_BreathtakingshowPeaksandRoadCoveredWithSnow'), aspectRatio: '3/4' },
              { id: 'photo-19',       scrollDepth: 67, altitude: 3800, title: 'Walking the Road', moment: 'Scenic views, cold feet, on foot.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('19_NowGoingFromTheRoadWithScenericViewsByourFoot'), aspectRatio: '4/3' },
              { id: 'photo-20',       scrollDepth: 70, altitude: 3850, title: 'Straight Road', moment: 'Empty road vanishing into snow.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('20_StraightRoadWithshow'), aspectRatio: '4/3' },
              { id: 'photo-21',       scrollDepth: 73, altitude: 3900, title: 'Valley in Snow', moment: 'Mountain valley buried in white.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('21_MountainFulleyCoveredWithSnow'), aspectRatio: '4/3' },
              // ── Ch 06: Rohtang at Sunset. Alone. ───────────────────
              { id: 'photo-23',       scrollDepth: 75, altitude: 3930, title: 'The View at the Top', moment: 'Climb may be tough. View is always better.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('23_TheClimbMayBeToughButTheViewAtTheTopIsAlwaysBetter'), aspectRatio: '4/3' },
              { id: 'photo-24',       scrollDepth: 77, altitude: 3950, title: 'Finally Reached', moment: 'The last steps to the top.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('24_FinallyReached'), aspectRatio: '3/4' },
              { id: 'photo-25',       scrollDepth: 80, altitude: 3970, title: 'About to Sunset', moment: 'The sky starting to burn.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('25_AboutToSunSet'), aspectRatio: '4/3' },
              { id: 'photo-26',       scrollDepth: 83, altitude: 3978, title: 'Rohtang Top', moment: 'The summit. Nobody else. Just us.', cinematicText: '"Rohtang" means pile of corpses. We were the only ones alive on it.', type: 'summit', mediaUrl: buildRootCloudinaryUrl('26_MainRohtangTopPhoto'), aspectRatio: '3/4' },
              { id: 'photo-27',       scrollDepth: 86, altitude: 3978, title: 'The Summit', moment: 'Wind, prayer flags, the whole Himalaya.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('27_Main2'), aspectRatio: '4/3' },
              { id: 'photo-28',       scrollDepth: 90, altitude: 3978, title: 'Sunset', moment: 'The sun dropped behind the ridge.', type: 'photo', mediaUrl: buildRootCloudinaryUrl('28_Sunset'), aspectRatio: '4/3' },
              { id: 'rescue',         scrollDepth: 95, altitude: 3978, title: 'The Rescue', moment: 'A vehicle came back for a lost phone. Found us instead.', type: 'text' },
            ],
            type: 'trek',
          },
          { id: 'sethan', name: 'Sethan', emoji: '❄️', image: buildRootCloudinaryUrl('sethan', 'png'), lat: 32.2349, lng: 77.2223, heading: 40, elevation: '2,750m',
            season: 'December – March',
            desc: 'A hidden shoulder above Manali that becomes a complete snowfield in winter.', 
            experience: 'Visiting Sethan in mid-winter feels like stepping into a snow globe. The silence is absolute, broken only by the crunch of boots on fresh powder. With sweeping views of the Kullu Valley below, it is the perfect retreat from the bustling tourist crowds in Manali.',
            tips: ['Rent a 4x4 or hire a local cab from Manali, as the road gets completely iced over.', 'Pack heavy woollens and snow boots; it gets incredibly cold after sunset.', 'Stay in a traditional wooden homestay for an authentic experience.'],
            stats: [{ label: 'Altitude', value: '2,750 m' }, { label: 'Distance', value: '14 km from Manali' }, { label: 'Highlight', value: 'Snowboarding / Igloo Stays' }],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2050, title: 'Leaving Manali', moment: 'A narrow road branches off the highway. No signboard. Just a dirt track climbing steeply.', type: 'text' },
              { id: 'hairpins', scrollDepth: 20, altitude: 2300, title: 'Icy hairpins', moment: 'The 4x4 slips on black ice. The Kullu Valley drops away fast below.', type: 'photo', mediaUrl: '' },
              { id: 'treeline', scrollDepth: 40, altitude: 2500, title: 'Above the treeline', moment: 'The pines give way to snow. Pure white in every direction.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 2750, title: 'Sethan village', moment: 'A snow globe village. Wooden homes buried to their roofs. Silence so deep your ears ring.', type: 'summit' },
              { id: 'igloo', scrollDepth: 85, altitude: 2750, title: 'The igloo camp', moment: 'Sleeping inside carved snow. The cold is profound, the stars through the vent — infinite.', type: 'photo', mediaUrl: '' },
              { id: 'descent', scrollDepth: 95, altitude: 2200, title: 'Back to Manali', moment: 'The snow thins. Sound returns. The town feels loud after Sethan\'s silence.', type: 'text' },
            ],
            type: 'scenic' 
          },
          {
            id: 'patalsu-peak', name: 'Patalsu Peak', emoji: '⛰️',
            image: buildRootCloudinaryUrl('2clearviewofPatalsu', 'jpg'),
            lat: 32.3538, lng: 77.1910, heading: 200, elevation: '4,261m',
            meta: 'Non-technical summit · Solang Valley', season: 'May – October',
            desc: 'A non-technical high-altitude summit rising above Solang Valley, offering a 360° panorama of the Kullu and Lahaul ranges. One of the most rewarding day-summit treks from Manali.',
            experience: 'The final push to the Patalsu summit ridge was into a bitter wind, but the moment the clouds parted and I saw both Rohtang and the Dhauladhar range at once — completely worth it.',
            tips: ['Start by 5 AM to summit before afternoon clouds roll in.', 'Acclimatise for a day in Manali before attempting.', 'No technical gear required — good boots and layers are enough.'],
            stats: [{ label: 'Altitude', value: '4,220 m' }, { label: 'Trek', value: '12 km round trip' }, { label: 'Base', value: 'Solang Valley' }],
            trekPath: [
              // Real GPS track from KML — 36 waypoints (Solang Valley → Patalsu Summit)
              { lat: 32.3207084, lng: 77.153156  },
              { lat: 32.3213709, lng: 77.1544826 },
              { lat: 32.3218839, lng: 77.1556559 },
              { lat: 32.3211334, lng: 77.1578156 },
              { lat: 32.3223317, lng: 77.1597286 },
              { lat: 32.3235687, lng: 77.1566359 },
              { lat: 32.326734,  lng: 77.1575822 },
              { lat: 32.3283213, lng: 77.159604  },
              { lat: 32.3296138, lng: 77.1605406 },
              { lat: 32.3310674, lng: 77.1610072 },
              { lat: 32.3349906, lng: 77.1624455 },
              { lat: 32.333463,  lng: 77.1633435 },
              { lat: 32.3339763, lng: 77.1650009 },
              { lat: 32.3349343, lng: 77.1674097 },
              { lat: 32.3364746, lng: 77.1680582 },
              { lat: 32.3365693, lng: 77.1690923 },
              { lat: 32.3362317, lng: 77.1700603 },
              { lat: 32.3376497, lng: 77.1709858 },
              { lat: 32.3399232, lng: 77.1728621 },
              { lat: 32.3430227, lng: 77.17523   },
              { lat: 32.3454777, lng: 77.176108  },
              { lat: 32.346638,  lng: 77.1767026 },
              { lat: 32.3473727, lng: 77.1770514 },
              { lat: 32.3484296, lng: 77.177563  },
              { lat: 32.3507219, lng: 77.1789534 },
              { lat: 32.3516948, lng: 77.1797977 },
              { lat: 32.3519297, lng: 77.1814396 },
              { lat: 32.3522329, lng: 77.1831804 },
              { lat: 32.3522766, lng: 77.1844407 },
              { lat: 32.3529648, lng: 77.1865591 },
              { lat: 32.3515541, lng: 77.1880191 },
              { lat: 32.3523286, lng: 77.1895698 },
              { lat: 32.3532101, lng: 77.1905993 },
              { lat: 32.3539401, lng: 77.1906891 },
              { lat: 32.3547395, lng: 77.1916726 },
              { lat: 32.3547474, lng: 77.1938936 },  // Patalsu Summit
            ],
            trekStops: [
              { id: 'departure', scrollDepth: 0, altitude: 2050, title: 'Leaving Old Manali', moment: '09:30 AM. Starting out from Old Manali on a scooty, heading towards Solang Valley. The sun is up and the valley is awake.', cinematicText: 'Every journey starts with deciding to leave the familiar behind.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/1_oldmanali_viewofPatalsu.jpg' },
              { id: 'solang-road', scrollDepth: 7, altitude: 2235, title: 'The road to Solang', moment: 'Riding out of Old Manali before sunrise. Patalsu sits silent above the valley. You can feel it more than you can see it.', cinematicText: 'The mountain appears between the trees. Small. Distant. Yours.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/2clearviewofPatalsu.jpg' },
              { id: 'solang-dhaba', scrollDepth: 14, altitude: 2468, title: 'Solang Valley — last chai', moment: 'Reached Solang Valley as the stalls were just opening. Aalu parantha, sweet chai. The paragliders were still asleep.', cinematicText: 'The last taste of the valley before you leave it behind forever.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/3ReachedSolangValleyforBreakfast.jpg', aspectRatio: '3/4' },
              { id: 'going-to-village', scrollDepth: 21, altitude: 2520, title: 'Into the upper valley', moment: "The tourist road ends. Now it's a dirt track winding up toward Solang village. No cable cars here.", cinematicText: 'Above the noise, above the resorts, above the world that brought you here.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/4GoingtoSolangVillage.jpg' },
              { id: 'solang-village', scrollDepth: 28, altitude: 2582, title: 'Solang village', moment: 'Stone houses, wooden balconies. A shepherd crosses the path without looking up. You are officially off the map.', cinematicText: 'The cable cars and ski slopes give way to stone paths and centuries of silence.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/6SolangVillage.jpg' },
              { id: 'trail-start', scrollDepth: 35, altitude: 2650, title: 'The trail begins', moment: 'Two figures on a rocky path. The valley stretches below. The peak hides above. This is where the scooty stays.', cinematicText: 'This is where the road ends and the mountain begins. You choose to keep going.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/7trekStart.jpg' },
              { id: 'forest-entry', scrollDepth: 42, altitude: 2820, title: 'Into the forest', moment: 'Pine trees close in on both sides. Cattle graze in clearings between the trunks. The air carries pine resin and cold mud.', cinematicText: 'In the forest, time slows. Every step sounds like it matters.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/8intotheforestsectionCattleGrazing.jpg' },
              { id: 'dog-hiking', scrollDepth: 49, altitude: 3100, title: 'An unexpected companion', moment: 'A stray dog appeared at the treeline and decided to join the expedition. He moved faster than us on every switchback.', cinematicText: 'Some companions choose you. Not the other way around.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/v1777212310/9_1doghiking.jpg' },
              { id: 'above-treeline', scrollDepth: 56, altitude: 3500, title: 'Above the treeline', moment: 'The trees end abruptly. A vast, open sky. The Dhauladhar ranges appear — white and endless from horizon to horizon.', cinematicText: 'You are in the sky now. What was a valley is now a map.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/10abovetheTreelineViewOfDhauladharRanges.jpg' },
              { id: 'ridgeline', scrollDepth: 63, altitude: 3800, title: 'Into the ridgeline', moment: 'Loose scree. Wind picking up. The ridge is steep and exposed. Every ten steps — stop and breathe.', cinematicText: 'The mountain tests your patience before it rewards your persistence.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/11IntoRidgeline.jpg' },
              { id: 'hanuman-tibba-view', scrollDepth: 70, altitude: 3900, title: 'Hanuman Tibba reveals itself', moment: 'You are now eye-level with giants. Hanuman Tibba fills the entire view. 5,982 metres of pure Himalayan scale.', cinematicText: 'The scale of the Himalaya stops being abstract.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/13ViewOfHanumanTibba.jpg' },
              { id: 'summit-push', scrollDepth: 77, altitude: 4100, title: 'The final 200 metres', moment: 'Wind slams the ridge. Every step is on loose rock. Below — the entire Kullu valley. Ahead — just sky.', cinematicText: 'This is the part they never show in the photos. The part where you question everything.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/12FinalRidge.jpg' },
              { id: 'summit', scrollDepth: 85, altitude: 4261, title: 'Patalsu Peak — 4,261m', moment: 'Made it. 360 degrees of Himalayan sky. Rohtang to the east, Dhauladhar to the west. Nothing between you and the horizon.', cinematicText: 'Nothing for 360 degrees except sky. Range after range after range. You are the highest thing here.', type: 'summit', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/14SummitSelfie.jpg' },
              { id: 'golden-hour', scrollDepth: 92, altitude: 4261, title: 'Golden hour on the summit', moment: 'The late afternoon light turned everything amber. Hanuman Tibba caught fire. We sat and just watched.', cinematicText: 'Mountains at golden hour are a different religion entirely.', type: 'photo', mediaUrl: 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/15SunsetHanumanTibba.jpg' },
              { id: 'old-manali-return', scrollDepth: 100, altitude: 2050, title: 'Back to Old Manali', moment: 'The same road. The same scooty. The same cafés. But you are not the same person who left this morning.', cinematicText: 'The mountains give you back to the valley. Changed. Quieter. Better.', type: 'text' },
            ],
            videos: [
              { youtubeId: 'yinFLtDCJ3k', title: 'Patalsu Peak Trek — Cinematic Vlog', views: 'YouTube & Instagram', thumbUrl: 'https://img.youtube.com/vi/yinFLtDCJ3k/maxresdefault.jpg' }
            ],
            type: 'trek'
          },
        ],
      },
      {
        id: 'mandi', name: 'Mandi',
        lat: 31.71, lng: 76.93, zoom: 11, tilt: 50, heading: 0,
        places: [
          { id: 'prashar-lake', name: 'Prashar Lake', emoji: '💎', lat: 31.77, lng: 77.06, heading: 15, elevation: '2,730m', desc: 'High-altitude glacial lake with a three-tiered pagoda temple.',
            trekPath: [
              { lat: 31.70, lng: 77.03 },  // Baggi village trailhead
              { lat: 31.73, lng: 77.04 },  // Oak & rhododendron forest
              { lat: 31.75, lng: 77.05 },  // Ridge approach
              { lat: 31.77, lng: 77.06 },  // Prashar Lake
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1500, title: 'Baggi village', moment: 'The trek begins at a dusty trailhead. Shepherds wish you luck.', type: 'text' },
              { id: 'forest', scrollDepth: 30, altitude: 2000, title: 'Oak and rhododendron', moment: 'Red rhododendrons frame the path. The forest is alive with birdsong.', type: 'photo', mediaUrl: '' },
              { id: 'ridge', scrollDepth: 55, altitude: 2500, title: 'Ridge approach', moment: 'The Dhauladhar range appears through a gap in the trees. Close now.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 80, altitude: 2730, title: 'Prashar Lake', moment: 'A floating island in a glacial lake. A pagoda temple on the shore. Impossible beauty.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2000, title: 'The descent', moment: 'The lake stays in your mind long after the forest swallows the view.', type: 'text' },
            ],
            type: 'trek' },
          { id: 'rewalsar-lake', name: 'Rewalsar Lake', emoji: '🌊', lat: 31.64, lng: 76.83, heading: 200, elevation: '1,360m', desc: 'Sacred lake revered by Hindus, Buddhists and Sikhs.',
            trekPath: [
              { lat: 31.60, lng: 76.83 },  // Mandi road
              { lat: 31.62, lng: 76.83 },  // Temple complex approach
              { lat: 31.64, lng: 76.83 },  // Rewalsar Lake
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1200, title: 'The road to Rewalsar', moment: 'A winding road through Mandi district. Prayer wheels spin at the roadside.', type: 'text' },
              { id: 'approach', scrollDepth: 40, altitude: 1300, title: 'Temple complex', moment: 'Golden Buddhbas, Hindu shikharas, and a Sikh gurudwara — all around one lake.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 1360, title: 'Rewalsar Lake', moment: 'A sacred lake with floating reed islands. Incense smoke and prayer flags.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 1250, title: 'Evening prayers', moment: 'The lake dims. Butter lamps glow in every direction.', type: 'text' },
            ],
            type: 'lake' },
        ],
      },
      {
        id: 'lahaul', name: 'Lahaul',
        lat: 32.55, lng: 77.05, zoom: 10, tilt: 55, heading: 350,
        places: [
          { id: 'jispa', name: 'Jispa', emoji: '🌊', lat: 32.65, lng: 77.05, heading: 360, elevation: '3,200m', desc: 'A riverside camp on the pristine Bhaga River — my favourite stop on the Manali–Leh route.',
            trekPath: [
              { lat: 32.50, lng: 77.12 },  // Rohtang north descent
              { lat: 32.57, lng: 77.09 },  // Bhaga valley floor
              { lat: 32.65, lng: 77.05 },  // Jispa camp
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3100, title: 'The Bhaga valley', moment: 'The Manali–Leh highway follows the Bhaga river north. Lahaul is austere and beautiful.', type: 'text' },
              { id: 'camp', scrollDepth: 45, altitude: 3150, title: 'Riverside camp', moment: 'Tents pitched on gravel banks. The Bhaga river sings all night.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 3200, title: 'Jispa', moment: 'A single-street town at the bottom of the world. The last warm stop before Baralacha.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3100, title: 'Onward north', moment: 'The road climbs again. Jispa fades to a memory of warmth.', type: 'text' },
            ],
            type: 'scenic' },
          { id: 'sissu', name: 'Sissu', emoji: '💧', lat: 32.43, lng: 77.24, heading: 290, elevation: '3,100m', desc: 'Village above the Atal Tunnel exit with a dramatic waterfall.',
            trekPath: [
              { lat: 32.43, lng: 77.27 },  // Atal Tunnel north exit
              { lat: 32.43, lng: 77.26 },  // Short walk west
              { lat: 32.43, lng: 77.24 },  // Sissu waterfall & village
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3000, title: 'Atal Tunnel exit', moment: 'You emerge from 9 kilometers of tunnel into a new world. Cold desert air hits your face.', type: 'text' },
              { id: 'waterfall', scrollDepth: 45, altitude: 3050, title: 'Sissu waterfall', moment: 'A white column crashes down sheer rock. Spray catches the sun in rainbows.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 3100, title: 'Sissu village', moment: 'A quiet hamlet perched above the Chandra river. The silence after the tunnel is deafening.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3050, title: 'Night falls', moment: 'Stars appear one by one. The Milky Way arcs over Lahaul.', type: 'text' },
            ],
            type: 'scenic' },
        ],
      },
      {
        id: 'kinnaur', name: 'Kinnaur',
        lat: 31.60, lng: 78.35, zoom: 11, tilt: 55, heading: 20,
        places: [
          { 
            id: 'kalpa', name: 'Kalpa', emoji: '🍎', lat: 31.54, lng: 78.26, heading: 40, elevation: '2,960m',
            meta: 'Kinnaur · Kinner Kailash views', season: 'April – November',
            desc: 'A Kinnauri village overlooking the Kinner Kailash range — sunrise turns the peaks completely pink.',
            experience: 'I woke at 5:30 AM in Kalpa and stepped outside into complete silence. Kinner Kailash was rose and gold.',
            tips: ['Book early; limited stays.', 'Apple season is August–October.'],
            stats: [{ label: 'Altitude', value: '2,960 m' }, { label: 'Fruit', value: 'Apples' }],
            trekPath: [
              { lat: 31.47, lng: 78.07 },  // Sutlej valley / Karcham
              { lat: 31.50, lng: 78.16 },  // Reckong Peo
              { lat: 31.52, lng: 78.22 },  // Apple orchards above town
              { lat: 31.54, lng: 78.26 },  // Kalpa village
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2200, title: 'Sutlej valley road', moment: 'The road clings to cliff above the Sutlej. Kinnaur begins with vertigo.', type: 'text' },
              { id: 'reckong-peo', scrollDepth: 25, altitude: 2500, title: 'Reckong Peo', moment: 'The district headquarters. Last ATM, last proper market before the deep interior.', type: 'photo', mediaUrl: '' },
              { id: 'orchards', scrollDepth: 50, altitude: 2750, title: 'Apple orchards', moment: 'Terraced slopes heavy with fruit. The air is crisp and sweet.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 2960, title: 'Kalpa village', moment: 'Kinner Kailash fills the eastern sky. Pink at dawn, gold at dusk, white at noon.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2600, title: 'Heading deeper', moment: 'The road continues toward Chitkul. Kalpa watches from its perch above.', type: 'text' },
            ],
            type: 'scenic'
          },
          { id: 'chitkul', name: 'Chitkul', emoji: '🏔️', lat: 31.36, lng: 78.43, heading: 60, elevation: '3,450m', desc: 'The last inhabited village before the Indo-China border — raw and remote.',
            trekPath: [
              { lat: 31.42, lng: 78.27 },  // Sangla town
              { lat: 31.39, lng: 78.35 },  // Narrowing Baspa valley
              { lat: 31.37, lng: 78.40 },  // ITBP check post
              { lat: 31.36, lng: 78.43 },  // Chitkul last village
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2600, title: 'Sangla Valley', moment: 'The road follows the Baspa river deeper into Kinnaur. Villages thin out.', type: 'text' },
              { id: 'valley', scrollDepth: 30, altitude: 3000, title: 'Narrowing valley', moment: 'The Baspa thunders through a narrow gorge. Prayer flags bridge the river.', type: 'photo', mediaUrl: '' },
              { id: 'village', scrollDepth: 55, altitude: 3300, title: 'Last signs of road', moment: 'A dirt track replaces tarmac. The ITBP post waves you through.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 80, altitude: 3450, title: 'Chitkul', moment: 'The last village. Beyond is Tibet. A Mathi temple and potato fields mark the edge of India.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3100, title: 'Turning back', moment: 'The border is close but invisible. You\'ve reached the end of the road.', type: 'text' },
            ],
            type: 'road' },
        ],
      },
    ],
  },

  /* ── 4. UTTARAKHAND ─────────────────────────────────────────────── */
  {
    id: 'uttarakhand', name: 'Uttarakhand', state: 'Uttarakhand', emoji: '🌿',
    lat: 30.55, lng: 79.00, zoom: 9, tilt: 55, heading: 10,
    camera: { lat: 30.30, lng: 79.20, zoom: 9, tilt: 62, heading: 10 },
    elevation: '1,500–6,638m', maxAlt: '3,691m (Vasudhara Falls)',
    badge: 'Dev Bhoomi',
    cardDesc: 'The abode of the gods — glacial rivers carve through dense oak forests while ancient temples and wildflower meadows dot the high Garhwal Himalayas.',
    tags: ['pilgrimage', 'trekking', 'wildflowers', 'rivers'],
    travelTypes: ['trek', 'spiritual'],
    showSubRegionsFirst: true,
    subregions: [
      {
        id: 'garhwal', name: 'Garhwal',
        lat: 30.55, lng: 79.0, zoom: 10.0, tilt: 60, heading: 0,
        places: [
          { 
            id: 'kedarnath', name: 'Kedarnath', emoji: '🛕', lat: 30.74, lng: 79.07, heading: 190, elevation: '3,583m',
            meta: 'Sacred Shiva temple', season: 'May – June, Sep – Oct',
            desc: 'One of the twelve Jyotirlingas, perched at 3,583 m. Survived miracles for over 1,200 years.',
            experience: 'The 16-km trek from Gaurikund is a pilgrimage in every sense. Grey stone against white snow.',
            tips: ['Start the trek by 5 AM.', 'Prepare for rapid weather changes.'],
            stats: [{ label: 'Altitude', value: '3,583 m' }, { label: 'Trek', value: '16 km' }],
            trekPath: [
              { lat: 30.620302, lng: 79.009514 },
              { lat: 30.623073, lng: 79.008210 },
              { lat: 30.624996, lng: 79.007069 },
              { lat: 30.625287, lng: 79.005904 },
              { lat: 30.623063, lng: 79.002728 },
              { lat: 30.622673, lng: 79.001057 },
              { lat: 30.622607, lng: 78.999835 },
              { lat: 30.623275, lng: 78.998856 },
              { lat: 30.623839, lng: 78.998320 },
              { lat: 30.624682, lng: 78.997930 },
              { lat: 30.625312, lng: 78.997934 },
              { lat: 30.625901, lng: 78.998268 },
              { lat: 30.626294, lng: 78.999492 },
              { lat: 30.627085, lng: 79.000468 },
              { lat: 30.627982, lng: 79.000727 },
              { lat: 30.629927, lng: 78.998812 },
              { lat: 30.631709, lng: 78.998822 },
              { lat: 30.633545, lng: 78.999451 },
              { lat: 30.634789, lng: 78.999646 },
              { lat: 30.635166, lng: 78.998989 },
              { lat: 30.635742, lng: 78.999107 },
              { lat: 30.635585, lng: 79.000096 },
              { lat: 30.635551, lng: 79.000611 },
              { lat: 30.636136, lng: 79.001289 },
              { lat: 30.636180, lng: 79.003015 },
              { lat: 30.637043, lng: 79.003969 },
              { lat: 30.637379, lng: 79.005985 },
              { lat: 30.637066, lng: 79.007928 },
              { lat: 30.637332, lng: 79.009470 },
              { lat: 30.638255, lng: 79.010634 },
              { lat: 30.639224, lng: 79.012268 },
              { lat: 30.640201, lng: 79.013292 },
              { lat: 30.643013, lng: 79.015923 },
              { lat: 30.643429, lng: 79.016574 },
              { lat: 30.643860, lng: 79.016795 },
              { lat: 30.644334, lng: 79.017287 },
              { lat: 30.644833, lng: 79.017734 },
              { lat: 30.644996, lng: 79.017982 },
              { lat: 30.645158, lng: 79.018349 },
              { lat: 30.645274, lng: 79.018962 },
              { lat: 30.645293, lng: 79.019351 },
              { lat: 30.645903, lng: 79.019760 },
              { lat: 30.646375, lng: 79.019780 },
              { lat: 30.646720, lng: 79.020199 },
              { lat: 30.647141, lng: 79.021566 },
              { lat: 30.647320, lng: 79.022317 },
              { lat: 30.647634, lng: 79.022914 },
              { lat: 30.647721, lng: 79.024066 },
              { lat: 30.648057, lng: 79.024029 },
              { lat: 30.648200, lng: 79.023899 },
              { lat: 30.649205, lng: 79.023917 },
              { lat: 30.649710, lng: 79.023850 },
              { lat: 30.650090, lng: 79.024131 },
              { lat: 30.650500, lng: 79.024664 },
              { lat: 30.650926, lng: 79.025038 },
              { lat: 30.652030, lng: 79.024540 },
              { lat: 30.652852, lng: 79.025538 },
              { lat: 30.653193, lng: 79.025608 },
              { lat: 30.653827, lng: 79.026195 },
              { lat: 30.653984, lng: 79.027271 },
              { lat: 30.657518, lng: 79.029348 },
              { lat: 30.658222, lng: 79.031316 },
              { lat: 30.661262, lng: 79.033690 },
              { lat: 30.662077, lng: 79.034743 },
              { lat: 30.664488, lng: 79.036042 },
              { lat: 30.666606, lng: 79.037572 },
              { lat: 30.667091, lng: 79.037197 },
              { lat: 30.667934, lng: 79.037402 },
              { lat: 30.668204, lng: 79.037804 },
              { lat: 30.668995, lng: 79.038511 },
              { lat: 30.669776, lng: 79.038892 },
              { lat: 30.670230, lng: 79.038463 },
              { lat: 30.671926, lng: 79.039749 },
              { lat: 30.673008, lng: 79.040629 },
              { lat: 30.674616, lng: 79.042160 },
              { lat: 30.675721, lng: 79.041365 },
              { lat: 30.676500, lng: 79.042757 },
              { lat: 30.677460, lng: 79.043277 },
              { lat: 30.678156, lng: 79.043246 },
              { lat: 30.678722, lng: 79.043309 },
              { lat: 30.679208, lng: 79.043684 },
              { lat: 30.678985, lng: 79.043032 },
              { lat: 30.679941, lng: 79.043731 },
              { lat: 30.680737, lng: 79.044432 },
              { lat: 30.681746, lng: 79.045149 },
              { lat: 30.683262, lng: 79.045620 },
              { lat: 30.684166, lng: 79.046533 },
              { lat: 30.684839, lng: 79.046850 },
              { lat: 30.685610, lng: 79.046911 },
              { lat: 30.685854, lng: 79.047518 },
              { lat: 30.687027, lng: 79.047926 },
              { lat: 30.687668, lng: 79.048101 },
              { lat: 30.688620, lng: 79.049021 },
              { lat: 30.689461, lng: 79.049583 },
              { lat: 30.690472, lng: 79.050406 },
              { lat: 30.691453, lng: 79.051175 },
              { lat: 30.692016, lng: 79.051489 },
              { lat: 30.692855, lng: 79.052615 },
              { lat: 30.693757, lng: 79.053443 },
              { lat: 30.694093, lng: 79.053869 },
              { lat: 30.694413, lng: 79.054477 },
              { lat: 30.694901, lng: 79.054682 },
              { lat: 30.695457, lng: 79.054298 },
              { lat: 30.695628, lng: 79.054487 },
              { lat: 30.695762, lng: 79.054519 },
              { lat: 30.695803, lng: 79.054703 },
              { lat: 30.696032, lng: 79.054907 },
              { lat: 30.696370, lng: 79.055079 },
              { lat: 30.696782, lng: 79.055502 },
              { lat: 30.697380, lng: 79.056264 },
              { lat: 30.697275, lng: 79.055857 },
              { lat: 30.697001, lng: 79.055212 },
              { lat: 30.696951, lng: 79.055008 },
              { lat: 30.696812, lng: 79.054768 },
              { lat: 30.696783, lng: 79.054584 },
              { lat: 30.696753, lng: 79.054141 },
              { lat: 30.697334, lng: 79.054953 },
              { lat: 30.697618, lng: 79.055302 },
              { lat: 30.697983, lng: 79.055518 },
              { lat: 30.698270, lng: 79.055932 },
              { lat: 30.697815, lng: 79.053837 },
              { lat: 30.698914, lng: 79.055156 },
              { lat: 30.699143, lng: 79.055550 },
              { lat: 30.699167, lng: 79.055898 },
              { lat: 30.699223, lng: 79.056211 },
              { lat: 30.699426, lng: 79.055745 },
              { lat: 30.699436, lng: 79.055256 },
              { lat: 30.699625, lng: 79.056249 },
              { lat: 30.700029, lng: 79.056496 },
              { lat: 30.700244, lng: 79.056707 },
              { lat: 30.700493, lng: 79.056728 },
              { lat: 30.700703, lng: 79.056988 },
              { lat: 30.700975, lng: 79.056942 },
              { lat: 30.701080, lng: 79.057101 },
              { lat: 30.701830, lng: 79.057327 },
              { lat: 30.702475, lng: 79.057926 },
              { lat: 30.701717, lng: 79.056774 },
              { lat: 30.702920, lng: 79.057474 },
              { lat: 30.703102, lng: 79.057285 },
              { lat: 30.704030, lng: 79.058389 },
              { lat: 30.704567, lng: 79.058055 },
              { lat: 30.705752, lng: 79.057881 },
              { lat: 30.706303, lng: 79.059139 },
              { lat: 30.706500, lng: 79.059145 },
              { lat: 30.706777, lng: 79.059099 },
              { lat: 30.707009, lng: 79.059346 },
              { lat: 30.707346, lng: 79.059263 },
              { lat: 30.707661, lng: 79.059414 },
              { lat: 30.708034, lng: 79.059896 },
              { lat: 30.708256, lng: 79.060396 },
              { lat: 30.708676, lng: 79.060915 },
              { lat: 30.709211, lng: 79.061466 },
              { lat: 30.709472, lng: 79.061558 },
              { lat: 30.709697, lng: 79.062053 },
              { lat: 30.709950, lng: 79.061961 },
              { lat: 30.710147, lng: 79.062126 },
              { lat: 30.710599, lng: 79.062307 },
              { lat: 30.711017, lng: 79.062490 },
              { lat: 30.711367, lng: 79.062362 },
              { lat: 30.711866, lng: 79.062470 },
              { lat: 30.711849, lng: 79.063397 },
              { lat: 30.712125, lng: 79.063668 },
              { lat: 30.712365, lng: 79.063809 },
              { lat: 30.712726, lng: 79.063962 },
              { lat: 30.712789, lng: 79.064299 },
              { lat: 30.712883, lng: 79.064600 },
              { lat: 30.713355, lng: 79.064881 },
              { lat: 30.713576, lng: 79.065077 },
              { lat: 30.713900, lng: 79.065012 },
              { lat: 30.714007, lng: 79.065313 },
              { lat: 30.714220, lng: 79.065460 },
              { lat: 30.714796, lng: 79.065495 },
              { lat: 30.715172, lng: 79.065702 },
              { lat: 30.715473, lng: 79.065787 },
              { lat: 30.715782, lng: 79.066109 },
              { lat: 30.715922, lng: 79.066401 },
              { lat: 30.715921, lng: 79.066714 },
              { lat: 30.715540, lng: 79.066752 },
              { lat: 30.715286, lng: 79.067203 },
              { lat: 30.715567, lng: 79.067718 },
              { lat: 30.715851, lng: 79.068127 },
              { lat: 30.718203, lng: 79.067967 },
              { lat: 30.719401, lng: 79.067775 },
              { lat: 30.721194, lng: 79.067032 },
              { lat: 30.721688, lng: 79.066330 },
              { lat: 30.722395, lng: 79.065936 },
              { lat: 30.722862, lng: 79.065705 },
              { lat: 30.723033, lng: 79.065457 },
              { lat: 30.723168, lng: 79.065455 },
              { lat: 30.723241, lng: 79.065696 },
              { lat: 30.723339, lng: 79.065886 },
              { lat: 30.723693, lng: 79.066030 },
              { lat: 30.724830, lng: 79.066110 },
              { lat: 30.725427, lng: 79.066056 },
              { lat: 30.726244, lng: 79.066080 },
              { lat: 30.726531, lng: 79.066355 },
              { lat: 30.726975, lng: 79.066464 },
              { lat: 30.728079, lng: 79.066526 },
              { lat: 30.728494, lng: 79.066587 },
              { lat: 30.728808, lng: 79.066535 },
              { lat: 30.729665, lng: 79.066462 },
              { lat: 30.730975, lng: 79.066070 },
              { lat: 30.731666, lng: 79.066062 },
              { lat: 30.732041, lng: 79.066037 },
              { lat: 30.732270, lng: 79.065876 },
              { lat: 30.732648, lng: 79.066663 },
              { lat: 30.733110, lng: 79.066864 },
              { lat: 30.735498, lng: 79.066868 },
              { lat: 30.735659, lng: 79.068302 },
              { lat: 30.734958, lng: 79.068856 },
              { lat: 30.732951, lng: 79.069799 },
              { lat: 30.732511, lng: 79.070172 },
              { lat: 30.736098, lng: 79.070798 },
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1982, title: 'Gaurikund', moment: 'Hot springs steam in the cold air. The pilgrimage begins with a prayer and a first step upward.', type: 'text' },
              { id: 'jungle-chatti', scrollDepth: 20, altitude: 2500, title: 'Jungle Chatti', moment: 'Forest gives way to rockfall debris. The trail narrows between boulders.', type: 'photo', mediaUrl: '' },
              { id: 'rambara', scrollDepth: 40, altitude: 2900, title: 'Rambara bridge', moment: 'The Mandakini river roars below. Ponies and pilgrims share the narrow bridge.', type: 'photo', mediaUrl: '' },
              { id: 'lincholi', scrollDepth: 55, altitude: 3200, title: 'Lincholi', moment: 'Legs ache. The air thins. But every face on the trail carries the same quiet determination.', type: 'text' },
              { id: 'summit', scrollDepth: 80, altitude: 3583, title: 'Kedarnath Temple', moment: 'Grey stone against white snow. 1,200 years of faith in a single structure. The boulder that saved it towers behind.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2800, title: 'Descending', moment: 'The temple shrinks behind. The chanting fades. But the mountain stays with you.', type: 'text' },
            ],
            type: 'trek'
          },



          {
            id: "gangotri", name: "Gangotri", emoji: "🌊", lat: 30.995051, lng: 78.939514, heading: 0,
            desc: "The origin of the holy river Ganges, surrounded by majestic peaks.", type: "spiritual"
          },
          {
            id: "yamnotri", name: "Yamnotri", emoji: "🏞️", lat: 31.000245, lng: 78.463092, heading: 0,
            desc: "The source of the Yamuna River and the seat of Goddess Yamuna.", type: "spiritual"
          },
          {
            id: 'vasudhara-falls', name: 'Vasudhara Falls', emoji: "🌧️", lat: 30.783, lng: 79.45, heading: 320, elevation: '3,691m',
            meta: 'Trek from Mana Village', season: 'May – June, Sep – Oct',
            desc: 'A magnificent 400ft waterfall near Mana Village. The water is believed to turn away from those not pure of heart.',
            experience: 'A 6km trek from Mana, the last Indian village. The path is rocky, windy, and offers spectacular views of the Alaknanda river.',
            tips: ['Start early to avoid strong afternoon winds.', 'Carry enough water, no shops on the way.'],
            stats: [{ label: 'Altitude', value: '3,691 m' }, { label: 'Trek', value: '6 km' }],
            trekPath: [
              { lat: 30.742707, lng: 79.496572 },
              { lat: 30.744168, lng: 79.496328 },
              { lat: 30.747220, lng: 79.498203 },
              { lat: 30.751156, lng: 79.497673 },
              { lat: 30.755734, lng: 79.499399 },
              { lat: 30.756695, lng: 79.499621 },
              { lat: 30.759002, lng: 79.499627 },
              { lat: 30.762661, lng: 79.499769 },
              { lat: 30.764799, lng: 79.499321 },
              { lat: 30.767225, lng: 79.498870 },
              { lat: 30.768661, lng: 79.498049 },
              { lat: 30.770274, lng: 79.496730 },
              { lat: 30.771318, lng: 79.495941 },
              { lat: 30.773031, lng: 79.494815 },
              { lat: 30.773450, lng: 79.493986 },
              { lat: 30.774319, lng: 79.493153 },
              { lat: 30.773963, lng: 79.492526 },
              { lat: 30.773702, lng: 79.491601 },
              { lat: 30.773874, lng: 79.489465 },
              { lat: 30.774331, lng: 79.488367 },
              { lat: 30.774891, lng: 79.487822 },
              { lat: 30.775347, lng: 79.487028 },
              { lat: 30.775256, lng: 79.486476 },
              { lat: 30.775493, lng: 79.484630 },
              { lat: 30.775581, lng: 79.483773 },
              { lat: 30.776899, lng: 79.482029 },
              { lat: 30.777152, lng: 79.481281 },
              { lat: 30.777783, lng: 79.478969 },
              { lat: 30.778876, lng: 79.477240 },
              { lat: 30.779431, lng: 79.474847 },
              { lat: 30.779482, lng: 79.474110 },
              { lat: 30.779782, lng: 79.473361 },
              { lat: 30.779851, lng: 79.472150 },
              { lat: 30.780233, lng: 79.471121 },
              { lat: 30.780577, lng: 79.470436 },
              { lat: 30.780225, lng: 79.469336 },
              { lat: 30.780522, lng: 79.467597 },
              { lat: 30.781120, lng: 79.466543 },
              { lat: 30.781826, lng: 79.464656 },
              { lat: 30.784156, lng: 79.461126 },
              { lat: 30.785392, lng: 79.457815 },
              { lat: 30.785592, lng: 79.457107 },
              { lat: 30.786142, lng: 79.455149 },
              { lat: 30.786578, lng: 79.454492 },
              { lat: 30.786951, lng: 79.454203 },
              { lat: 30.787242, lng: 79.453944 },
              { lat: 30.787603, lng: 79.453382 },
              { lat: 30.788178, lng: 79.452798 },
              { lat: 30.788757, lng: 79.451500 },
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3100, title: 'Mana Village', moment: 'The last Indian village. The path begins past the ancient Saraswati river bridge.', type: 'text' },
              { id: 'midway', scrollDepth: 40, altitude: 3400, title: 'Glacial valley', moment: 'Barren, rocky terrain. The Alaknanda river roars far below the trail.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 3691, title: 'Vasudhara Falls', moment: '400 feet of mist. The wind blows the waterfall apart before it hits the ground.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3200, title: 'Return to Mana', moment: 'The chill sets in as the sun dips behind the towering peaks.', type: 'text' }
            ],
            type: "trek"
          },
          {
            id: "uttarkashi", name: "Uttarkashi", emoji: "🏘️", lat: 30.729002, lng: 78.442464, heading: 0,
            desc: "A significant town on the banks of the Bhagirathi river.", type: "road"
          },
          {
            id: "barkot", name: "Barkot", emoji: "🏞️", lat: 30.808933, lng: 78.208222, heading: 0,
            desc: "A scenic town acting as a base for Yamunotri.", type: "road"
          },
          {
            id: "joshimath", name: "Joshimath", emoji: "🚠", lat: 30.556247, lng: 79.554283, heading: 0,
            desc: "A winter destination and gateway to several Himalayan expeditions.", type: "adventure"
          },
          {
            id: "urgam-valley", name: "Urgam Valley", emoji: "🌲", lat: 30.537885, lng: 79.455306, heading: 0,
            desc: "A lush green valley famous for the Kalpeshwar temple.", type: "scenic"
          },
        ],
      },
    ],
  }
]

/* ── Helpers ─────────────────────────────────────────────────────── */
export function countPlaces(region: HimalayaRegion): number {
  return region.subregions.reduce((n, sr) => n + sr.places.length, 0)
}

/* ── Flat O(1) place lookup ────────────────────────────────────────
 *  Derived once at module load from HIMALAYA_REGIONS so any component
 *  can do PLACE_INDEX[placeId] instead of walking the 3-level tree.
 *  Keyed by place.id which is unique across the entire dataset.
 * ─────────────────────────────────────────────────────────────────── */
export const PLACE_INDEX: Record<string, HimalayaPlace> = Object.fromEntries(
  HIMALAYA_REGIONS.flatMap((region) =>
    region.subregions.flatMap((sub) =>
      sub.places.map((place) => [place.id, place])
    )
  )
)
