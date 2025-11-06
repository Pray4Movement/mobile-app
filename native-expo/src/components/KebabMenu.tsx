import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';

interface MenuItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
}

interface KebabMenuProps {
  items: MenuItem[];
  onSelect: (id: string) => void;
}

export const KebabMenu: React.FC<KebabMenuProps> = ({ items, onSelect }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (id: string) => {
    setVisible(false);
    onSelect(id);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleSelect(item.id)}
              >
                {item.icon && (
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.destructive ? theme.colors.error : theme.colors.text}
                    style={styles.menuIcon}
                  />
                )}
                <Text
                  style={[
                    styles.menuText,
                    item.destructive && styles.menuTextDestructive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    minWidth: 200,
    paddingVertical: theme.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  menuIcon: {
    marginRight: theme.spacing.sm,
  },
  menuText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  menuTextDestructive: {
    color: theme.colors.error,
  },
});

