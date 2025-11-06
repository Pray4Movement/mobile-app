export type BlockType = 'heading' | 'paragraph' | 'list' | 'image' | 'button';

export interface Block {
  type: BlockType;
  content?: string;
  level?: number; // for headings
  items?: string[]; // for lists
  src?: string; // for images
  alt?: string; // for images
  text?: string; // for buttons
  action?: string; // for buttons
}

export interface FuelItem {
  id: string;
  campaignId: string;
  dateISO: string;
  blocks: Block[];
}

// Generate sample fuel items for the next 30 days for each campaign
const campaigns = [
  'pray-azeris',
  'pray-uighur',
  'pray-afghanistan',
  'pray-malaysia',
  'pray-paris',
  'pray-london',
  'ramadan-2026-global',
];

function generateDateRange(days: number = 30): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function generateFuelForCampaign(campaignId: string, dates: string[]): FuelItem[] {
  return dates.map((date, index) => ({
    id: `${campaignId}-${date}`,
    campaignId,
    dateISO: date,
    blocks: [
      {
        type: 'heading',
        level: 1,
        content: `Day ${index + 1} Prayer Focus`,
      },
      {
        type: 'paragraph',
        content: `Today we focus our prayers on specific needs and opportunities. Join us in interceding for this important cause.`,
      },
      {
        type: 'heading',
        level: 2,
        content: 'Prayer Points',
      },
      {
        type: 'list',
        items: [
          'Pray for wisdom and guidance',
          'Pray for protection and provision',
          'Pray for breakthrough and transformation',
          'Pray for unity and peace',
        ],
      },
      {
        type: 'paragraph',
        content: `Let us come together in faith, believing that our prayers make a difference.`,
      },
    ],
  }));
}

const dateRange = generateDateRange(30);
export const fuelItems: FuelItem[] = campaigns.flatMap(campaignId =>
  generateFuelForCampaign(campaignId, dateRange)
);

export function getFuelByCampaignAndDate(campaignId: string, dateISO: string): FuelItem | undefined {
  return fuelItems.find(f => f.campaignId === campaignId && f.dateISO === dateISO);
}

export function getFuelByCampaign(campaignId: string): FuelItem[] {
  return fuelItems.filter(f => f.campaignId === campaignId);
}

