import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CypressTestComponent } from './cypress-test.component';

describe('CypressTestComponent', () => {
  let component: CypressTestComponent;
  let fixture: ComponentFixture<CypressTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CypressTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CypressTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
