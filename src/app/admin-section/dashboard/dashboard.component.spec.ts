import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent] // since it's standalone
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate vacantCount correctly', () => {
    component.rooms = [{ status: true }, { status: false }, { status: true }];
    expect(component.vacantCount).toBe(2);
  });

  it('should calculate occupiedCount correctly', () => {
    component.rooms = [{ id: 1, status: false }, { id: 2, status: true }];
    component.bookings = [{ room_id: 1, pay_status: false }];
    expect(component.occupiedCount).toBe(1);
  });

  it('should calculate reservedCount correctly', () => {
    component.bookings = [{ pay_status: false }, { pay_status: true }];
    expect(component.reservedCount).toBe(1);
  });

  it('should calculate allCount correctly', () => {
    component.rooms = [{}, {}, {}];
    expect(component.allCount).toBe(3);
  });

  it('should return statusSummary with correct structure', () => {
    component.rooms = [{ status: true }, { status: false }];
    component.bookings = [{ room_id: 2, pay_status: false }];
    
    const summary = component.statusSummary;

    expect(summary.length).toBe(4);

    expect(summary[0]).toEqual(jasmine.objectContaining({
      label: 'Vacant',
      icon: 'fa-bed',
      count: component.vacantCount
    }));

    expect(summary[1]).toEqual(jasmine.objectContaining({
      label: 'Occupied',
      icon: 'fa-bed',
      count: component.occupiedCount
    }));

    expect(summary[2]).toEqual(jasmine.objectContaining({
      label: 'Reserved',
      icon: 'fa-calendar-check',
      count: component.reservedCount
    }));

    expect(summary[3]).toEqual(jasmine.objectContaining({
      label: 'All',
      icon: 'fa-list',
      count: component.allCount
    }));
  });
});
