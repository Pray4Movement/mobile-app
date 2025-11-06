import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/theme';

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  title?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedIds,
  onToggle,
  title,
}) => {
  if (filters.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {filters.map((filter) => {
          const isSelected = selectedIds.includes(filter.id);
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onToggle(filter.id)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  title: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  scroll: {
    paddingHorizontal: theme.spacing.md,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

