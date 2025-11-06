// Placeholder share functionality
// In a real app, this would use Capacitor Share plugin or Web Share API

export async function shareApp(): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Prayer App',
        text: 'Check out this prayer app!',
        url: window.location.href,
      });
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
}

export async function shareCampaign(campaignName: string, campaignCode?: string): Promise<void> {
  const text = campaignCode
    ? `Join me in praying: ${campaignName} (Code: ${campaignCode})`
    : `Join me in praying: ${campaignName}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: campaignName,
        text,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      alert('Campaign info copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
}

