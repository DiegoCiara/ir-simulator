
interface Income {
  wage: number;
  rent: number;
  investments: number;
  others: number;
}

interface Deductions {
  education: number;
  health: number;
  private_pension: number;
  others: number;
}

interface Dependents {
  name: string;
  age: number;
  relationship: string;
}

interface MaterialGoods {
  type: string;
  description: string;
  value: number;
  acquisition_date: Date;
  location: string;
}

interface Debits {
  description: string;
  initial_value: number;
  final_value: number;
}

interface Payments {
  type: string;
  recipient_name: string;
  cpf_or_cnpj: string;
  amount: number;
}

interface Summary {
  total_income: number;
  total_deductions: number;
  tax_due: number;
  tax_paid: number;
  balance: number;
}

// Interface para a declaração, unificando os dados
export interface Declaration {
  id?: string;
  year: string;
  income: Income;
  deductions: Deductions;
  dependents: Dependents[];
  direct_goods: MaterialGoods[];
  debts_liabilities: Debits[];
  payments_donations: Payments[];
  summary: Summary;
  additional_information?: {
    foreign_income?: number;
    campaign_donations?: number;
    refund_bank_details?: {
      bank: string;
      agency: string;
      account: string;
    };
  };
}
