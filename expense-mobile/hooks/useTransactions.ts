import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  getTransactionsByMonth,
  getTransactionSummary,
  getMonthlySummary,
} from '@/database/table/transactions/queries';
import { getTransfersByMonth } from '@/database/table/transfers/queries';
import { getBudgetsWithSpent } from '@/database/table/budgets/queries';

import type {
  MonthlySummary,
  TransactionSummary,
} from '@/database/table/transactions/queries';
import type { TransferWithWallets } from '@/database/table/transfers/queries';
import type { BudgetWithSpent } from '@/types/budget';
import type { Transaction } from '@/types/transaction';

export type FeedItem =
  | { kind: 'transaction'; key: string; date: string; transaction: Transaction }
  | { kind: 'transfer'; key: string; date: string; transfer: TransferWithWallets };

function mergeFeed(
  transactions: Transaction[],
  transfers: TransferWithWallets[]
): FeedItem[] {
  const transactionItems: FeedItem[] = transactions.map((transaction) => ({
    kind: 'transaction',
    key: `t-${transaction.id}`,
    date: transaction.transaction_date,
    transaction,
  }));

  const transferItems: FeedItem[] = transfers.map((transfer) => ({
    kind: 'transfer',
    key: `x-${transfer.id}`,
    date: transfer.transfer_date,
    transfer,
  }));

  return [...transactionItems, ...transferItems].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }

    return a.key < b.key ? 1 : -1;
  });
}

export function useTransactions(month: number, year: number) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [summary, setSummary] = useState<TransactionSummary[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [
        transactionData,
        transferData,
        summaryData,
        monthlyData,
        budgetData,
      ] = await Promise.all([
        getTransactionsByMonth(year, month),
        getTransfersByMonth(year, month),
        getTransactionSummary(),
        getMonthlySummary(year, month),
        getBudgetsWithSpent(year, month),
      ]);

      setFeed(mergeFeed(transactionData, transferData));
      setSummary(summaryData);
      setMonthlySummary(monthlyData);
      setBudgets(budgetData);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  return {
    feed,
    summary,
    monthlySummary,
    budgets,
    refreshing,
    refresh,
    loading,
  };
}