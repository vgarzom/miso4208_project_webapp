import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResquesterComponent } from './test-resquester.component';

describe('TestResquesterComponent', () => {
  let component: TestResquesterComponent;
  let fixture: ComponentFixture<TestResquesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResquesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResquesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
