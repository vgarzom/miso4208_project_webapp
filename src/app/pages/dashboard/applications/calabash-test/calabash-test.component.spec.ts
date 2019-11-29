import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalabashTestComponent } from './calabash-test.component';

describe('CalabashTestComponent', () => {
  let component: CalabashTestComponent;
  let fixture: ComponentFixture<CalabashTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalabashTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalabashTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
