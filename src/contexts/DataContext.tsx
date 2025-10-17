import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
export interface Settings {
  companyName: string;
  currency: string;
  taxRate: number;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  averageCost: number;
}

export interface Partner {
  id: string;
  name: string;
  type: 'customer' | 'supplier';
}

export interface TransactionLine {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  date: string;
  number: string;
  type: 'sales' | 'purchase';
  partnerId: string;
  partnerName: string;
  paymentMethod: 'cash' | 'credit';
  lines: TransactionLine[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  lines: {
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
}

export interface Account {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
}

interface DataContextType {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  deletePartner: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  journalEntries: JournalEntry[];
  accounts: Account[];
  exportData: () => void;
  importData: (data: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultSettings: Settings = {
  companyName: '我的公司',
  currency: 'NT$',
  taxRate: 5,
};

const defaultAccounts: Account[] = [
  { code: '1001', name: '現金/銀行', type: 'asset', balance: 0 },
  { code: '1100', name: '應收帳款', type: 'asset', balance: 0 },
  { code: '1400', name: '存貨', type: 'asset', balance: 0 },
  { code: '2100', name: '應付帳款', type: 'liability', balance: 0 },
  { code: '2300', name: '營業稅應付', type: 'liability', balance: 0 },
  { code: '3000', name: '業主權益', type: 'equity', balance: 0 },
  { code: '4000', name: '銷貨收入', type: 'revenue', balance: 0 },
  { code: '5000', name: '銷貨成本', type: 'expense', balance: 0 },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [items, setItems] = useState<Item[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('erp-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSettings(data.settings || defaultSettings);
        setItems(data.items || []);
        setPartners(data.partners || []);
        setTransactions(data.transactions || []);
        setJournalEntries(data.journalEntries || []);
        setAccounts(data.accounts || defaultAccounts);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      settings,
      items,
      partners,
      transactions,
      journalEntries,
      accounts,
    };
    localStorage.setItem('erp-data', JSON.stringify(data));
  }, [settings, items, partners, transactions, journalEntries, accounts]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    toast.success('設定已儲存');
  };

  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setItems([...items, newItem]);
    toast.success('商品已新增');
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
    toast.success('商品已更新');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('商品已刪除');
  };

  const addPartner = (partner: Omit<Partner, 'id'>) => {
    const newPartner = { ...partner, id: Date.now().toString() };
    setPartners([...partners, newPartner]);
    toast.success(`${partner.type === 'customer' ? '客戶' : '供應商'}已新增`);
  };

  const deletePartner = (id: string) => {
    setPartners(partners.filter(partner => partner.id !== id));
    toast.success('已刪除');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions([...transactions, newTransaction]);

    // Update inventory and create journal entry
    if (transaction.type === 'sales') {
      processSalesTransaction(newTransaction);
    } else {
      processPurchaseTransaction(newTransaction);
    }

    toast.success(`${transaction.type === 'sales' ? '銷貨單' : '採購單'}已登錄`);
  };

  const processSalesTransaction = (transaction: Transaction) => {
    let totalCOGS = 0;

    // Update inventory
    const updatedItems = items.map(item => {
      const line = transaction.lines.find(l => l.itemId === item.id);
      if (line) {
        const cogs = line.quantity * item.averageCost;
        totalCOGS += cogs;
        return { ...item, quantity: item.quantity - line.quantity };
      }
      return item;
    });
    setItems(updatedItems);

    // Create journal entry
    const journalEntry: JournalEntry = {
      id: Date.now().toString(),
      date: transaction.date,
      reference: transaction.number,
      lines: [
        {
          accountCode: transaction.paymentMethod === 'cash' ? '1001' : '1100',
          accountName: transaction.paymentMethod === 'cash' ? '現金/銀行' : '應收帳款',
          debit: transaction.total,
          credit: 0,
        },
        {
          accountCode: '4000',
          accountName: '銷貨收入',
          debit: 0,
          credit: transaction.subtotal,
        },
        {
          accountCode: '2300',
          accountName: '營業稅應付',
          debit: 0,
          credit: transaction.tax,
        },
        {
          accountCode: '5000',
          accountName: '銷貨成本',
          debit: totalCOGS,
          credit: 0,
        },
        {
          accountCode: '1400',
          accountName: '存貨',
          debit: 0,
          credit: totalCOGS,
        },
      ],
    };

    setJournalEntries([...journalEntries, journalEntry]);
    updateAccountBalances(journalEntry);
  };

  const processPurchaseTransaction = (transaction: Transaction) => {
    // Update inventory with average cost
    const updatedItems = items.map(item => {
      const line = transaction.lines.find(l => l.itemId === item.id);
      if (line) {
        const oldTotal = item.quantity * item.averageCost;
        const newTotal = line.quantity * line.unitPrice;
        const newQuantity = item.quantity + line.quantity;
        const newAverageCost = (oldTotal + newTotal) / newQuantity;
        return { ...item, quantity: newQuantity, averageCost: newAverageCost };
      }
      return item;
    });
    setItems(updatedItems);

    // Create journal entry
    const journalEntry: JournalEntry = {
      id: Date.now().toString(),
      date: transaction.date,
      reference: transaction.number,
      lines: [
        {
          accountCode: '1400',
          accountName: '存貨',
          debit: transaction.subtotal,
          credit: 0,
        },
        {
          accountCode: '2300',
          accountName: '營業稅應付',
          debit: transaction.tax,
          credit: 0,
        },
        {
          accountCode: transaction.paymentMethod === 'cash' ? '1001' : '2100',
          accountName: transaction.paymentMethod === 'cash' ? '現金/銀行' : '應付帳款',
          debit: 0,
          credit: transaction.total,
        },
      ],
    };

    setJournalEntries([...journalEntries, journalEntry]);
    updateAccountBalances(journalEntry);
  };

  const updateAccountBalances = (journalEntry: JournalEntry) => {
    const updatedAccounts = accounts.map(account => {
      const lines = journalEntry.lines.filter(l => l.accountCode === account.code);
      if (lines.length > 0) {
        const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
        const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
        
        // Calculate balance based on account type
        if (account.type === 'asset' || account.type === 'expense') {
          return { ...account, balance: account.balance + totalDebit - totalCredit };
        } else {
          return { ...account, balance: account.balance + totalCredit - totalDebit };
        }
      }
      return account;
    });
    setAccounts(updatedAccounts);
  };

  const exportData = () => {
    const data = {
      settings,
      items,
      partners,
      transactions,
      journalEntries,
      accounts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erp-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('資料已匯出');
  };

  const importData = (dataString: string) => {
    try {
      const data = JSON.parse(dataString);
      setSettings(data.settings || defaultSettings);
      setItems(data.items || []);
      setPartners(data.partners || []);
      setTransactions(data.transactions || []);
      setJournalEntries(data.journalEntries || []);
      setAccounts(data.accounts || defaultAccounts);
      toast.success('資料已匯入');
    } catch (error) {
      toast.error('匯入失敗：檔案格式錯誤');
    }
  };

  const resetData = () => {
    setSettings(defaultSettings);
    setItems([]);
    setPartners([]);
    setTransactions([]);
    setJournalEntries([]);
    setAccounts(defaultAccounts);
    toast.success('資料已重設');
  };

  return (
    <DataContext.Provider
      value={{
        settings,
        updateSettings,
        items,
        addItem,
        updateItem,
        deleteItem,
        partners,
        addPartner,
        deletePartner,
        transactions,
        addTransaction,
        journalEntries,
        accounts,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
