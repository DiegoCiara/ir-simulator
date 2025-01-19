import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

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

@Entity({ name: 'declarations' })
class Declaration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  year!: string;

  @Column({ type: 'jsonb' })
  income!: Income;

  @Column({ type: 'jsonb' })
  deductions!: Deductions;

  @Column({ type: 'jsonb' })
  dependents!: Array<Dependents>;

  @Column({ type: 'jsonb' })
  direct_goods!: Array<MaterialGoods>;

  @Column({ type: 'jsonb' })
  debts_liabilities!: Array<Debits>;

  @Column({ type: 'jsonb' })
  payments_donations!: Array<Payments>;

  @Column({ type: 'jsonb' })
  summary!: Summary;

  @Column({ type: 'jsonb', nullable: true })
  additional_information!: {
    foreign_income?: number;
    campaign_donations?: number;
    refund_bank_details?: {
      bank: string;
      agency: string;
      account: string;
    };
  };

  @ManyToOne(() => User, (token) => token.declarations)
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}

export default Declaration;