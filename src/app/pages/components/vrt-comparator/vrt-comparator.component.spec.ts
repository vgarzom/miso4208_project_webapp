import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VrtComparatorComponent } from './vrt-comparator.component';

describe('VrtComparatorComponent', () => {
  let component: VrtComparatorComponent;
  let fixture: ComponentFixture<VrtComparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VrtComparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrtComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
