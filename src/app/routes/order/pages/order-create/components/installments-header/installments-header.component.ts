import { Component, inject, input, model, OnChanges, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { IInstallmentHeader } from './interfaces';

@Component({
  selector: 'app-installments-header',
  imports: [MatSelectModule, ReactiveFormsModule, BrDatePickerComponent, FormsModule, MatSlideToggleModule],
  templateUrl: './installments-header.component.html',
  styleUrl: './installments-header.component.scss'
})
export class InstallmentsHeaderComponent implements OnChanges {
  readonly saveAction = output<IInstallmentHeader>();
  readonly dialog = inject(MatDialog);
  readonly firstInstallmentDate = input<Date | null>(null);
  readonly installmentsAmount = input(1);
  readonly isRounded = input(false);
  readonly modelFirstInstallmentDate = model<Date | null>(this.firstInstallmentDate());
  readonly modelInstallmentsAmount = model(this.installmentsAmount());
  readonly modelIsToRound = model(this.isRounded());

  constructor() { }

  ngOnChanges(): void {
    this.setDefaultFirstInstallmentDate();
    this.setDefaultInstallmentsAmount();
    this.setDefaultIsToRound();
  }

  changeAmountAndRecreateInstallments(installmentsAmount: number) {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar quantidade de parcelas",
        content: `Deseja alterar quantidade de parcelas, recriando todas elas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder(undefined, installmentsAmount),
        onCancelAction: () => this.setDefaultInstallmentsAmount()
      }
    });
  }

  changeFirstDateAndRecreateInstallments(firstInstallmentDate: Date) {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar primeira data de vencimento",
        content: `Deseja alterar a primeira data de vencimento e recriar as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder(firstInstallmentDate),
        onCancelAction: () => this.setDefaultFirstInstallmentDate()
      }
    });
  }

  changeIfIsToRound() {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar arredondamento",
        content: `Deseja alterar a arredondamento e recriar as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder(),
        onCancelAction: () => { this.setDefaultIsToRound() }
      }
    });
  }

  public generateInstallmentsAndSaveOrder(firstInstallmentDate?: Date, installmentsAmount?: number) {
    const params = {
      isToRound: this.modelIsToRound(),
      installmentsAmount: installmentsAmount ?? this.modelInstallmentsAmount(),
      firstInstallmentDate: firstInstallmentDate ?? this.modelFirstInstallmentDate()
    };
    this.saveAction.emit(params);
  }

  setDefaultFirstInstallmentDate() {
    this.modelFirstInstallmentDate.set(this.firstInstallmentDate())
  }

  setDefaultInstallmentsAmount() {
    this.modelInstallmentsAmount.set(this.installmentsAmount());
  }

  setDefaultIsToRound() {
    this.modelIsToRound.set(this.isRounded());
  }
}
