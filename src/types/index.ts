export interface Video {
  youtubeId: string
  title: string
  thumbUrl: string
  views: string
}

export interface TravelStat {
  label: string
  value: string
}

export interface SubPlace {
  id: string
  name: string
  meta: string
  emoji: string
  lat: number
  lng: number
  elevation: string
  season: string
  desc: string
  experience: string
  tips: string[]
  stats: TravelStat[]
  videos: Video[]
}

export interface Region {
  id: string
  name: string
  state: string
  emoji: string
  lat: number
  lng: number
  elevation: string
  tilt: number
  zoom: number
  badge: string
  cardDesc: string
  tags: string[]
  subplaces: SubPlace[]
}
