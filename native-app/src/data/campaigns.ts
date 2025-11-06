import { Campaign } from '../models/Campaign';

export const campaigns: Campaign[] = [
  {
    id: 'azeris',
    name: 'Pray for the Azeris',
    groupId: 'doxa-life',
    languages: ['en', 'es', 'fr'],
    shortDescription: 'Praying for the Azeri people and their communities',
    code: 'AZERI2024',
  },
  {
    id: 'uighur',
    name: 'Pray for the Uighur',
    groupId: 'doxa-life',
    languages: ['en', 'zh', 'ar'],
    shortDescription: 'Standing with the Uighur people in prayer',
    code: 'UIGHUR2024',
  },
  {
    id: 'afghanistan',
    name: 'Pray for Afghanistan',
    groupId: '110-cities',
    languages: ['en', 'ar', 'hi'],
    shortDescription: 'Praying for peace and restoration in Afghanistan',
    code: 'AFG2024',
  },
  {
    id: 'malaysia',
    name: 'Pray for Malaysia',
    groupId: '110-cities',
    languages: ['en', 'zh'],
    shortDescription: 'Interceding for Malaysia and its people',
    code: 'MYS2024',
  },
  {
    id: 'paris',
    name: 'Pray for Paris',
    groupId: '110-cities',
    languages: ['en', 'fr'],
    shortDescription: 'Praying for the city of Paris and its inhabitants',
    code: 'PARIS2024',
  },
  {
    id: 'london',
    name: 'Pray for London',
    groupId: '110-cities',
    languages: ['en'],
    shortDescription: 'Interceding for London and its diverse communities',
    code: 'LON2024',
  },
  {
    id: 'cairo',
    name: 'Pray for Cairo',
    groupId: 'ramadan-2026',
    languages: ['en', 'ar'],
    shortDescription: 'Praying for Cairo during Ramadan',
    code: 'CAIRO2026',
  },
  {
    id: 'istanbul',
    name: 'Pray for Istanbul',
    groupId: 'ramadan-2026',
    languages: ['en', 'ar'],
    shortDescription: 'Interceding for Istanbul and its people',
    code: 'IST2026',
  },
];

export const getCampaignById = (id: string): Campaign | undefined => {
  return campaigns.find(c => c.id === id);
};

export const getCampaignByCode = (code: string): Campaign | undefined => {
  return campaigns.find(c => c.code?.toUpperCase() === code.toUpperCase());
};

export const getCampaignsByGroup = (groupId: string): Campaign[] => {
  return campaigns.filter(c => c.groupId === groupId);
};

