import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category';
import { Max, IsInt } from 'class-validator';

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column({
        type: "int",
        nullable: false,
    })
    @IsInt()
    @Max(1000)
    availableAttendeesCount: number;

    @Column({type: 'datetime', nullable: false})
    date: Date;

    @ManyToOne(() => Category, category => category.events, { nullable: false })
    @JoinColumn({ name: 'categoryId' })
    categoryId: Category;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
    
}