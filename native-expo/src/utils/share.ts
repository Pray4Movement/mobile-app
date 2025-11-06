import { Share } from 'react-native';

export const shareApp = async (): Promise<void> => {
  try {
    await Share.share({
      message: 'Check out the Doxa Prayer App - join us in prayer!',
      title: 'Doxa Prayer App',
    });
  } catch (error) {
    console.error('Error sharing app:', error);
  }
};

export const shareCampaign = async (campaignName: string, campaignCode?: string): Promise<void> => {
  try {
    const message = campaignCode
      ? `Join me in praying for ${campaignName}! Use code ${campaignCode} in the Doxa Prayer App.`
      : `Join me in praying for ${campaignName} in the Doxa Prayer App!`;
    await Share.share({
      message,
      title: `Pray for ${campaignName}`,
    });
  } catch (error) {
    console.error('Error sharing campaign:', error);
  }
};

export const shareFuel = async (campaignName: string, day: number): Promise<void> => {
  try {
    await Share.share({
      message: `Day ${day} - Praying for ${campaignName}. Join us in prayer!`,
      title: `Pray for ${campaignName} - Day ${day}`,
    });
  } catch (error) {
    console.error('Error sharing fuel:', error);
  }
};

