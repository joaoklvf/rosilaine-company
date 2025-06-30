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
  width = input<string>('inherit');
  height = input<string>('inherit');
  public doughnutChartPlugins = [DataLabelsPlugin];
  // doughnut
  public doughnutChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        formatter: (value, ctx) => {
          return getBrCurrencyStr(value)
        },
        font: {
          weight: 700,
          size: 14
        },
        color: 'white'
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
  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [''],
    datasets: [
      {
        data: [0],
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    const labels = this.labels();
    const data = this.data();
    if (!(labels && data))
      return;

    this.doughnutChartData.labels!.pop();
    this.doughnutChartData.datasets[0].data.pop();
    this.doughnutChartData.labels!.push(...labels);
    this.doughnutChartData.datasets[0].data.push(...data);
  }
}
