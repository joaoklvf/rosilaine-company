import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { CustomChipsAutocompleteComponent } from 'src/app/components/custom-chips-autocomplete/custom-chips-autocomplete.component';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerTag } from 'src/app/models/customer/customer-tag';
import { CustomerTagService } from 'src/app/services/customer/customer-tag/customer-tag.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { ViaCepService } from 'src/app/services/via-cep/via-cep.service';
import { getDateFromStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss',
  imports: [FormsModule, NgxMaskDirective, ReactiveFormsModule, CustomChipsAutocompleteComponent, MatInputModule]
})

export class CustomerCreateComponent implements OnInit {
  customer = new Customer();
  title = 'Cadastrar Cliente';
  buttonText = 'Adicionar';
  address = new FormGroup({
    street: new FormControl<null | string>(null),
    city: new FormControl<null | string>(null),
    state: new FormControl<null | string>(null),
    zipCode: new FormControl<null | string>(null),
    neighborhood: new FormControl<null | string>(null)
  });
  tags: CustomerTag[] = [];
  constructor(private customerService: CustomerService, private viaCepService: ViaCepService, private route: ActivatedRoute, private snackBarService: SnackBarService, private router: Router, private customerTagService: CustomerTagService) { }

  ngOnInit(): void {
    this.customerTagService.get().subscribe(tags => this.tags = [...tags[0]]);

    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id)
      return;

    this.customerService.getById(id)
      .subscribe(customer => {
        this.customer = { ...customer }

        this.address.setValue({
          city: customer.city,
          state: customer.state,
          neighborhood: customer.neighborhood,
          street: customer.street,
          zipCode: customer.zipCode
        });
      });

    this.title = 'Editar Cliente';
    this.buttonText = 'Atualizar';
  }

  add() {
    const birthDate = getDateFromStr(this.customer.birthDate);    
    let customer: Customer = {
      ...this.customer,
      name: this.customer.name.trim(),
      birthDate
    };

    if (this.address.value.city && (!this.customer.city || this.customer.city.length === 0)) {
      customer = {
        ...customer,
        ...this.address.value
      }
    }

    if (!customer.name)
      return;

    if (customer.id)
      this.customerService.update(customer).subscribe(_ => {
        this.snackBarService.success(`Cliente ${this.customer.name.split(" ")[0]} atualizado com sucesso!`);
        this.router.navigate(['customers']);
      });
    else
      this.customerService.add(customer).subscribe(_ => {
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

  setTags(tags: CustomerTag[]) {
    this.customer.tags = [...tags];
  }
}
