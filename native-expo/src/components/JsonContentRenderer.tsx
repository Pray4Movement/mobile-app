import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/theme';
import { FuelBlock } from '@/data/fuel';

interface JsonContentRendererProps {
  blocks: FuelBlock[];
}

export const JsonContentRenderer: React.FC<JsonContentRendererProps> = ({ blocks }) => {
  const renderBlock = (block: FuelBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        const HeadingComponent = Text;
        const headingStyle = block.level === 1
          ? styles.h1
          : block.level === 2
          ? styles.h2
          : styles.h3;
        return (
          <HeadingComponent key={index} style={headingStyle}>
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
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        );

      case 'image':
        return (
          <Image
            key={index}
            source={{ uri: block.src || 'https://via.placeholder.com/400x300' }}
            style={styles.image}
            resizeMode="cover"
          />
        );

      case 'button':
        return (
          <TouchableOpacity key={index} style={styles.button}>
            <Text style={styles.buttonText}>{block.label || 'Button'}</Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  h2: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  h3: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  listContainer: {
    marginBottom: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  listText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  buttonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

