import { BaseEntity } from "../base-entity";
import { CustomerTag } from "./customer-tag";

export class Customer extends BaseEntity {
  name = '';
  nickname?: string;
  phone = '';
  birthDate: Date | string | null = null;
  zipCode: string | null = null;
  street: string | null = null;
  neighborhood: string | null = null;
  houseNumber: string | null = null;
  city: string | null = null;
  state: string | null = null;
  complemento: string | null = null;
  addressObservation: string | null = null;
  tags: null | CustomerTag[] = null;
}
