import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AnalyticsComponent } from './analytics/analytics.component';

import { ChartContainerComponent } from './shared/chart/chart-container.component';
import { RouterModule } from '@angular/router';
import { ChartType } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AnalyticsComponent,
    ChartContainerComponent,
  ],
  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  rooms: any[] = [];
  bookings: any[] = [];

  chartOptions = {
    series: [{
      name: 'Rooms',
      data: [10, 20, 15, 30, 25, 40, 35]
    }],
    chart: {
      type: 'bar' as ChartType,
      height: 350
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    title: {
      text: 'Room Usage This Week'
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>('/api/rooms').subscribe(rooms => {
      this.rooms = rooms;
    });

    this.http.get<any[]>('/api/bookings').subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  get vacantCount(): number {
    return this.rooms.filter(room => room.status === true).length;
  }

  get occupiedCount(): number {
    return this.rooms.filter(room =>
      room.status === false ||
      this.bookings.some(b => b.room_id === room.id && b.pay_status === false)
    ).length;
  }

  get reservedCount(): number {
    return this.bookings.filter(b => !b.pay_status).length;
  }

  get allCount(): number {
    return this.rooms.length;
  }

  get statusSummary() {
    return [
      { label: 'New Booking', icon: 'fa-bookmark', bg: 'bg-blue-400', count: 872 },
      { label: 'Schedule Room', icon: 'fa-calendar', bg: 'bg-green-400', count: 285 },
      { label: 'Check In', icon: 'fa-sign-in-alt', bg: 'bg-orange-400', count: 53 },
      { label: 'Check Out', icon: 'fa-sign-out-alt', bg: 'bg-red-400', count: 78 }
    ];
  }

  chartConfig = {
    vacant: { label: 'Vacant', color: '#10b981' },
    occupied: { label: 'Occupied', color: '#ef4444' },
    reserved: { label: 'Reserved', color: '#facc15' }
  };
}
