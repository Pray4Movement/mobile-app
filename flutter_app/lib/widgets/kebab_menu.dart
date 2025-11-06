import 'package:flutter/material.dart';

enum KebabMenuAction {
  unsubscribe,
  changeLanguage,
  share,
}

class KebabMenu extends StatelessWidget {
  final Function(KebabMenuAction) onAction;

  const KebabMenu({
    super.key,
    required this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<KebabMenuAction>(
      icon: const Icon(Icons.more_vert),
      onSelected: onAction,
      itemBuilder: (BuildContext context) => [
        const PopupMenuItem<KebabMenuAction>(
          value: KebabMenuAction.unsubscribe,
          child: Row(
            children: [
              Icon(Icons.remove_circle_outline, size: 20),
              SizedBox(width: 8),
              Text('Unsubscribe'),
            ],
          ),
        ),
        const PopupMenuItem<KebabMenuAction>(
          value: KebabMenuAction.changeLanguage,
          child: Row(
            children: [
              Icon(Icons.language, size: 20),
              SizedBox(width: 8),
              Text('Change Language'),
            ],
          ),
        ),
        const PopupMenuItem<KebabMenuAction>(
          value: KebabMenuAction.share,
          child: Row(
            children: [
              Icon(Icons.share, size: 20),
              SizedBox(width: 8),
              Text('Share'),
            ],
          ),
        ),
      ],
    );
  }
}

