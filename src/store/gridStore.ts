import { create } from 'zustand'

interface GridStore {
  viewLevel: 'states' | 'subregions' | 'places'
  activeRegId: string | null
  activeSubRegId: string | null
  setGridState: (level: 'states' | 'subregions' | 'places', regId: string | null, subRegId: string | null) => void
}

export const useGridStore = create<GridStore>((set) => ({
  viewLevel: 'states',
  activeRegId: null,
  activeSubRegId: null,
  setGridState: (level, regId, subRegId) =>
    set({ viewLevel: level, activeRegId: regId, activeSubRegId: subRegId }),
}))
