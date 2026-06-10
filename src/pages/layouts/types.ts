import type { HimalayaPlace, HimalayaRegion } from '../../data/himalaya'

export interface PlaceLayoutProps {
  place: HimalayaPlace;
  region: HimalayaRegion;
  subRegionName: string;
  onBack: () => void;
  navFrom?: 'map' | 'grid';
}
