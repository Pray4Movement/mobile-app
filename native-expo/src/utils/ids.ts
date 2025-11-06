export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createFuelId = (campaignId: string, day: number): string => {
  return `${campaignId}-${day}`;
};

