import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LandingComponent } from './landing.component';
import { NgxParticlesModule } from '@tsparticles/angular';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [RouterTestingModule, NgxParticlesModule],
    });
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-title')?.textContent).toContain(
      'Financiamiento'
    );
  });

  it('should calculate the weekly payment for 14 weeks at 40%', () => {
    component.loanAmount.set(10000);
    component.selectTerm(0);
    expect(component.weeklyPayment()).toBe(1000);
    expect(component.totalPayment()).toBe(14000);
  });
});
