export type LoanStatus = 'active' | 'pending' | 'late';

export interface Payment {
  id: string;
  amount: number;
  date: Date;
}

export interface LoanData {
  totalAmount: number;
  remainingBalance: number;
  nextPaymentDate: Date;
  currentTerm: number;
  totalTerms: number;
  status: LoanStatus;
  payments: Payment[];
}