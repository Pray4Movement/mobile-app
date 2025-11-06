export type FuelBlockType = 'heading' | 'paragraph' | 'list' | 'image' | 'button';

export interface FuelBlock {
  type: FuelBlockType;
  content?: string;
  level?: number; // for headings
  items?: string[]; // for lists
  src?: string; // for images
  alt?: string; // for images
  label?: string; // for buttons
  action?: string; // for buttons
}

export interface FuelContent {
  campaignId: string;
  day: number;
  date: string;
  language: string;
  blocks: FuelBlock[];
}

export interface Fuel {
  id: string;
  campaignId: string;
  day: number;
  date: string;
  languages: Record<string, FuelContent>;
}

