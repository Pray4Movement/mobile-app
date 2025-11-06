export interface Reminder {
  id: string;
  times: string[]; // Array of time strings in HH:mm format
  days: number[]; // Array of day numbers (0 = Sunday, 1 = Monday, etc.)
  campaignIds: string[]; // Which campaigns this reminder applies to
  enabled: boolean;
}

