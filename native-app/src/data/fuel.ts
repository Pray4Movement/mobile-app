import { Fuel } from '../models/Fuel';

const today = new Date();
const getDateString = (offset: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

export const fuel: Fuel[] = [
  // Azeris campaign - 7 days
  {
    id: 'azeris-1',
    campaignId: 'azeris',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'azeris',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Introduction to the Azeri People', level: 1 },
          { type: 'paragraph', content: 'The Azeri people are a Turkic ethnic group primarily living in Azerbaijan and Iran. Today we begin our journey of prayer for this community.' },
          { type: 'heading', content: 'Prayer Points', level: 2 },
          { type: 'list', items: [
            'Pray for peace and stability in the region',
            'Pray for the spread of the Gospel among Azeri communities',
            'Pray for unity and reconciliation',
          ]},
        ],
      },
      es: {
        campaignId: 'azeris',
        day: 1,
        date: getDateString(0),
        language: 'es',
        blocks: [
          { type: 'heading', content: 'Día 1: Introducción al Pueblo Azerí', level: 1 },
          { type: 'paragraph', content: 'El pueblo azerí es un grupo étnico túrquico que vive principalmente en Azerbaiyán e Irán. Hoy comenzamos nuestro viaje de oración por esta comunidad.' },
        ],
      },
    },
  },
  {
    id: 'azeris-2',
    campaignId: 'azeris',
    day: 2,
    date: getDateString(1),
    languages: {
      en: {
        campaignId: 'azeris',
        day: 2,
        date: getDateString(1),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 2: Cultural Heritage', level: 1 },
          { type: 'paragraph', content: 'The Azeri people have a rich cultural heritage. Let us pray for the preservation of their traditions while embracing new opportunities.' },
        ],
      },
    },
  },
  {
    id: 'azeris-3',
    campaignId: 'azeris',
    day: 3,
    date: getDateString(2),
    languages: {
      en: {
        campaignId: 'azeris',
        day: 3,
        date: getDateString(2),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 3: Economic Development', level: 1 },
          { type: 'paragraph', content: 'Pray for economic opportunities and sustainable development in Azeri communities.' },
        ],
      },
    },
  },
  // Afghanistan campaign - 7 days
  {
    id: 'afghanistan-1',
    campaignId: 'afghanistan',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'afghanistan',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Praying for Afghanistan', level: 1 },
          { type: 'paragraph', content: 'Afghanistan has faced decades of conflict and instability. Today we lift up this nation in prayer.' },
          { type: 'heading', content: 'Prayer Points', level: 2 },
          { type: 'list', items: [
            'Pray for peace and an end to violence',
            'Pray for the people affected by conflict',
            'Pray for humanitarian aid to reach those in need',
          ]},
        ],
      },
    },
  },
  {
    id: 'afghanistan-2',
    campaignId: 'afghanistan',
    day: 2,
    date: getDateString(1),
    languages: {
      en: {
        campaignId: 'afghanistan',
        day: 2,
        date: getDateString(1),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 2: Women and Children', level: 1 },
          { type: 'paragraph', content: 'Pray especially for women and children who are most vulnerable in times of conflict.' },
        ],
      },
    },
  },
  {
    id: 'afghanistan-3',
    campaignId: 'afghanistan',
    day: 3,
    date: getDateString(2),
    languages: {
      en: {
        campaignId: 'afghanistan',
        day: 3,
        date: getDateString(2),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 3: Education and Hope', level: 1 },
          { type: 'paragraph', content: 'Pray for educational opportunities and hope for the next generation.' },
        ],
      },
    },
  },
  // Paris campaign - 7 days
  {
    id: 'paris-1',
    campaignId: 'paris',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'paris',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: The City of Light', level: 1 },
          { type: 'paragraph', content: 'Paris, known as the City of Light, is home to millions. Let us pray for this great city.' },
        ],
      },
      fr: {
        campaignId: 'paris',
        day: 1,
        date: getDateString(0),
        language: 'fr',
        blocks: [
          { type: 'heading', content: 'Jour 1: La Ville Lumière', level: 1 },
          { type: 'paragraph', content: 'Paris, connue sous le nom de Ville Lumière, abrite des millions de personnes. Prions pour cette grande ville.' },
        ],
      },
    },
  },
  {
    id: 'paris-2',
    campaignId: 'paris',
    day: 2,
    date: getDateString(1),
    languages: {
      en: {
        campaignId: 'paris',
        day: 2,
        date: getDateString(1),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 2: Unity in Diversity', level: 1 },
          { type: 'paragraph', content: 'Paris is a diverse city. Pray for unity and understanding among its many communities.' },
        ],
      },
    },
  },
  // London campaign
  {
    id: 'london-1',
    campaignId: 'london',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'london',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Praying for London', level: 1 },
          { type: 'paragraph', content: 'London is a vibrant, multicultural city. Let us pray for its people and communities.' },
        ],
      },
    },
  },
  // Malaysia campaign
  {
    id: 'malaysia-1',
    campaignId: 'malaysia',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'malaysia',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Praying for Malaysia', level: 1 },
          { type: 'paragraph', content: 'Malaysia is a diverse nation. Let us pray for unity and peace.' },
        ],
      },
    },
  },
  // Uighur campaign
  {
    id: 'uighur-1',
    campaignId: 'uighur',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'uighur',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Standing with the Uighur', level: 1 },
          { type: 'paragraph', content: 'Let us pray for the Uighur people and their communities.' },
        ],
      },
    },
  },
  // Cairo campaign
  {
    id: 'cairo-1',
    campaignId: 'cairo',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'cairo',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Praying for Cairo', level: 1 },
          { type: 'paragraph', content: 'Cairo is a historic city. Let us pray for its people during Ramadan.' },
        ],
      },
    },
  },
  // Istanbul campaign
  {
    id: 'istanbul-1',
    campaignId: 'istanbul',
    day: 1,
    date: getDateString(0),
    languages: {
      en: {
        campaignId: 'istanbul',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          { type: 'heading', content: 'Day 1: Praying for Istanbul', level: 1 },
          { type: 'paragraph', content: 'Istanbul bridges continents and cultures. Let us pray for this great city.' },
        ],
      },
    },
  },
];

export const getFuelById = (id: string): Fuel | undefined => {
  return fuel.find(f => f.id === id);
};

export const getFuelByCampaignAndDay = (campaignId: string, day: number): Fuel | undefined => {
  return fuel.find(f => f.campaignId === campaignId && f.day === day);
};

export const getFuelByCampaign = (campaignId: string): Fuel[] => {
  return fuel.filter(f => f.campaignId === campaignId);
};

export const getFuelByDate = (date: string): Fuel[] => {
  return fuel.filter(f => f.date === date);
};

