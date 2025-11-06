class Campaign {
  final String id;
  final String name;
  final String groupId;
  final List<String> languages;
  final String shortDescription;
  final String? code;

  Campaign({
    required this.id,
    required this.name,
    required this.groupId,
    required this.languages,
    required this.shortDescription,
    this.code,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'groupId': groupId,
      'languages': languages,
      'shortDescription': shortDescription,
      'code': code,
    };
  }

  factory Campaign.fromJson(Map<String, dynamic> json) {
    return Campaign(
      id: json['id'] as String,
      name: json['name'] as String,
      groupId: json['groupId'] as String,
      languages: List<String>.from(json['languages'] as List),
      shortDescription: json['shortDescription'] as String,
      code: json['code'] as String?,
    );
  }
}

