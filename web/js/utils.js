// Utility functions

// Get campaigns from mock data
function getCampaigns() {
    return MOCK_DATA.campaigns;
}

// Get campaign by ID
function getCampaignById(id) {
    return MOCK_DATA.campaigns.find(c => c.id === id);
}

// Get prayer fuel dates for a campaign
function getPrayerFuelDates(campaignId) {
    return MOCK_DATA.prayerFuel[campaignId] || [];
}

// Filter campaigns by search term
function searchCampaigns(campaigns, searchTerm) {
    if (!searchTerm) return campaigns;
    const term = searchTerm.toLowerCase();
    return campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(term) ||
        campaign.description.toLowerCase().includes(term)
    );
}

// Filter campaigns by group
function filterCampaignsByGroup(campaigns, group) {
    if (!group) return campaigns;
    return campaigns.filter(campaign => campaign.group === group);
}

// Filter campaigns by language
function filterCampaignsByLanguage(campaigns, language) {
    if (!language) return campaigns;
    return campaigns.filter(campaign => campaign.languages.includes(language));
}

// Filter campaigns by code
function filterCampaignsByCode(campaigns, code) {
    if (!code) return campaigns;
    return campaigns.filter(campaign =>
        campaign.code.toLowerCase() === code.toLowerCase()
    );
}

// Aggregate prayer fuel from all subscribed campaigns
function aggregatePrayerFuel(subscribedCampaignIds) {
    const items = [];

    subscribedCampaignIds.forEach(campaignId => {
        const campaign = getCampaignById(campaignId);
        if (!campaign) return;

        const dates = getPrayerFuelDates(campaignId);
        dates.forEach(date => {
            items.push({
                campaignId: campaignId,
                campaignName: campaign.name,
                campaignDescription: campaign.description,
                date: date
            });
        });
    });

    // Sort by date, newest first
    items.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    return items;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// LocalStorage helpers
function getSubscribedCampaigns() {
    const stored = localStorage.getItem('subscribedCampaigns');
    return stored ? JSON.parse(stored) : [];
}

function saveSubscribedCampaigns(campaignIds) {
    localStorage.setItem('subscribedCampaigns', JSON.stringify(campaignIds));
}

function subscribeToCampaign(campaignId) {
    const subscribed = getSubscribedCampaigns();
    if (!subscribed.includes(campaignId)) {
        subscribed.push(campaignId);
        saveSubscribedCampaigns(subscribed);
    }
}

function unsubscribeFromCampaign(campaignId) {
    const subscribed = getSubscribedCampaigns();
    const filtered = subscribed.filter(id => id !== campaignId);
    saveSubscribedCampaigns(filtered);
}

function getReminderSchedule() {
    const stored = localStorage.getItem('reminderSchedule');
    return stored ? JSON.parse(stored) : { times: [], days: [] };
}

function saveReminderSchedule(schedule) {
    localStorage.setItem('reminderSchedule', JSON.stringify(schedule));
}

function getAppLanguage() {
    return localStorage.getItem('appLanguage') || 'en';
}

function saveAppLanguage(language) {
    localStorage.setItem('appLanguage', language);
}

function getCampaignLanguage(campaignId) {
    const stored = localStorage.getItem('campaignLanguages');
    const languages = stored ? JSON.parse(stored) : {};
    return languages[campaignId] || 'en';
}

function saveCampaignLanguage(campaignId, language) {
    const stored = localStorage.getItem('campaignLanguages');
    const languages = stored ? JSON.parse(stored) : {};
    languages[campaignId] = language;
    localStorage.setItem('campaignLanguages', JSON.stringify(languages));
}

function hasPrayedFor(campaignId, date) {
    const timestamp = localStorage.getItem(`prayerTimestamp_${campaignId}_${date}`);
    return timestamp !== null;
}

