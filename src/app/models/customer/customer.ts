export class Customer {
  id: number = 0;
  name: string = '';
  phone: string = '';
  birthDate: Date = new Date();
  zipCode?: string;
  street?: string;
  neighborhood?: string;
  streetNumber?: string;
  city?: string;
  state?: string;
}