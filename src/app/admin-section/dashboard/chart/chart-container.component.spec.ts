import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartContainerComponent } from './chart-container.component';

describe('ChartContainerComponent', () => {
  let component: ChartContainerComponent;
  let fixture: ComponentFixture<ChartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the chart container component', () => {
    expect(component).toBeTruthy();
  });

  it('should accept config input', () => {
    component.config = {
      vacant: { label: 'Vacant', value: 10 },
      occupied: { label: 'Occupied', value: 5 },
      reserved: { label: 'Reserved', value: 2 }
    };
    expect(component.config.vacant.value).toBe(10);
  });
});
