import { groups } from './groups';

export interface Campaign {
  id: string;
  name: string;
  groupId: string;
  languages: string[];
  shortDescription: string;
  code?: string;
}

export const campaigns: Campaign[] = [
  {
    id: 'pray-azeris',
    name: 'Pray for the Azeris',
    groupId: 'doxa-life',
    languages: ['en', 'es', 'fr'],
    shortDescription: 'Join us in praying for the Azeri people and their communities.',
    code: 'AZERIS2024',
  },
  {
    id: 'pray-uighur',
    name: 'Pray for the Uighur',
    groupId: 'doxa-life',
    languages: ['en', 'zh', 'ar'],
    shortDescription: 'Stand with the Uighur people through prayer and intercession.',
    code: 'UIGHUR2024',
  },
  {
    id: 'pray-afghanistan',
    name: 'Pray for Afghanistan',
    groupId: '110-cities',
    languages: ['en', 'ar', 'hi'],
    shortDescription: 'Pray for peace, stability, and hope in Afghanistan.',
    code: 'AFG2024',
  },
  {
    id: 'pray-malaysia',
    name: 'Pray for Malaysia',
    groupId: '110-cities',
    languages: ['en', 'zh', 'ar'],
    shortDescription: 'Intercede for Malaysia and its diverse communities.',
    code: 'MYS2024',
  },
  {
    id: 'pray-paris',
    name: 'Pray for Paris',
    groupId: '110-cities',
    languages: ['en', 'fr', 'es'],
    shortDescription: 'Pray for the city of Paris and its people.',
    code: 'PARIS2024',
  },
  {
    id: 'pray-london',
    name: 'Pray for London',
    groupId: '110-cities',
    languages: ['en', 'fr', 'de'],
    shortDescription: 'Join in prayer for London and its communities.',
    code: 'LONDON2024',
  },
  {
    id: 'ramadan-2026-global',
    name: 'Ramadan 2026 Global',
    groupId: 'ramadan-2026',
    languages: ['en', 'ar', 'fr', 'es'],
    shortDescription: 'A global prayer campaign during Ramadan 2026.',
    code: 'RAM2026',
  },
];

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id);
}

export function getCampaignsByGroup(groupId: string): Campaign[] {
  return campaigns.filter(c => c.groupId === groupId);
}

export function getCampaignByCode(code: string): Campaign | undefined {
  return campaigns.find(c => c.code?.toLowerCase() === code.toLowerCase());
}

