import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartsComponent } from '../shared/chart/charts.component';

@Component({
  selector: 'app-dashboardchartview',
  standalone: true,
  imports: [CommonModule, ChartsComponent],
  templateUrl: './dashboardchartview.component.html',
  styleUrl: './dashboardchartview.component.scss'
})
export class DashboardchartviewComponent {
isBrowser: boolean;

  statusSummary = [
    { label: 'Vacant', count: 120, icon: 'fa-bed', class: 'bg-blue-50' },
    { label: 'Reserved', count: 85, icon: 'fa-check-circle', class: 'bg-green-50' },
    { label: 'Occupied', count: 35, icon: 'fa-calendar-alt', class: 'bg-yellow-50' },
    { label: 'Total', count: '$150k', icon: 'fa-dollar-sign', class: 'bg-red-50' }
  ];  

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}
}
