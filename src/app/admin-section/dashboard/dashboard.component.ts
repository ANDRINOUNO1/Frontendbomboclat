import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { ChartContainerComponent } from 'src.app/admin-section/dashboard/chart/chart-container.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    AnalyticsComponent,
    ChartContainerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  rooms: any[] = [];
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>('/api/rooms').subscribe(rooms => this.rooms = rooms);
    this.http.get<any[]>('/api/bookings').subscribe(bookings => this.bookings = bookings);
  }

  get vacantCount() {
    return this.rooms.filter(room => room.status === true).length;
  }

  get occupiedCount() {
    return this.rooms.filter(room =>
      room.status === false ||
      this.bookings.some(b => b.room_id === room.id && b.pay_status === false)
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
