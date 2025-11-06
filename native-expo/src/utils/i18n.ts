const translations: Record<string, Record<string, string>> = {
  en: {
    'app.name': 'Doxa Prayer App',
    'feed.title': 'Prayer Feed',
    'campaigns.title': 'My Campaigns',
    'reminders.title': 'Reminders',
    'choose.title': 'Choose Campaign',
    'feed.reminders.summary': 'Reminder Schedule',
    'feed.reminders.edit': 'Edit',
    'feed.reminders.none': 'No reminders set',
    'feed.empty': 'No prayer content available',
    'campaigns.empty': 'You haven\'t subscribed to any campaigns yet',
    'campaigns.findNew': 'Find New Campaign',
    'campaigns.unsubscribe': 'Unsubscribe',
    'campaigns.changeLanguage': 'Change Language',
    'campaigns.share': 'Share',
    'reminders.add': 'Add Reminder',
    'reminders.edit': 'Edit Reminder',
    'reminders.delete': 'Delete',
    'reminders.time': 'Time',
    'reminders.days': 'Days',
    'reminders.campaign': 'Campaign (optional)',
    'reminders.allCampaigns': 'All Campaigns',
    'reminders.save': 'Save',
    'reminders.cancel': 'Cancel',
    'reminders.empty': 'No reminders set',
    'choose.search': 'Search campaigns...',
    'choose.code': 'Enter campaign code',
    'choose.filterLanguage': 'Filter by Language',
    'choose.filterGroup': 'Filter by Group',
    'choose.count': '{{count}} campaigns',
    'choose.empty': 'No campaigns found',
    'fuel.share': 'Share',
    'fuel.language': 'Language',
    'fuel.prayed': 'I prayed',
    'fuel.prayedMarked': '✓ Prayed',
    'days.monday': 'Monday',
    'days.tuesday': 'Tuesday',
    'days.wednesday': 'Wednesday',
    'days.thursday': 'Thursday',
    'days.friday': 'Friday',
    'days.saturday': 'Saturday',
    'days.sunday': 'Sunday',
  },
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  const lang = 'en'; // For prototype, only English
  const translation = translations[lang]?.[key] || key;

  if (params) {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return translation;
};

