import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FABProps = {
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  color?: string;
};

export function FAB({ onPress, icon = 'add', color = '#2563EB' }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.fab, { backgroundColor: color }]}
      hitSlop={8}
    >
      <Ionicons name={icon} size={28} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
