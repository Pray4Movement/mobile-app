import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState } from '../models/UserState';
import { Reminder } from '../models/Reminder';
import { defaultLanguage } from '../data/languages';

const STORAGE_KEY = '@PrayerApp:userState';

class StateService {
  private static instance: StateService;
  private state: UserState | null = null;
  private listeners: Array<(state: UserState) => void> = [];

  private constructor() {}

  static getInstance(): StateService {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }

  // Initialize state from storage
  async initialize(): Promise<UserState> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
      } else {
        this.state = {
          subscribedCampaigns: [],
          prayedItems: [],
          campaignLanguages: {},
          reminders: [],
          appLanguage: defaultLanguage.code,
        };
        await this.save();
      }
      return this.state!;
    } catch (error) {
      console.error('Error initializing state:', error);
      this.state = {
        subscribedCampaigns: [],
        prayedItems: [],
        campaignLanguages: {},
        reminders: [],
        appLanguage: defaultLanguage.code,
      };
      return this.state;
    }
  }

  // Get current state
  getState(): UserState {
    if (!this.state) {
      throw new Error('State not initialized. Call initialize() first.');
    }
    return this.state;
  }

  // Subscribe to state changes
  subscribe(listener: (state: UserState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    if (this.state) {
      this.listeners.forEach(listener => listener(this.state!));
    }
  }

  // Save state to storage
  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Campaign subscription methods
  async subscribeToCampaign(campaignId: string, language?: string): Promise<void> {
    if (!this.state) await this.initialize();
    if (!this.state!.subscribedCampaigns.includes(campaignId)) {
      this.state!.subscribedCampaigns.push(campaignId);
      if (language) {
        this.state!.campaignLanguages[campaignId] = language;
      }
      await this.save();
    }
  }

  async unsubscribeFromCampaign(campaignId: string): Promise<void> {
    if (!this.state) await this.initialize();
    this.state!.subscribedCampaigns = this.state!.subscribedCampaigns.filter(
      id => id !== campaignId
    );
    delete this.state!.campaignLanguages[campaignId];
    await this.save();
  }

  getSubscribedCampaigns(): string[] {
    if (!this.state) return [];
    return [...this.state.subscribedCampaigns];
  }

  isSubscribed(campaignId: string): boolean {
    if (!this.state) return false;
    return this.state.subscribedCampaigns.includes(campaignId);
  }

  // Prayer marking methods
  async markAsPrayed(fuelId: string): Promise<void> {
    if (!this.state) await this.initialize();
    if (!this.state!.prayedItems.includes(fuelId)) {
      this.state!.prayedItems.push(fuelId);
      await this.save();
    }
  }

  async unmarkAsPrayed(fuelId: string): Promise<void> {
    if (!this.state) await this.initialize();
    this.state!.prayedItems = this.state!.prayedItems.filter(id => id !== fuelId);
    await this.save();
  }

  isPrayed(fuelId: string): boolean {
    if (!this.state) return false;
    return this.state.prayedItems.includes(fuelId);
  }

  getPrayedItems(): string[] {
    if (!this.state) return [];
    return [...this.state.prayedItems];
  }

  // Language methods
  async setCampaignLanguage(campaignId: string, languageCode: string): Promise<void> {
    if (!this.state) await this.initialize();
    this.state!.campaignLanguages[campaignId] = languageCode;
    await this.save();
  }

  getCampaignLanguage(campaignId: string): string {
    if (!this.state) return defaultLanguage.code;
    return this.state.campaignLanguages[campaignId] || defaultLanguage.code;
  }

  async setAppLanguage(languageCode: string): Promise<void> {
    if (!this.state) await this.initialize();
    this.state!.appLanguage = languageCode;
    await this.save();
  }

  getAppLanguage(): string {
    if (!this.state) return defaultLanguage.code;
    return this.state.appLanguage;
  }

  // Reminder methods
  async addReminder(reminder: Reminder): Promise<void> {
    if (!this.state) await this.initialize();
    this.state!.reminders.push(reminder);
    await this.save();
  }

  async updateReminder(reminderId: string, reminder: Reminder): Promise<void> {
    if (!this.state) await this.initialize();
    const index = this.state!.reminders.findIndex(r => r.id === reminderId);
    if (index !== -1) {
      this.state!.reminders[index] = reminder;
      await this.save();
    }
  }

  async removeReminder(reminderId: string): Promise<void> {
    if (!this.state) await this.initialize();
    this.state!.reminders = this.state!.reminders.filter(r => r.id !== reminderId);
    await this.save();
  }

  getReminders(): Reminder[] {
    if (!this.state) return [];
    return [...this.state.reminders];
  }

  getReminder(reminderId: string): Reminder | undefined {
    if (!this.state) return undefined;
    return this.state.reminders.find(r => r.id === reminderId);
  }
}

export default StateService.getInstance();

