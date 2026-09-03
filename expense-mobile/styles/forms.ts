import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  headerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },

  headerButtonMuted: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#EEF0F3',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  typeToggleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  typeToggleOptionActiveExpense: {
    backgroundColor: '#FEE2E2',
  },

  typeToggleOptionActiveIncome: {
    backgroundColor: '#DCFCE7',
  },

  typeToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },

  typeToggleTextActiveExpense: {
    color: '#DC2626',
  },

  typeToggleTextActiveIncome: {
    color: '#16A34A',
  },

  amountInputWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },

  amountInput: {
    fontSize: 44,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    minWidth: 160,
  },

  amountCurrency: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },

  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  selectInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  disabledInput: {
    opacity: 0.5,
  },

  selectInputText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  selectPlaceholder: {
    color: '#9CA3AF',
  },

  selectIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    minHeight: '70%',
    paddingBottom: 24,
  },

  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
  },

  optionRowSelected: {
    backgroundColor: '#EFF6FF',
  },

  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  optionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryButtonExpense: {
    backgroundColor: '#DC2626',
  },

  primaryButtonIncome: {
    backgroundColor: '#16A34A',
  },

  primaryButtonDisabled: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  dangerButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  dangerButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 6,
  },

  helperText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
  },

  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  iconSwatch: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  iconSwatchSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#ffffff',
  },
});
