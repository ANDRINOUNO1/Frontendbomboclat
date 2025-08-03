import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Highcharts from 'highcharts';
import { SharedService, ChartDataItem, DashboardAnalytics } from '../../../../_services/shared.service';
import { Subject, takeUntil, catchError, of } from 'rxjs';

@Component({
  selector: 'dashboard-ng19-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="h-96">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Monthly Bookings Overview</h3>
        <div id="areaChart" class="w-full h-full"></div>
      </div>
      <div class="h-96">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Room Status Distribution</h3>
        <div id="pieChart" class="w-full h-full"></div>
      </div>
      <div class="h-96">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Revenue Trend</h3>
        <div id="lineChart" class="w-full h-full"></div>
      </div>
      <div class="h-96">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Occupancy Rate</h3>
        <div id="gaugeChart" class="w-full h-full"></div>
      </div>
    </div>
  `
})
export class ChartsComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  isBrowser: boolean;
  private destroy$ = new Subject<void>();
  isLoading = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadChartData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadChartData(): void {
    // Load monthly bookings data for area chart
    this.sharedService.getChartsData()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => this.sharedService.getMockChartsData())
      )
      .subscribe(data => {
        this.createAreaChart(data);
      });

    // Load room status distribution for pie chart
    this.sharedService.getRoomStatusDistribution()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([
          { name: 'Vacant', count: 70 },
          { name: 'Reserved', count: 15 },
          { name: 'Occupied', count: 15 }
        ]))
      )
      .subscribe(data => {
        this.createPieChart(data);
      });

    // Load revenue data for line chart
    this.sharedService.getRevenueData()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([
          { name: 'Jan', count: 1200 },
          { name: 'Feb', count: 1800 },
          { name: 'Mar', count: 2500 },
          { name: 'Apr', count: 2200 },
          { name: 'May', count: 3000 },
          { name: 'Jun', count: 3500 }
        ]))
      )
      .subscribe(data => {
        this.createLineChart(data);
      });

    // Load dashboard analytics for gauge chart
    this.sharedService.getDashboardAnalytics()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of({
          monthlyBookings: [],
          roomStatusDistribution: [],
          revenueData: [],
          occupancyRate: 75,
          totalRevenue: 45000,
          averageStay: 3.2
        }))
      )
      .subscribe(analytics => {
        this.createGaugeChart(analytics.occupancyRate);
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  createAreaChart(data: ChartDataItem[]): void {
    const chartData = data.map(item => item.count);
    const categories = data.map(item => item.name);

    Highcharts.chart('areaChart', {
      chart: { 
        type: 'area',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Monthly Bookings',
        style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: categories,
        labels: { style: { color: '#6B7280' } }
      },
      yAxis: {
        title: { text: 'Number of Bookings', style: { color: '#6B7280' } },
        labels: { style: { color: '#6B7280' } }
      },
      series: [{
        name: 'Bookings',
        data: chartData,
        type: 'area',
        color: '#3B82F6',
        fillOpacity: 0.3
      }],
      credits: { enabled: false },
      legend: { enabled: false }
    });
  }

  createPieChart(data: ChartDataItem[]): void {
    const pieData = data.map(item => ({
      name: item.name,
      y: item.count,
      color: this.getColorForStatus(item.name)
    }));

    Highcharts.chart('pieChart', {
      chart: { 
        type: 'pie',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Room Status Distribution',
        style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
      },
      series: [{
        data: pieData,
        type: 'pie'
      }],
      credits: { enabled: false },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%'
          }
        }
      }
    });
  }

  private getColorForStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'vacant': return '#10B981';
      case 'reserved': return '#3B82F6';
      case 'occupied': return '#F59E0B';
      default: return '#6B7280';
    }
  }

  createLineChart(data: ChartDataItem[]): void {
    const chartData = data.map(item => item.count);
    const categories = data.map(item => item.name);

    Highcharts.chart('lineChart', {
      chart: { 
        type: 'line',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Revenue Trend',
        style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: categories,
        labels: { style: { color: '#6B7280' } }
      },
      yAxis: {
        title: { text: 'Revenue ($)', style: { color: '#6B7280' } },
        labels: { style: { color: '#6B7280' } }
      },
      series: [{
        name: 'Revenue',
        data: chartData,
        type: 'line',
        color: '#10B981',
        marker: {
          enabled: true,
          radius: 4
        }
      }],
      credits: { enabled: false },
      legend: { enabled: false }
    });
  }

  createGaugeChart(occupancyRate: number): void {
    const gaugeOptions: Highcharts.Options = {
      chart: { 
        type: 'gauge',
        backgroundColor: 'transparent',
        plotBackgroundColor: undefined,
        plotBackgroundImage: undefined,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: 'Occupancy Rate',
        style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '109%',
          innerRadius: '107%',
          shape: 'arc'
        }, {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#333'],
              [1, '#FFF']
            ]
          },
          borderWidth: 1,
          outerRadius: '107%',
          innerRadius: '105%',
          shape: 'arc'
        }, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '105%',
          innerRadius: '103%',
          shape: 'arc'
        }, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '103%',
          innerRadius: '101%',
          shape: 'arc'
        }]
      },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        minorTickInterval: undefined,
        tickPixelInterval: 400,
        tickWidth: 0,
        title: {
          y: -70,
          text: `${occupancyRate}%`
        },
        labels: {
          distance: 20,
          style: { fontSize: '16px' }
        }
      },
      plotOptions: {
        gauge: {
          dataLabels: {
            enabled: false
          },
          dial: {
            radius: '80%',
            backgroundColor: 'silver',
            baseWidth: 10,
            baseLength: '0%',
            rearLength: '0%'
          },
          pivot: {
            backgroundColor: 'silver',
            radius: 5
          }
        }
      },
      series: [{
        name: 'Occupancy',
        data: [occupancyRate],
        type: 'gauge',
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:black">{y}</span><br/>' +
            '<span style="font-size:12px;color:silver">%</span></div>'
        },
        tooltip: {
          valueSuffix: '%'
        }
      }],
      credits: { enabled: false }
    };

    Highcharts.chart('gaugeChart', gaugeOptions);
  }
}