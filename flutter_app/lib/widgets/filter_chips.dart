import 'package:flutter/material.dart';

class FilterChips extends StatelessWidget {
  final List<String> options;
  final String? selected;
  final ValueChanged<String?> onSelected;

  const FilterChips({
    super.key,
    required this.options,
    this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          // "All" option
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: FilterChip(
              label: const Text('All'),
              selected: selected == null,
              onSelected: (selected) {
                onSelected(null);
              },
            ),
          ),
          // Other options
          ...options.map((option) {
            return Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: FilterChip(
                label: Text(option),
                selected: selected == option,
                onSelected: (selected) {
                  onSelected(selected ? option : null);
                },
              ),
            );
          }),
        ],
      ),
    );
  }
}

