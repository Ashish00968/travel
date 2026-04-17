import { create } from 'zustand'

interface MapStore {
  activeRegionId: string | null
  activeSubRegionId: string | null
  activePlaceId: string | null
  panelOpen: boolean
  openRegionPanel: (regionId: string) => void
  setSubRegion: (subRegionId: string | null) => void
  openPlace: (regionId: string, placeId: string) => void
  closePanel: () => void
}

export const useMapStore = create<MapStore>((set) => ({
  activeRegionId: null,
  activeSubRegionId: null,
  activePlaceId: null,
  panelOpen: false,

  openRegionPanel: (regionId) =>
    set({ activeRegionId: regionId, activePlaceId: null, panelOpen: true }),

  setSubRegion: (subRegionId) =>
    set({ activeSubRegionId: subRegionId }),

  openPlace: (regionId, placeId) =>
    set({ activeRegionId: regionId, activePlaceId: placeId, panelOpen: true }),

  closePanel: () =>
    set({ activeRegionId: null, activeSubRegionId: null, activePlaceId: null, panelOpen: false }),
}))
