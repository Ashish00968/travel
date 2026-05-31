import { create } from 'zustand'

interface MapStore {
  activeRegionId:    string | null
  activeSubRegionId: string | null
  activePlaceId:     string | null
  panelOpen:         boolean
  openRegionPanel:   (regionId: string) => void
  setSubRegion:      (subRegionId: string | null) => void
  openSubRegion:     (subRegionId: string) => void  // triggers map fly-to from panel click
  openPlace:         (regionId: string, placeId: string) => void
  clearActivePlaceId: () => void
  closePanel:        () => void
}

export const useMapStore = create<MapStore>((set) => ({
  activeRegionId:    null,
  activeSubRegionId: null,
  activePlaceId:     null,
  panelOpen:         false,

  openRegionPanel: (regionId) =>
    set({ activeRegionId: regionId, activePlaceId: null, panelOpen: true }),

  setSubRegion: (subRegionId) =>
    set({ activeSubRegionId: subRegionId }),

  // Used by RegionPanel to trigger map fly-to when user clicks a sub-region
  openSubRegion: (subRegionId) =>
    set({ activeSubRegionId: subRegionId }),

  openPlace: (regionId, placeId) =>
    set({ activeRegionId: regionId, activePlaceId: placeId, panelOpen: true }),

  // Zero out just the placeId so the map doesn't re-trigger the cinematic on remount
  clearActivePlaceId: () =>
    set({ activePlaceId: null }),

  closePanel: () =>
    set({ activeRegionId: null, activeSubRegionId: null, activePlaceId: null, panelOpen: false }),
}))
