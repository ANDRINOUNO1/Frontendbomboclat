import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartContainerComponent } from './chart/chart-container.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [ChartContainerComponent],
  imports: [CommonModule, NgApexchartsModule],
  exports: [ChartContainerComponent],
})
export class SharedModule {}