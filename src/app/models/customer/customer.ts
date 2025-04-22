import { CustomerTag } from "./customer-tag";

export class Customer {
  id = 0;
  name = '';
  phone = '';
  birthDate = new Date();
  zipCode: string | null = null;
  street: string | null = null;
  neighborhood: string | null = null;
  houseNumber: string | null = null;
  city: string | null = null;
  state: string | null = null;
  complemento: string | null = null;
  addressObservation: string | null = null;
  createdDate = new Date();
  updatedDate = new Date();
  tags: null | CustomerTag[] = null;
}