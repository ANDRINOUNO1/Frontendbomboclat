import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip
} from 'ng-apexcharts';

export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss']
})
export class ChartContainerComponent {
  @Input() config: ChartConfig = {};
  @Input() chartOptions!: ChartOptions; // Required

  getThemeStyles() {
    let vars: Record<string, string> = {};
    for (let key in this.config) {
      if (this.config[key].color) {
        vars[`--color-${key}`] = this.config[key].color!;
      }
    }
    return vars;
  }
}
