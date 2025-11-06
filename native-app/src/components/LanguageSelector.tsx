import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Language } from '../models/Language';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onSelect: (languageCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selected = languages.find(l => l.code === selectedLanguage);

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selected?.name || 'Select Language'}
        </Text>
        <Text style={styles.selectorArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={languages}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    selectedLanguage === item.code && styles.languageItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageText,
                      selectedLanguage === item.code && styles.languageTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedLanguage === item.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorText: {
    ...typography.body,
    color: colors.text,
    marginRight: spacing.sm,
  },
  selectorArrow: {
    ...typography.caption,
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    padding: spacing.md,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageItemSelected: {
    backgroundColor: colors.surface,
  },
  languageText: {
    ...typography.body,
    color: colors.text,
  },
  languageTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});

export default LanguageSelector;

