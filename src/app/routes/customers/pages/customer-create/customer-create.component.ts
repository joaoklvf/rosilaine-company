import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CustomChipsAutocompleteComponent } from 'src/app/components/custom-chips-autocomplete/custom-chips-autocomplete.component';
import { InstallmentsDashboardComponent } from 'src/app/components/installments-dashboard/installments-dashboard.component';
import { GetInstallmentsDataProps } from 'src/app/components/installments-dashboard/interfaces/installments-dashboard';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { CustomerInstallmentsMonthlyResponse, DashInstallmentsResponse } from 'src/app/interfaces/home-response';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerTag } from 'src/app/models/customer/customer-tag';
import { HomeDashOptions } from 'src/app/routes/home/interfaces/home';
import { CustomerTagService } from 'src/app/services/customer/customer-tag/customer-tag.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { CustomerInstallmentsService } from 'src/app/services/customer/installments/customer-installments.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { ViaCepService } from 'src/app/services/via-cep/via-cep.service';
import { CURRENT_MONTH } from 'src/app/utils/date-util';
import { getAmountStr, getBrCurrencyStr, getBrDateStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss',
  imports: [FormsModule, NgxMaskDirective, ReactiveFormsModule, CustomChipsAutocompleteComponent, MatInputModule, MatTabsModule, InstallmentsDashboardComponent, MatSelectModule, MatIconModule],
  providers: [provideNgxMask()]
})

export class CustomerCreateComponent implements OnInit {
  readonly selectMonthValue = CURRENT_MONTH;
  readonly TAKE_OFFSET_OPTIONS = { take: 15, offset: 0 };

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

  readonly columns: DataTableColumnProp<DashInstallmentsResponse>[] = [
    { description: "Data da parcela", fieldName: "installmentDate" },
    { description: "Valor (R$)", fieldName: "installmentAmount" },
  ]
  dashInstallments: DashInstallmentsResponse[] = [];
  dataCount = 0;
  installmentsBalance: number[] | undefined;
  installmentsTotal: string | undefined;
  pendingInstallments: string | undefined;
  monthInstallments?: CustomerInstallmentsMonthlyResponse[];
  monthInstallmentsCurrencyValue = '';

  constructor(
    private customerService: CustomerService,
    private viaCepService: ViaCepService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private router: Router,
    private customerTagService: CustomerTagService,
    private customerInstallmentsService: CustomerInstallmentsService
  ) { }

  ngOnInit(): void {
    this.customerTagService.get().subscribe(tags => this.tags = [...tags[0]]);

    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id)
      return;

    this.customerService.getById(id)
      .subscribe(customer => {
        this.customer = { ...customer, birthDate: this.getCustomerBirthDate(customer.birthDate) }

        this.address.setValue({
          city: customer.city,
          state: customer.state,
          neighborhood: customer.neighborhood,
          street: customer.street,
          zipCode: customer.zipCode
        });

        this.title = customer.name;
      });

    this.buttonText = 'Atualizar';
  }

  add() {
    let customer: Customer = {
      ...this.customer,
      name: this.customer.name.trim(),
      birthDate: this.getCustomerBirthDate(this.customer.birthDate)
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

  getCustomerBirthDate(birthDate: string | null | Date) {
    return birthDate ?
      getBrDateStr(birthDate) : null;
  }

  fetchDashBoardData() {
    this.getInstallmentsData({ option: HomeDashOptions.OverdueInstallments, filter: this.TAKE_OFFSET_OPTIONS });

    this.customerInstallmentsService.getInstallmentsBalance(this.customer.id!)
      .subscribe(response => {
        this.installmentsBalance = [response.amountPaid, response.amountToReceive];
        this.installmentsTotal = getBrCurrencyStr(response.amountTotal);
        this.pendingInstallments = getAmountStr(response.pendingInstallments)
      })
  }

  fetchMonthInstallments(month: string) {
    this.monthInstallmentsCurrencyValue = '';
    this.customerInstallmentsService.getMonthInstallments(this.customer.id!, month)
      .subscribe(response => {
        this.monthInstallments = response.map((x) => ({
          ...x,
          order_date: getBrDateStr(x.order_date),
          debit_date: getBrDateStr(x.debit_date),
          installment_amount: getBrCurrencyStr(x.installment_amount),
          order_total: getBrCurrencyStr(x.order_total),
        }));

        this.monthInstallmentsCurrencyValue = getBrCurrencyStr(response.map(x => Number(x.installment_amount)).reduce((prev, acc) => prev + acc));
      })
  }

  getInstallmentsData({ option, filter }: GetInstallmentsDataProps) {
    const params = filter ?? this.TAKE_OFFSET_OPTIONS;
    const observable = option === HomeDashOptions.NextInstallments ?
      this.customerInstallmentsService.getNextInstallments(this.customer.id!, params) : this.customerInstallmentsService.getOverdueInstallments(this.customer.id!, params);

    observable
      .subscribe(homeResponse => {
        this.dashInstallments = homeResponse[0];
        this.dataCount = homeResponse[1]
      });
  }

  checkToFetchData(index: number) {
    if (!this.customer.id)
      return;

    if (index === 1 && !this.installmentsBalance)
      this.fetchDashBoardData();

    if (index === 2 && !this.monthInstallments)
      this.fetchMonthInstallments(CURRENT_MONTH);
  }

  print() {
    window.print();
  }
}
