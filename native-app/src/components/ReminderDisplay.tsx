import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Reminder } from '../models/Reminder';

interface ReminderDisplayProps {
  reminder: Reminder | null;
  onEdit: () => void;
}

const ReminderDisplay: React.FC<ReminderDisplayProps> = ({ reminder, onEdit }) => {
  if (!reminder) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>No reminder set</Text>
        <TouchableOpacity style={styles.button} onPress={onEdit}>
          <Text style={styles.buttonText}>Create Reminder</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedDays = reminder.days.map(d => dayNames[d]).join(', ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Reminder Schedule</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.value}>Times: {reminder.times.join(', ')}</Text>
      <Text style={styles.value}>Days: {selectedDays}</Text>
      <Text style={styles.value}>
        Campaigns: {reminder.campaignIds.length} selected
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.h5,
    color: colors.text,
  },
  editText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default ReminderDisplay;

