import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss']
})
export class ChartContainerComponent {
  @Input() config: any;
}
// src/app/admin-section/dashboard/chart/chart-container.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss']
})
export class ChartContainerComponent {}
