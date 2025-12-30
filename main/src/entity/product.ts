import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn, Unique } from "typeorm";

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  admin_id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column({ default: 0 })
  likes: number;
}
