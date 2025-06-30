import { Component, input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { getBrCurrencyStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-custom-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './custom-chart.component.html',
  styleUrl: './custom-chart.component.scss'
})
export class CustomChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  labels = input<string[]>();
  data = input<number[]>();
  public pieChartPlugins = [DataLabelsPlugin];
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        formatter: (value, ctx) => {
          return getBrCurrencyStr(value)
        },
      },
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            return `${getBrCurrencyStr(tooltipItem.parsed)}`;
          },
        }
      }
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [''],
    datasets: [
      {
        data: [0],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  ngOnInit(): void {
    const labels = this.labels();
    const data = this.data();
    if (!(labels && data))
      return;

    this.pieChartData.labels!.pop();
    this.pieChartData.datasets[0].data.pop();
    this.pieChartData.labels!.push(...labels);
    this.pieChartData.datasets[0].data.push(...data);
  }
}
