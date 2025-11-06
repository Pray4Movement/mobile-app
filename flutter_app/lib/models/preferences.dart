class AppPreferences {
  final Map<String, String> languageByCampaign; // campaignId -> language code

  AppPreferences({
    Map<String, String>? languageByCampaign,
  }) : languageByCampaign = languageByCampaign ?? {};

  Map<String, dynamic> toJson() {
    return {
      'languageByCampaign': languageByCampaign,
    };
  }

  factory AppPreferences.fromJson(Map<String, dynamic> json) {
    return AppPreferences(
      languageByCampaign: json['languageByCampaign'] != null
          ? Map<String, String>.from(json['languageByCampaign'] as Map)
          : {},
    );
  }

  AppPreferences copyWith({
    Map<String, String>? languageByCampaign,
  }) {
    return AppPreferences(
      languageByCampaign: languageByCampaign ?? this.languageByCampaign,
    );
  }
}

