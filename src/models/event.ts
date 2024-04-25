import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category';
import { Ticket } from './ticket';
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

    @Column({
        nullable: false,
        type: "int",
        default: 0
    })
    @IsInt()
    @Max(1000)
    currentAttendeesCount: number;

    @Column({type: 'datetime', nullable: false})
    date: Date;

    @ManyToOne(() => Category, category => category.events, { nullable: false })
    @JoinColumn({ name: 'categoryId' })
    categoryId: Category;

    @OneToMany(() => Ticket, ticket  => ticket.event)
    tickets: Ticket[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
    
}