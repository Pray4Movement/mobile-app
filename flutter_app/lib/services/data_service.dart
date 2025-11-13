import '../models/campaign.dart';
import '../models/fuel.dart';
import '../models/group.dart';
import '../data/campaigns_data.dart' as campaigns_data;
import '../data/fuel_data.dart' as fuel_data;
import '../data/groups_data.dart' as groups_data;
import '../config/app_config.dart';

class DataService {
  // Campaign methods
  static Campaign? getCampaignById(String id) {
    return campaigns_data.getCampaignById(id);
  }

  static Campaign? getCampaignByCode(String code) {
    return campaigns_data.getCampaignByCode(code);
  }

  static List<Campaign> getCampaignsByGroup(String groupId) {
    return campaigns_data.getCampaignsByGroup(groupId);
  }

  static List<Campaign> getAllCampaigns() {
    return campaigns_data.campaigns;
  }

  static List<Campaign> getAvailableCampaigns() {
    final allCampaigns = campaigns_data.campaigns;
    final filter = AppConfig.current.campaignGroupFilter;
    if (filter == null) return allCampaigns;
    return allCampaigns.where((c) => c.groupId == filter).toList();
  }

  // Fuel methods
  static Fuel? getFuelById(String id) {
    return fuel_data.getFuelById(id);
  }

  static Fuel? getFuelByCampaignAndDay(String campaignId, int day) {
    return fuel_data.getFuelByCampaignAndDay(campaignId, day);
  }

  static List<Fuel> getFuelByCampaign(String campaignId) {
    return fuel_data.getFuelByCampaign(campaignId);
  }

  static List<Fuel> getFuelByDate(String date) {
    return fuel_data.getFuelByDate(date);
  }

  // Group methods
  static Group? getGroupById(String id) {
    return groups_data.getGroupById(id);
  }

  static List<Group> getAllGroups() {
    return groups_data.getAllGroups();
  }

  static List<Group> getAvailableGroups() {
    final availableCampaigns = getAvailableCampaigns();
    final campaignGroupIds = availableCampaigns.map((c) => c.groupId).toSet();
    return groups_data.getAllGroups()
        .where((g) => campaignGroupIds.contains(g.id))
        .toList();
  }
}

