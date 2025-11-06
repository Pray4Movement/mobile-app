import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { FuelBlock } from '../models/Fuel';

interface JsonContentRendererProps {
  blocks: FuelBlock[];
}

const JsonContentRenderer: React.FC<JsonContentRendererProps> = ({ blocks }) => {
  const renderBlock = (block: FuelBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        const HeadingComponent = getHeadingComponent(block.level || 1);
        return (
          <HeadingComponent key={index} style={styles.heading}>
            {block.content}
          </HeadingComponent>
        );

      case 'paragraph':
        return (
          <Text key={index} style={styles.paragraph}>
            {block.content}
          </Text>
        );

      case 'list':
        return (
          <View key={index} style={styles.listContainer}>
            {block.items?.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        );

      case 'image':
        return (
          <View key={index} style={styles.imageContainer}>
            {block.src ? (
              <Image source={{ uri: block.src }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Image</Text>
              </View>
            )}
            {block.alt && (
              <Text style={styles.imageAlt}>{block.alt}</Text>
            )}
          </View>
        );

      case 'button':
        return (
          <View key={index} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{block.label || 'Button'}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  const getHeadingComponent = (level: number) => {
    const headingStyles = [
      typography.h1,
      typography.h2,
      typography.h3,
      typography.h4,
      typography.h5,
      typography.h6,
    ];
    const style = headingStyles[Math.min(level - 1, 5)] || typography.h3;

    return ({ children, style: customStyle }: { children: React.ReactNode; style?: any }) => (
      <Text style={[style, styles.headingBase, customStyle]}>{children}</Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingBase: {
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  heading: {
    marginTop: spacing.lg,
  },
  paragraph: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  listContainer: {
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
  },
  listBullet: {
    ...typography.body,
    color: colors.text,
    marginRight: spacing.sm,
  },
  listText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  imageContainer: {
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  imageAlt: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default JsonContentRenderer;

