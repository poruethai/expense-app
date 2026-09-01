import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  getTransactions,
  getTransactionSummary,
} from '@/database/table/transactions/queries';

import type {
  Transaction,
  TransactionSummary,
} from '@/types/transaction';

export function useTransactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [summary, setSummary] =
    useState<TransactionSummary[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadData = useCallback(async () => {
    try {
      const [
        transactionData,
        summaryData,
      ] = await Promise.all([
        getTransactions(),
        getTransactionSummary(),
      ]);

      setTransactions(transactionData);
      setSummary(summaryData);
    } catch (error) {
      console.error(
        'Failed to load transactions:',
        error
      );
    }
  }, []);

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
    transactions,
    summary,
    refreshing,
    refresh,
  };
}