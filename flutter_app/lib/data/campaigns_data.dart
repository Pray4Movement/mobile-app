import '../models/campaign.dart';

final List<Campaign> campaigns = [
  Campaign(
    id: 'azeris',
    name: 'Pray for the Azeris',
    groupId: 'doxa-life',
    languages: ['en', 'es', 'fr'],
    shortDescription: 'Praying for the Azeri people and their communities',
    code: 'AZERI2024',
  ),
  Campaign(
    id: 'uighur',
    name: 'Pray for the Uighur',
    groupId: 'doxa-life',
    languages: ['en', 'zh', 'ar'],
    shortDescription: 'Standing with the Uighur people in prayer',
    code: 'UIGHUR2024',
  ),
  Campaign(
    id: 'afghanistan',
    name: 'Pray for Afghanistan',
    groupId: '110-cities',
    languages: ['en', 'ar', 'hi'],
    shortDescription: 'Praying for peace and restoration in Afghanistan',
    code: 'AFG2024',
  ),
  Campaign(
    id: 'malaysia',
    name: 'Pray for Malaysia',
    groupId: '110-cities',
    languages: ['en', 'zh'],
    shortDescription: 'Interceding for Malaysia and its people',
    code: 'MYS2024',
  ),
  Campaign(
    id: 'paris',
    name: 'Pray for Paris',
    groupId: '110-cities',
    languages: ['en', 'fr'],
    shortDescription: 'Praying for the city of Paris and its inhabitants',
    code: 'PARIS2024',
  ),
  Campaign(
    id: 'london',
    name: 'Pray for London',
    groupId: '110-cities',
    languages: ['en'],
    shortDescription: 'Interceding for London and its diverse communities',
    code: 'LON2024',
  ),
  Campaign(
    id: 'cairo',
    name: 'Pray for Cairo',
    groupId: 'ramadan-2026',
    languages: ['en', 'ar'],
    shortDescription: 'Praying for Cairo during Ramadan',
    code: 'CAIRO2026',
  ),
  Campaign(
    id: 'istanbul',
    name: 'Pray for Istanbul',
    groupId: 'ramadan-2026',
    languages: ['en', 'ar'],
    shortDescription: 'Interceding for Istanbul and its people',
    code: 'IST2026',
  ),
];

Campaign? getCampaignById(String id) {
  try {
    return campaigns.firstWhere((c) => c.id == id);
  } catch (e) {
    return null;
  }
}

Campaign? getCampaignByCode(String code) {
  try {
    return campaigns.firstWhere(
      (c) => c.code?.toUpperCase() == code.toUpperCase(),
    );
  } catch (e) {
    return null;
  }
}

List<Campaign> getCampaignsByGroup(String groupId) {
  return campaigns.where((c) => c.groupId == groupId).toList();
}

