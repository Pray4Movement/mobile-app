import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface KebabMenuOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface KebabMenuProps {
  options: KebabMenuOption[];
}

const KebabMenu: React.FC<KebabMenuProps> = ({ options }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerText}>⋮</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.menu}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < options.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => {
                  option.onPress();
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    option.destructive && styles.menuItemTextDestructive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    padding: spacing.sm,
  },
  triggerText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: colors.white,
    borderRadius: 8,
    minWidth: 200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    ...typography.body,
    color: colors.text,
  },
  menuItemTextDestructive: {
    color: colors.error,
  },
});

export default KebabMenu;

