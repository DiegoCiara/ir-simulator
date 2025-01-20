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

@Entity({ name: 'declarations' })
class Declaration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  year!: string;

  @Column({ type: 'jsonb' })
  values!: {
    rent: number;
    deduction: number;
  };

  @Column({
    type: 'enum',
    enum: ['UNSUBMITED', 'SUBMITED'],
    default: 'UNSUBMITED',
  })
  status!: string;

  @ManyToOne(() => User, (token) => token.declarations)
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @Column({ default: false })
  has_rectified!: boolean;

  @ManyToOne(() => Declaration, (token) => token.rectified, { nullable: true })
  @JoinColumn([{ name: 'rectified', referencedColumnName: 'id' }])
  rectified!: Declaration;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}

export default Declaration;
