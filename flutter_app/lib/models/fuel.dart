enum FuelBlockType {
  heading,
  paragraph,
  list,
  image,
  button,
}

class FuelBlock {
  final FuelBlockType type;
  final String? content;
  final int? level; // for headings
  final List<String>? items; // for lists
  final String? src; // for images
  final String? alt; // for images
  final String? label; // for buttons
  final String? action; // for buttons

  FuelBlock({
    required this.type,
    this.content,
    this.level,
    this.items,
    this.src,
    this.alt,
    this.label,
    this.action,
  });

  Map<String, dynamic> toJson() {
    return {
      'type': type.name,
      'content': content,
      'level': level,
      'items': items,
      'src': src,
      'alt': alt,
      'label': label,
      'action': action,
    };
  }

  factory FuelBlock.fromJson(Map<String, dynamic> json) {
    return FuelBlock(
      type: FuelBlockType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => FuelBlockType.paragraph,
      ),
      content: json['content'] as String?,
      level: json['level'] as int?,
      items: json['items'] != null ? List<String>.from(json['items']) : null,
      src: json['src'] as String?,
      alt: json['alt'] as String?,
      label: json['label'] as String?,
      action: json['action'] as String?,
    );
  }
}

class FuelContent {
  final String campaignId;
  final int day;
  final String date;
  final String language;
  final List<FuelBlock> blocks;

  FuelContent({
    required this.campaignId,
    required this.day,
    required this.date,
    required this.language,
    required this.blocks,
  });

  Map<String, dynamic> toJson() {
    return {
      'campaignId': campaignId,
      'day': day,
      'date': date,
      'language': language,
      'blocks': blocks.map((b) => b.toJson()).toList(),
    };
  }

  factory FuelContent.fromJson(Map<String, dynamic> json) {
    return FuelContent(
      campaignId: json['campaignId'] as String,
      day: json['day'] as int,
      date: json['date'] as String,
      language: json['language'] as String,
      blocks: (json['blocks'] as List)
          .map((b) => FuelBlock.fromJson(b as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Fuel {
  final String id;
  final String campaignId;
  final int day;
  final String date;
  final Map<String, FuelContent> languages;

  Fuel({
    required this.id,
    required this.campaignId,
    required this.day,
    required this.date,
    required this.languages,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'campaignId': campaignId,
      'day': day,
      'date': date,
      'languages': languages.map(
        (key, value) => MapEntry(key, value.toJson()),
      ),
    };
  }

  factory Fuel.fromJson(Map<String, dynamic> json) {
    return Fuel(
      id: json['id'] as String,
      campaignId: json['campaignId'] as String,
      day: json['day'] as int,
      date: json['date'] as String,
      languages: (json['languages'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(
          key,
          FuelContent.fromJson(value as Map<String, dynamic>),
        ),
      ),
    );
  }
}

