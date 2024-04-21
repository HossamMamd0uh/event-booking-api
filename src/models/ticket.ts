import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Event } from "./event";
import { User } from "./user";

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  number: string;

  @Column({
    nullable: false,
  })
  price: number;

  @ManyToOne(() => Event, (event) => event.tickets, { nullable: false })
  @JoinColumn({ name: "eventId" })
  event: Event;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({
    nullable: false,
    default: false,
  })
  isReserved: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "timestamp", nullable: true })
  reservedAt: Date;
}
