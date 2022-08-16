import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ default: false })
  public isDone: boolean;

  @CreateDateColumn()
  // TODO: Check if database time is set, UTC
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  public readonly deletedAt?: Date;
}
