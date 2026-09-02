import { StyleSheet } from 'react-native';

export const transactionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // ใช้เมื่อไม่ได้ใช้ FlatList header
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // =========================
  // Header
  // =========================

  header: {
    paddingTop: 60,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  // =========================
  // Balance
  // =========================

  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
  },

  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  balance: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },

  // =========================
  // Income / Expense Summary
  // =========================

  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },

  income: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16A34A',
  },

  expense: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
  },

  // =========================
  // Transaction Section
  // =========================

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
    marginBottom: 12,
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  transactionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionLeft: {
    flex: 1,
  },

  transactionNote: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  transactionDate: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },

  transactionIncome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16A34A',
  },

  transactionExpense: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },

  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  transactionWallet: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  // =========================
  // Empty State
  // =========================

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },

  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },

  // =========================
  // Month / Year Picker
  // =========================

  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

    paddingVertical: 10,
    paddingHorizontal: 18,

    marginBottom: 16,

    borderRadius: 20,
    backgroundColor: '#F3F4F6',

    zIndex: 100,
    elevation: 10,
  },

  monthSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  monthSelectorArrow: {
    marginLeft: 8,
    fontSize: 11,
    color: '#6B7280',
  },

  // =========================
  // Bottom Sheet
  // =========================

  monthSheet: {
    flex: 1,

    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,

    backgroundColor: '#FFFFFF',
  },

  monthSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 24,
  },

  yearArrow: {
    fontSize: 32,
    color: '#111827',
    paddingHorizontal: 25,
  },

  selectedYear: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',

    minWidth: 70,
    textAlign: 'center',
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  monthItem: {
    width: '31%',

    paddingVertical: 14,
    marginBottom: 12,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F9FAFB',
  },

  monthItemSelected: {
    backgroundColor: '#111827',
  },

  monthItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  monthItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});