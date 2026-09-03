import { StyleSheet } from 'react-native';

export const reportsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  income: {
    fontSize: 26,
    fontWeight: '700',
    color: '#16A34A',
  },
  expense: {
    fontSize: 26,
    fontWeight: '700',
    color: '#DC2626',
  },
  balance: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF0F3',
    borderRadius: 14,
    padding: 4,
    marginTop: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  legend: {
    width: '100%',
    marginTop: 24,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendIconBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  legendPercent: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 8,
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
});