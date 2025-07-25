import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartContainerComponent } from 'src/app/shared/chart/chart-container.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DashboardComponent,
        ChartContainerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate vacantCount correctly', () => {
    component.rooms = [
      { status: true },
      { status: false },
      { status: true }
    ];
    expect(component.vacantCount).toBe(2);
  });

  it('should calculate occupiedCount correctly', () => {
    component.rooms = [
      { id: 1, status: false },
      { id: 2, status: true }
    ];
    component.bookings = [
      { room_id: 1, pay_status: false }
    ];
    expect(component.occupiedCount).toBe(1);
  });

  it('should calculate reservedCount correctly', () => {
    component.bookings = [
      { pay_status: false },
      { pay_status: true }
    ];
    expect(component.reservedCount).toBe(1);
  });
});
