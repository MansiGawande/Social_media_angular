import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewproComponent } from './viewpro.component';

describe('ViewproComponent', () => {
  let component: ViewproComponent;
  let fixture: ComponentFixture<ViewproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewproComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
