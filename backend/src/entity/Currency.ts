import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Currency {
  @PrimaryColumn("uuid")
  id: string;

  @PrimaryColumn("varchar", { length: 3 })
  code: string;

  @Column("bool")
  enabled: boolean;

  public static create(code: string, enabled?: boolean, id?: string) {
    const currency = new Currency();
    currency.id = id || uuidv4();
    currency.enabled = !!enabled;
    currency.code = code;

    return currency;
  }
}
