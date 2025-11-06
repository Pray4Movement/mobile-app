class Reminder {
  final String id;
  final String time; // HH:mm format
  final List<String> days; // ['monday', 'tuesday', ...]
  final String? campaignId; // optional: specific campaign or all campaigns

  Reminder({
    required this.id,
    required this.time,
    required this.days,
    this.campaignId,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'time': time,
      'days': days,
      'campaignId': campaignId,
    };
  }

  factory Reminder.fromJson(Map<String, dynamic> json) {
    return Reminder(
      id: json['id'] as String,
      time: json['time'] as String,
      days: List<String>.from(json['days'] as List),
      campaignId: json['campaignId'] as String?,
    );
  }
}

