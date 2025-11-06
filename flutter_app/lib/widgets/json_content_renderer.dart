import 'package:flutter/material.dart';
import '../models/fuel.dart';

class JsonContentRenderer extends StatelessWidget {
  final List<FuelBlock> blocks;

  const JsonContentRenderer({
    super.key,
    required this.blocks,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: blocks.map((block) => _renderBlock(context, block)).toList(),
    );
  }

  Widget _renderBlock(BuildContext context, FuelBlock block) {
    switch (block.type) {
      case FuelBlockType.heading:
        return _renderHeading(context, block);
      case FuelBlockType.paragraph:
        return _renderParagraph(context, block);
      case FuelBlockType.list:
        return _renderList(context, block);
      case FuelBlockType.image:
        return _renderImage(context, block);
      case FuelBlockType.button:
        return _renderButton(context, block);
    }
  }

  Widget _renderHeading(BuildContext context, FuelBlock block) {
    final level = block.level ?? 1;
    TextStyle? style;
    double? fontSize;

    switch (level) {
      case 1:
        style = Theme.of(context).textTheme.headlineMedium;
        fontSize = 28;
        break;
      case 2:
        style = Theme.of(context).textTheme.titleLarge;
        fontSize = 24;
        break;
      case 3:
        style = Theme.of(context).textTheme.titleMedium;
        fontSize = 20;
        break;
      default:
        style = Theme.of(context).textTheme.titleSmall;
        fontSize = 18;
    }

    return Padding(
      padding: const EdgeInsets.only(top: 16, bottom: 8),
      child: Text(
        block.content ?? '',
        style: style?.copyWith(
          fontSize: fontSize,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _renderParagraph(BuildContext context, FuelBlock block) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        block.content ?? '',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
    );
  }

  Widget _renderList(BuildContext context, FuelBlock block) {
    if (block.items == null || block.items!.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: block.items!.map((item) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('• ', style: TextStyle(fontSize: 18)),
                Expanded(
                  child: Text(
                    item,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _renderImage(BuildContext context, FuelBlock block) {
    // For prototype, show placeholder
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(8),
        ),
        child: block.src != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  block.src!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.image, size: 48, color: Colors.grey),
                          if (block.alt != null)
                            Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Text(
                                block.alt!,
                                style: const TextStyle(color: Colors.grey),
                              ),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              )
            : Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.image, size: 48, color: Colors.grey),
                    if (block.alt != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          block.alt!,
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _renderButton(BuildContext context, FuelBlock block) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ElevatedButton(
        onPressed: () {
          // No action for prototype
        },
        child: Text(block.label ?? 'Button'),
      ),
    );
  }
}

