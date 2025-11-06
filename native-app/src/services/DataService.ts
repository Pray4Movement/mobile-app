import { Campaign } from '../models/Campaign';
import { Fuel } from '../models/Fuel';
import { Group } from '../models/Group';
import { Language } from '../models/Language';
import { campaigns, getCampaignById, getCampaignByCode, getCampaignsByGroup } from '../data/campaigns';
import { fuel, getFuelById, getFuelByCampaignAndDay, getFuelByCampaign, getFuelByDate } from '../data/fuel';
import { groups, getGroupById } from '../data/groups';
import { languages, getLanguageByCode } from '../data/languages';

export class DataService {
  // Campaign methods
  static getAllCampaigns(): Campaign[] {
    return campaigns;
  }

  static getCampaign(id: string): Campaign | undefined {
    return getCampaignById(id);
  }

  static getCampaignByCode(code: string): Campaign | undefined {
    return getCampaignByCode(code);
  }

  static getCampaignsByGroup(groupId: string): Campaign[] {
    return getCampaignsByGroup(groupId);
  }

  static searchCampaigns(query: string): Campaign[] {
    const lowerQuery = query.toLowerCase();
    return campaigns.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.shortDescription.toLowerCase().includes(lowerQuery)
    );
  }

  static filterCampaignsByLanguage(languageCode: string): Campaign[] {
    return campaigns.filter(c => c.languages.includes(languageCode));
  }

  // Fuel methods
  static getAllFuel(): Fuel[] {
    return fuel;
  }

  static getFuel(id: string): Fuel | undefined {
    return getFuelById(id);
  }

  static getFuelByCampaignAndDay(campaignId: string, day: number): Fuel | undefined {
    return getFuelByCampaignAndDay(campaignId, day);
  }

  static getFuelByCampaign(campaignId: string): Fuel[] {
    return getFuelByCampaign(campaignId);
  }

  static getFuelByDate(date: string): Fuel[] {
    return getFuelByDate(date);
  }

  static getFuelForCampaigns(campaignIds: string[]): Fuel[] {
    return fuel.filter(f => campaignIds.includes(f.campaignId));
  }

  // Group methods
  static getAllGroups(): Group[] {
    return groups;
  }

  static getGroup(id: string): Group | undefined {
    return getGroupById(id);
  }

  // Language methods
  static getAllLanguages(): Language[] {
    return languages;
  }

  static getLanguage(code: string): Language | undefined {
    return getLanguageByCode(code);
  }
}

