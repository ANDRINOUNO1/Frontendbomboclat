import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ChartContainerComponent, ChartOptions } from './shared/chart/dashboard-chart.component';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AnalyticsComponent,
    ChartContainerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] 
})
export class DashboardComponent implements OnInit {
  rooms: any[] = [];
  bookings: any[] = [];

 
  chartOptions: ChartOptions = {
    series: [
      { name: 'Sales', data: [30, 40, 45, 50, 49, 60, 70] },
      { name: 'Revenue', data: [20, 30, 40, 45, 50, 55, 65] }
    ],
    chart: { type: 'line', height: 350, toolbar: { show: false } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    title: { text: 'Monthly Performance', align: 'left' },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' },
    tooltip: { enabled: true }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>(`${environment.apiUrl}/rooms`).subscribe(rooms => {
      this.rooms = rooms;
    });
    this.http.get<any[]>(`${environment.apiUrl}/bookings`).subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  get vacantCount() {
    return this.rooms.filter(room => room.status === true).length;
  }

  get occupiedCount() {
    return this.rooms.filter(room =>
      room.status === false ||
      this.bookings.some(b => b.room_id === room.id && b.pay_status == false)
    ).length;
  }

  get reservedCount() {
    return this.bookings.filter(b => !b.pay_status).length;
  }

  get allCount() {
    return this.rooms.length;
  }

  get statusSummary() {
    return [
      { label: 'Vacant', icon: 'fa-bed', class: 'status-vacant', count: this.vacantCount },
      { label: 'Occupied', icon: 'fa-bed', class: 'status-occupied', count: this.occupiedCount },
      { label: 'Reserved', icon: 'fa-calendar-check', class: 'status-reserved', count: this.reservedCount },
      { label: 'All', icon: 'fa-list', class: 'status-all', count: this.allCount }
    ];
  }
}
