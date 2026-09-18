import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservartionForm } from './reservartion-form';

describe('ReservartionForm', () => {
  let component: ReservartionForm;
  let fixture: ComponentFixture<ReservartionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservartionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservartionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
