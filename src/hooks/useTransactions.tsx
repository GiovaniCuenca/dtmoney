import { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import { api } from '../services/api';

interface TransactionData {
  id: number;
  title: string;
  type: string;
  amount: number;
  category: string;
  created_at: string;
}

type TransactionInputData = Omit<TransactionData, 'id' | 'created_at'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: TransactionData[];
  createTransaction: (transaction: TransactionInputData) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInputData: TransactionInputData) {
    const response = await api.post('/transactions', {
      ...transactionInputData,
      created_at: new Date()
    })
    const { transaction } = response.data;

    setTransactions([
      ...transactions,
      transaction,
    ])
  };

  return (
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}