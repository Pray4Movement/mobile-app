import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Reminder } from '../models/Reminder';
import { Campaign } from '../models/Campaign';

interface ReminderEditorProps {
  visible: boolean;
  reminder: Reminder | null;
  campaigns: Campaign[];
  onSave: (reminder: Reminder) => void;
  onCancel: () => void;
}

const ReminderEditor: React.FC<ReminderEditorProps> = ({
  visible,
  reminder,
  campaigns,
  onSave,
  onCancel,
}) => {
  const [times, setTimes] = useState<string[]>(reminder?.times || ['09:00']);
  const [selectedDays, setSelectedDays] = useState<number[]>(reminder?.days || []);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(
    reminder?.campaignIds || []
  );
  const [timeInput, setTimeInput] = useState('09:00');

  useEffect(() => {
    if (reminder) {
      setTimes(reminder.times);
      setSelectedDays(reminder.days);
      setSelectedCampaigns(reminder.campaignIds);
    }
  }, [reminder]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleCampaign = (campaignId: string) => {
    if (selectedCampaigns.includes(campaignId)) {
      setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
    } else {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    }
  };

  const addTime = () => {
    if (timeInput.trim() && !times.includes(timeInput.trim())) {
      setTimes([...times, timeInput.trim()]);
      setTimeInput('09:00');
    }
  };

  const removeTime = (time: string) => {
    setTimes(times.filter(t => t !== time));
  };

  const handleSave = () => {
    const newReminder: Reminder = {
      id: reminder?.id || Date.now().toString(),
      times,
      days: selectedDays,
      campaignIds: selectedCampaigns,
      enabled: true,
    };
    onSave(newReminder);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Edit Reminder</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Times</Text>
              {times.map((time, index) => (
                <View key={index} style={styles.timeRow}>
                  <Text style={styles.timeText}>{time}</Text>
                  <TouchableOpacity onPress={() => removeTime(time)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addTimeRow}>
                <TextInput
                  style={styles.timeInput}
                  value={timeInput}
                  onChangeText={setTimeInput}
                  placeholder="HH:mm"
                />
                <TouchableOpacity style={styles.addButton} onPress={addTime}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Days</Text>
              {dayNames.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayChip,
                    selectedDays.includes(index) && styles.dayChipSelected,
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      selectedDays.includes(index) && styles.dayChipTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Campaigns</Text>
              {campaigns.map(campaign => (
                <TouchableOpacity
                  key={campaign.id}
                  style={[
                    styles.campaignChip,
                    selectedCampaigns.includes(campaign.id) && styles.campaignChipSelected,
                  ]}
                  onPress={() => toggleCampaign(campaign.id)}
                >
                  <Text
                    style={[
                      styles.campaignChipText,
                      selectedCampaigns.includes(campaign.id) && styles.campaignChipTextSelected,
                    ]}
                  >
                    {campaign.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeText: {
    ...typography.body,
    color: colors.text,
  },
  removeText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  addTimeRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  timeInput: {
    flex: 1,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.button,
    color: colors.white,
  },
  dayChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  dayChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  dayChipTextSelected: {
    color: colors.white,
  },
  campaignChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  campaignChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  campaignChipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  campaignChipTextSelected: {
    color: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default ReminderEditor;

