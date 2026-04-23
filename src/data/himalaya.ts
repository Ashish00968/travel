/* ═══════════════════════════════════════════════════════════════════
 *  himalaya.ts — Hierarchical data for the 4-region Himalayan atlas
 * ═══════════════════════════════════════════════════════════════════ */

export type PlaceType = 'road' | 'trek' | 'spiritual' | 'scenic' | 'adventure' | 'lake'

export interface TrekStop {
  id:              string
  scrollDepth:     number        // 0 to 100 (percentage of page scroll)
  altitude:        number        // meters
  title:           string        // e.g. "The trailhead", "First ridgeline"
  moment:          string        // field-notes captions — Space Mono, documentary tone
  cinematicText?:  string        // emotional narration — Playfair italic, gold
  type:            'text' | 'photo' | 'video' | 'summit'
  mediaUrl?:       string        // photo URL or YouTube video ID
  coordinates?:    { lat: number; lng: number }
}

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
  // To create Earth Studio transition videos:
  // 1. Open earth.google.com/studio
  // 2. Search for the place (e.g. "Patalsu Peak, Manali")
  // 3. Create a keyframe animation flying toward the peak
  // 4. Export as MP4 (720p is fine for web)
  // 5. Host on Cloudinary or your CDN
  // 6. Paste the URL here — the transition system activates automatically
  videoTransitionUrl?: string  // URL to Earth Studio exported MP4; empty = use animateCamera fly-to
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
          { id: 'darhal', name: 'Darhal Water Fall', emoji: '🌲', lat: 33.49235317402844, lng: 74.44683246130484, heading: 270, elevation: '1,800m', desc: 'A stunning waterfall in a quiet Gujjar village in the Chenab valley, gateway to untouched alpine meadows.',
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
          { 
            id: 'rajouri-home', name: 'Ghar', emoji: '🏠', lat: 33.306694, lng: 74.349544, heading: 0, elevation: '915m', 
            desc: 'A personal sanctuary in the heart of Rajouri, where the hills meet the horizon.',
            trekPath: [
              { lat: 33.3088, lng: 74.3566 }, // LookAt position
              { lat: 33.306694, lng: 74.349544 }, // Ghar position
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
          { id: 'sanasar', name: 'Sanasar Lake', emoji: '🏞️', lat: 33.15, lng: 75.25, heading: 160, elevation: '2,050m', desc: 'A serene bowl-shaped meadow with a glacial lake — silent and perfect for camping.',
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
      {
        id: 'kashmir-valley', name: 'Kashmir Valley',
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
            id: 'srinagar', name: 'Srinagar', emoji: '🛶', lat: 34.08, lng: 74.79, heading: 310, elevation: '1,585m',
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
    subregions: [
      {
        id: 'leh-beyond', name: 'Leh & Beyond',
        places: [
          { id: 'leh', name: 'Leh', emoji: '🏯', lat: 34.15, lng: 77.58, heading: 280, elevation: '3,524m', desc: 'The legendary capital of Ladakh — ancient monasteries, prayer flags and the widest skies you have ever seen.',
            trekPath: [
              { lat: 34.14, lng: 77.57 },  // Old town bazaar
              { lat: 34.15, lng: 77.58 },  // Leh Palace
              { lat: 34.16, lng: 77.58 },  // Shanti Stupa hill
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3500, title: 'Leh town', moment: 'Prayer flags snap in the wind above whitewashed walls. The palace watches over everything.', type: 'text' },
              { id: 'palace', scrollDepth: 30, altitude: 3524, title: 'Leh Palace', moment: 'Nine stories of mud-brick and timber. The Stok range fills the windows.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 65, altitude: 3600, title: 'Shanti Stupa', moment: 'A white dome on a hill. The entire Indus valley unfolds below like a map.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3500, title: 'Back to the bazaar', moment: 'The old town hums. Chai steam rises from a roadside stall.', type: 'text' },
            ],
            type: 'spiritual' },
          { id: 'gurudwara-pathar-sahib', name: 'Gurudwara Pathar Sahib', emoji: '🛕', lat: 34.12, lng: 77.26, heading: 320, elevation: '3,500m', desc: 'A sacred Sikh shrine 25km from Leh, embedded into the mountain itself.',
            trekPath: [
              { lat: 34.14, lng: 77.40 },  // Leh–Srinagar highway
              { lat: 34.13, lng: 77.33 },  // Magnetic hill approach
              { lat: 34.12, lng: 77.26 },  // Gurudwara Pathar Sahib
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 3400, title: 'The approach', moment: 'The Leh–Srinagar highway cuts between magnetic hills. The shrine is in the rock itself.', type: 'text' },
              { id: 'shrine', scrollDepth: 50, altitude: 3500, title: 'Inside the mountain', moment: 'Cool air, oil lamps, and the sound of kirtan echoing off stone walls.', type: 'photo', mediaUrl: '' },
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
    badge: 'Dev Bhoomi',
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
            image: '/img/himachal-pradesh/kullu/manali.jpg',
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
          { id: 'solang-valley', name: 'Solang Valley', emoji: '🎿', image: '/img/himachal-pradesh/kullu/solang.jpg', lat: 32.33, lng: 77.15, heading: 350, elevation: '2,480m', desc: 'World-class skiing in winter, paragliding in summer.',
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2050, title: 'Leaving Manali', moment: 'The road climbs north. Deodar forest flanks both sides.', type: 'text' },
              { id: 'gondola', scrollDepth: 35, altitude: 2300, title: 'The gondola base', moment: 'A cable car station at the valley mouth. Snow peaks fill every window.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 70, altitude: 2480, title: 'Solang Valley', moment: 'A wide white bowl in winter. A green amphitheatre in summer. Always dramatic.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2200, title: 'The return', moment: 'Paragliders drift overhead. The valley catches the last golden light.', type: 'text' },
            ],
            type: 'adventure' },
          { id: 'rohtang-pass', name: 'Rohtang Pass', emoji: '🏔️', image: '/img/himachal-pradesh/kullu/Rohtang.jpg', lat: 32.37, lng: 77.24, heading: 280, elevation: '3,978m', desc: 'The great divide between green Kullu Valley and the cold desert of Lahaul.',
            trekPath: [
              { lat: 32.2504, lng: 77.2417 },  // Manali side base
              { lat: 32.3018, lng: 77.2402 },  // Mid climb / Marhi
              { lat: 32.3732, lng: 77.2302 },  // Rohtang Pass top
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2480, title: 'Above Solang', moment: 'The treeline thins. The road becomes gravel and switchback.', type: 'text' },
              { id: 'marhi', scrollDepth: 25, altitude: 3100, title: 'Marhi', moment: 'A cluster of dhabas in the clouds. Hot maggi and sweet chai before the final push.', type: 'photo', mediaUrl: '' },
              { id: 'snowfield', scrollDepth: 50, altitude: 3600, title: 'Through snow walls', moment: 'BRO has carved a corridor through six-foot snowbanks. Trucks groan upward.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 75, altitude: 3978, title: 'Rohtang Pass', moment: 'The divide. Green Kullu behind, grey Lahaul ahead. Two worlds separated by a single ridge.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3400, title: 'Into Lahaul', moment: 'The cold desert begins. Colour drains from the landscape. A new country.', type: 'text' },
            ],
            type: 'road' },
          { id: 'sethan', name: 'Sethan', emoji: '❄️', image: '/img/himachal-pradesh/kullu/sethan.jpg', lat: 32.19, lng: 77.24, heading: 310, elevation: '2,750m',
            trekPath: [
              // Real GPS track from KML — 13 waypoints (Sethan village trail)
              { lat: 32.2396739, lng: 77.2253057 },
              { lat: 32.242666,  lng: 77.2258135 },
              { lat: 32.2426823, lng: 77.226397  },
              { lat: 32.24198,   lng: 77.2265341 },
              { lat: 32.2416249, lng: 77.2269606 },
              { lat: 32.2410628, lng: 77.227755  },
              { lat: 32.2408283, lng: 77.228165  },
              { lat: 32.2406233, lng: 77.2286088 },
              { lat: 32.24031,   lng: 77.2289534 },
              { lat: 32.2401446, lng: 77.2295315 },
              { lat: 32.240025,  lng: 77.229512  },
              { lat: 32.240237,  lng: 77.2298524 },
              { lat: 32.2404221, lng: 77.2300251 },  // Sethan
            ],
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
            image: '/img/himachal-pradesh/kullu/patalsu.jpg',
            lat: 32.3538, lng: 77.1910, heading: 200, elevation: '4,261m',
            meta: 'Non-technical summit · Solang Valley', season: 'May – October',
            desc: 'A non-technical high-altitude summit rising above Solang Valley, offering a 360° panorama of the Kullu and Lahaul ranges. One of the most rewarding day-summit treks from Manali.',
            experience: 'The final push to the Patalsu summit ridge was into a bitter wind, but the moment the clouds parted and I saw both Rohtang and the Dhauladhar range at once — completely worth it.',
            tips: ['Start by 5 AM to summit before afternoon clouds roll in.', 'Acclimatise for a day in Manali before attempting.', 'No technical gear required — good boots and layers are enough.'],
            stats: [{ label: 'Altitude', value: '4,220 m' }, { label: 'Trek', value: '12 km round trip' }, { label: 'Base', value: 'Solang Valley' }],
            videoTransitionUrl: 'https://res.cloudinary.com/dehriwm1o/video/upload/q_auto:eco,f_auto,w_1280/v1776588285/Patalsu_jl6jxg.mp4',
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
              { id: 'departure', scrollDepth: 0, altitude: 2050, title: 'Leaving Old Manali', moment: '09:30 AM. Starting out from Old Manali on a scooty, heading towards Solang Valley. The sun is up and the valley is awake.', cinematicText: 'Every journey starts with deciding to leave the familiar behind.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/1_oldmanali_viewofPatalsu.jpg' },
              { id: 'solang-road', scrollDepth: 7, altitude: 2235, title: 'The road to Solang', moment: 'Riding out of Old Manali before sunrise. Patalsu sits silent above the valley. You can feel it more than you can see it.', cinematicText: 'The mountain appears between the trees. Small. Distant. Yours.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/2clearviewofPatalsu.jpg' },
              { id: 'solang-dhaba', scrollDepth: 14, altitude: 2468, title: 'Solang Valley — last chai', moment: 'Reached Solang Valley as the stalls were just opening. Butter toast, sweet chai. The paragliders were still asleep.', cinematicText: 'The last taste of the valley before you leave it behind forever.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/3ReachedSolangValleyforBreakfast.jpg' },
              { id: 'going-to-village', scrollDepth: 21, altitude: 2520, title: 'Into the upper valley', moment: "The tourist road ends. Now it's a dirt track winding up toward Solang village. No cable cars here.", cinematicText: 'Above the noise, above the resorts, above the world that brought you here.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/4GoingtoSolangVillage.jpg' },
              { id: 'solang-village', scrollDepth: 28, altitude: 2582, title: 'Solang village', moment: 'Stone houses, wooden balconies. A shepherd crosses the path without looking up. You are officially off the map.', cinematicText: 'The cable cars and ski slopes give way to stone paths and centuries of silence.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/6SolangVillage.jpg' },
              { id: 'trail-start', scrollDepth: 35, altitude: 2650, title: 'The trail begins', moment: 'Two figures on a rocky path. The valley stretches below. The peak hides above. This is where the scooty stays.', cinematicText: 'This is where the road ends and the mountain begins. You choose to keep going.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/7trekStart.jpg' },
              { id: 'forest-entry', scrollDepth: 42, altitude: 2820, title: 'Into the forest', moment: 'Pine trees close in on both sides. Cattle graze in clearings between the trunks. The air carries pine resin and cold mud.', cinematicText: 'In the forest, time slows. Every step sounds like it matters.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/8intotheforestsectionCattleGrazing.jpg' },
              { id: 'dog-hiking', scrollDepth: 49, altitude: 3100, title: 'An unexpected companion', moment: 'A stray dog appeared at the treeline and decided to join the expedition. He moved faster than us on every switchback.', cinematicText: 'Some companions choose you. Not the other way around.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/9_1doghiking.jpg' },
              { id: 'above-treeline', scrollDepth: 56, altitude: 3500, title: 'Above the treeline', moment: 'The trees end abruptly. A vast, open sky. The Dhauladhar ranges appear — white and endless from horizon to horizon.', cinematicText: 'You are in the sky now. What was a valley is now a map.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/10abovetheTreelineViewOfDhauladharRanges.jpg' },
              { id: 'ridgeline', scrollDepth: 63, altitude: 3800, title: 'Into the ridgeline', moment: 'Loose scree. Wind picking up. The ridge is steep and exposed. Every ten steps — stop and breathe.', cinematicText: 'The mountain tests your patience before it rewards your persistence.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/11IntoRidgeline.jpg' },
              { id: 'hanuman-tibba-view', scrollDepth: 70, altitude: 3900, title: 'Hanuman Tibba reveals itself', moment: 'You are now eye-level with giants. Hanuman Tibba fills the entire view. 5,982 metres of pure Himalayan scale.', cinematicText: 'The scale of the Himalaya stops being abstract.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/13ViewOfHanumanTibba.jpg' },
              { id: 'summit-push', scrollDepth: 77, altitude: 4100, title: 'The final 200 metres', moment: 'Wind slams the ridge. Every step is on loose rock. Below — the entire Kullu valley. Ahead — just sky.', cinematicText: 'This is the part they never show in the photos. The part where you question everything.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/12FinalRidge.jpg' },
              { id: 'summit', scrollDepth: 85, altitude: 4261, title: 'Patalsu Peak — 4,261m', moment: 'Made it. 360 degrees of Himalayan sky. Rohtang to the east, Dhauladhar to the west. Nothing between you and the horizon.', cinematicText: 'Nothing for 360 degrees except sky. Range after range after range. You are the highest thing here.', type: 'summit', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/14SummitSelfie.jpg' },
              { id: 'golden-hour', scrollDepth: 92, altitude: 4261, title: 'Golden hour on the summit', moment: 'The late afternoon light turned everything amber. Hanuman Tibba caught fire. We sat and just watched.', cinematicText: 'Mountains at golden hour are a different religion entirely.', type: 'photo', mediaUrl: '/images/himachal-pradesh/kullu/manali/patalsu/15SunsetHanumanTibba.jpg' },
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
            id: 'kedarnath', name: 'Kedarnath', emoji: '⛩️', lat: 30.74, lng: 79.07, heading: 190, elevation: '3,583m',
            meta: 'Sacred Shiva temple', season: 'May – June, Sep – Oct',
            desc: 'One of the twelve Jyotirlingas, perched at 3,583 m. Survived miracles for over 1,200 years.',
            experience: 'The 16-km trek from Gaurikund is a pilgrimage in every sense. Grey stone against white snow.',
            tips: ['Start the trek by 5 AM.', 'Prepare for rapid weather changes.'],
            stats: [{ label: 'Altitude', value: '3,583 m' }, { label: 'Trek', value: '16 km' }],
            trekPath: [
              { lat: 30.67, lng: 79.02 },  // Gaurikund trailhead
              { lat: 30.69, lng: 79.03 },  // Jungle Chatti
              { lat: 30.71, lng: 79.04 },  // Rambara bridge
              { lat: 30.73, lng: 79.05 },  // Lincholi
              { lat: 30.74, lng: 79.07 },  // Kedarnath Temple
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 1982, title: 'Gaurikund', moment: 'Hot springs steam in the cold air. The pilgrimage begins with a prayer and a first step upward.', type: 'text' },
              { id: 'jungle-chatti', scrollDepth: 20, altitude: 2500, title: 'Jungle Chatti', moment: 'Forest gives way to rockfall debris. The trail narrows between boulders.', type: 'photo', mediaUrl: '' },
              { id: 'rambara', scrollDepth: 40, altitude: 2900, title: 'Rambara bridge', moment: 'The Mandakini river roars below. Ponies and pilgrims share the narrow bridge.', type: 'photo', mediaUrl: '' },
              { id: 'lincholi', scrollDepth: 55, altitude: 3200, title: 'Lincholi', moment: 'Legs ache. The air thins. But every face on the trail carries the same quiet determination.', type: 'text' },
              { id: 'summit', scrollDepth: 80, altitude: 3583, title: 'Kedarnath Temple', moment: 'Grey stone against white snow. 1,200 years of faith in a single structure. The boulder that saved it towers behind.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 2800, title: 'Descending', moment: 'The temple shrinks behind. The chanting fades. But the mountain stays with you.', type: 'text' },
            ],
            type: 'spiritual'
          },
          { 
            id: 'valley-of-flowers', name: 'Valley of Flowers', emoji: '🌸', lat: 30.73, lng: 79.61, heading: 220, elevation: '3,658m',
            meta: 'UNESCO World Heritage Site', season: 'July – September',
            desc: 'A high-altitude valley carpeted with over 600 species of rare flowering plants.',
            experience: 'Walking here felt like stepping through a portal. Waves of deep violet and golden potentillas.',
            tips: ['Visit in late July for peak bloom.', 'Wear waterproof trekking shoes.'],
            stats: [{ label: 'Altitude', value: '3,658 m' }, { label: 'Species', value: '600+' }],
            trekPath: [
              { lat: 30.67, lng: 79.56 },  // Govindghat trailhead
              { lat: 30.69, lng: 79.58 },  // Ghangaria settlement
              { lat: 30.71, lng: 79.59 },  // Valley entrance
              { lat: 30.73, lng: 79.61 },  // Deep in the valley
            ],
            trekStops: [
              { id: 'start', scrollDepth: 0, altitude: 2600, title: 'Govindghat', moment: 'The trailhead by the Alaknanda river. Sikh pilgrims and trekkers share the same steep path.', type: 'text' },
              { id: 'ghangaria', scrollDepth: 25, altitude: 3050, title: 'Ghangaria', moment: 'A small settlement clinging to a mountain shelf. The last beds before the flowers.', type: 'photo', mediaUrl: '' },
              { id: 'entrance', scrollDepth: 45, altitude: 3300, title: 'Valley entrance', moment: 'The first colours appear — tiny alpine blooms at the edge of a vast meadow.', type: 'photo', mediaUrl: '' },
              { id: 'deep-valley', scrollDepth: 65, altitude: 3500, title: 'Deep in the valley', moment: 'Waves of violet, gold, and white. 600 species of flower in a single amphitheatre of stone.', type: 'photo', mediaUrl: '' },
              { id: 'summit', scrollDepth: 82, altitude: 3658, title: 'Valley of Flowers', moment: 'A UNESCO garden planted by glaciers and tended by monsoon. Walking here feels like stepping through a portal.', type: 'summit' },
              { id: 'descent', scrollDepth: 95, altitude: 3100, title: 'Returning', moment: 'The colours fade behind you. The contrast with grey stone makes the memory more vivid.', type: 'text' },
            ],
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
