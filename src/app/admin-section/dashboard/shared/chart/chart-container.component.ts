import { Component, Input, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  imports: [NgApexchartsModule]
})

export class ChartContainerComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() chartOptions!: Partial<ChartOptions>;
}
