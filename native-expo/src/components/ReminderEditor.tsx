import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { theme } from '@/theme';
import { Reminder } from '@/state/store';
import { campaigns } from '@/data/campaigns';
import { t } from '@/utils/i18n';
import { formatDays } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

interface ReminderEditorProps {
  reminder?: Reminder;
  onSave: (reminder: Reminder) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const DAYS_OF_WEEK = [
  { id: 'monday', label: t('days.monday') },
  { id: 'tuesday', label: t('days.tuesday') },
  { id: 'wednesday', label: t('days.wednesday') },
  { id: 'thursday', label: t('days.thursday') },
  { id: 'friday', label: t('days.friday') },
  { id: 'saturday', label: t('days.saturday') },
  { id: 'sunday', label: t('days.sunday') },
];

export const ReminderEditor: React.FC<ReminderEditorProps> = ({
  reminder,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [time, setTime] = useState<string>(reminder?.time || '09:00');
  const [days, setDays] = useState<string[]>(reminder?.days || []);
  const [campaignId, setCampaignId] = useState<string | undefined>(reminder?.campaignId);

  const toggleDay = (dayId: string) => {
    setDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSave = () => {
    if (days.length === 0) {
      return; // Validation: at least one day must be selected
    }
    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return; // Invalid time format
    }
    onSave({
      id: reminder?.id || Date.now().toString(),
      time,
      days,
      campaignId,
    });
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelButton}>{t('reminders.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {reminder ? t('reminders.edit') : t('reminders.add')}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>{t('reminders.save')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>{t('reminders.time')}</Text>
            <View style={styles.timeInputContainer}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} style={styles.timeIcon} />
              <TextInput
                style={styles.timeInput}
                value={time}
                onChangeText={setTime}
                placeholder="09:00"
                placeholderTextColor={theme.colors.textLight}
                keyboardType="numeric"
              />
              <Text style={styles.timeHint}>(HH:mm format)</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('reminders.days')}</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[styles.dayChip, days.includes(day.id) && styles.dayChipSelected]}
                  onPress={() => toggleDay(day.id)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      days.includes(day.id) && styles.dayChipTextSelected,
                    ]}
                  >
                    {day.label.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('reminders.campaign')}</Text>
            <TouchableOpacity
              style={styles.campaignButton}
              onPress={() => setCampaignId(undefined)}
            >
              <Text style={[styles.campaignText, !campaignId && styles.campaignTextSelected]}>
                {t('reminders.allCampaigns')}
              </Text>
            </TouchableOpacity>
            {campaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={styles.campaignButton}
                onPress={() => setCampaignId(campaign.id)}
              >
                <Text
                  style={[
                    styles.campaignText,
                    campaignId === campaign.id && styles.campaignTextSelected,
                  ]}
                >
                  {campaign.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {reminder && onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
              <Text style={styles.deleteText}>{t('reminders.delete')}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  cancelButton: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  saveButton: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeIcon: {
    marginRight: theme.spacing.sm,
  },
  timeInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    minWidth: 80,
  },
  timeHint: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  dayChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 50,
    alignItems: 'center',
  },
  dayChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  dayChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  campaignButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  campaignText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  campaignTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  deleteText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
});

