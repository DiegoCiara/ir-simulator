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

interface Dependents {
  name: string;
  relationship: string;
}

interface MaterialGoods {
  type: string;
  value: number;
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
  dependents!: Array<Dependents>;

  @Column({ type: 'jsonb' })
  direct_goods!: Array<MaterialGoods>;

  @Column({ nullable: true })
  observation!: string;

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