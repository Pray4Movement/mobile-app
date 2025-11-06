import 'package:share_plus/share_plus.dart';

class ShareUtils {
  static Future<void> shareCampaign(String campaignName, String? campaignCode) {
    final text = campaignCode != null
        ? 'Join me in praying for $campaignName! Use code: $campaignCode'
        : 'Join me in praying for $campaignName!';
    return Share.share(text);
  }

  static Future<void> shareApp() {
    const text = 'Check out this Prayer App!';
    return Share.share(text);
  }

  static Future<void> sharePrayerFuel(String campaignName, int day) {
    final text = 'Day $day: Praying for $campaignName';
    return Share.share(text);
  }
}

