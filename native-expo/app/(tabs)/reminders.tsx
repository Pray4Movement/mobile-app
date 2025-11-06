import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ReminderEditor } from '@/components/ReminderEditor';
import { useAppStore } from '@/state/store';
import { Reminder } from '@/state/store';
import { formatTime, formatDays } from '@/utils/format';
import { generateId } from '@/utils/ids';
import { theme } from '@/theme';
import { t } from '@/utils/i18n';

export default function RemindersScreen() {
  const reminders = useAppStore((state) => state.reminders);
  const addReminder = useAppStore((state) => state.addReminder);
  const updateReminder = useAppStore((state) => state.updateReminder);
  const deleteReminder = useAppStore((state) => state.deleteReminder);

  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);

  const handleAdd = () => {
    setEditingReminder(undefined);
    setShowEditor(true);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowEditor(true);
  };

  const handleSave = (reminder: Reminder) => {
    if (editingReminder) {
      updateReminder(reminder.id, reminder);
    } else {
      addReminder({ ...reminder, id: generateId() });
    }
    setShowEditor(false);
    setEditingReminder(undefined);
  };

  const handleDelete = () => {
    if (editingReminder) {
      deleteReminder(editingReminder.id);
      setShowEditor(false);
      setEditingReminder(undefined);
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingReminder(undefined);
  };

  const renderItem = ({ item }: { item: Reminder }) => {
    return (
      <TouchableOpacity
        style={styles.reminderItem}
        onPress={() => handleEdit(item)}
        activeOpacity={0.7}
      >
        <View style={styles.reminderContent}>
          <View style={styles.reminderHeader}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.reminderTime}>{formatTime(item.time)}</Text>
          </View>
          <Text style={styles.reminderDays}>{formatDays(item.days)}</Text>
          {item.campaignId && (
            <Text style={styles.reminderCampaign}>
              Campaign: {item.campaignId}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {reminders.length === 0 && !showEditor ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={theme.colors.textLight} />
          <Text style={styles.emptyText}>{t('reminders.empty')}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{t('reminders.add')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={reminders}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Ionicons name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>{t('reminders.add')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {showEditor && (
        <ReminderEditor
          reminder={editingReminder}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={editingReminder ? handleDelete : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reminderContent: {
    flex: 1,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  reminderTime: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  reminderDays: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  reminderCampaign: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  addButtonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});

