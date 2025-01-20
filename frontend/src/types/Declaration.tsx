
interface Income {
  wage: number;
  rent: number;
  investments: number;
  others: number;
}

interface Dependents {
  name: string;
  relationship: string;
}

interface MaterialGoods {
  type: string;
  value: number;
}


// Interface para a declaração, unificando os dados
export interface Declaration {
  id?: string;
  year: string;
  income: Income;
  dependents: Dependents[];
  direct_goods: MaterialGoods[];
}
