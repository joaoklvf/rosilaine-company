import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { ViaCepService } from 'src/app/services/via-cep/via-cep.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss',
  providers: [
    provideNgxMask(),
  ],
  standalone: false
})

export class CustomerCreateComponent implements OnInit {
  customer = new Customer();
  title = 'Cadastrar Cliente'

  address = new FormGroup({
    street: new FormControl<null | string>(null),
    city: new FormControl<null | string>(null),
    state: new FormControl<null | string>(null),
    zipCode: new FormControl<null | string>(null),
    neighborhood: new FormControl<null | string>(null),
    complemento: new FormControl<null | string>(null),
  });

  constructor(private customerService: CustomerService, private viaCepService: ViaCepService, private route: ActivatedRoute, private snackBarService: SnackBarService, private router: Router) { }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    if (!id)
      return;

    this.customerService.getById(id)
      .subscribe(customer => {
        this.customer = { ...customer }

        this.address.setValue({
          city: customer.city,
          complemento: customer.complemento,
          state: customer.state,
          neighborhood: customer.neighborhood,
          street: customer.street,
          zipCode: customer.zipCode
        });

        console.log(this.customer)
      });

    this.title = 'Editar Cliente';
  }

  add() {
    console.log(this.customer);
    const customer = {
      ...this.customer,
      name: this.customer.name.trim(),
    };
    if (!customer.name)
      return;

    if (customer.id > 0)
      this.customerService.update(customer).subscribe(customer => {
        this.snackBarService.success(`Cliente ${this.customer.name.split(" ")[0]} atualizado com sucesso!`);
        this.router.navigate(['customers']);
      });
    else
      this.customerService.add(customer).subscribe(customer => {
        this.snackBarService.success(`Cliente ${this.customer.name.split(" ")[0]} criado com sucesso!`);
        this.router.navigate(['customers']);
      });
  }

  async getAddressByZipCode() {
    const zipCode = this.address.value.zipCode?.replace('.', '').replace('-', '');
    if (zipCode?.length !== 8 || !this.address.controls.zipCode.dirty)
      return;

    this.viaCepService.get(zipCode).subscribe(address => {
      if (address.erro && address.erro === 'true')
        return;

      this.customer.city = address.localidade;
      this.customer.state = address.uf;
      this.customer.neighborhood = address.bairro;
      this.customer.street = address.logradouro;
      this.customer.complemento = address.complemento;
      this.customer.zipCode = address.cep;

      this.address.setValue({
        city: address.localidade,
        complemento: address.complemento,
        state: address.uf,
        neighborhood: address.bairro,
        street: address.logradouro,
        zipCode: address.cep
      });

      this.address.markAsPristine();
    });
  }

  upper(event: any) {
    event.target.value = event.target.value.toUpperCase()
  }
}
