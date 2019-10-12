import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcasesListComponent } from './testcases-list.component';

describe('TestcasesListComponent', () => {
  let component: TestcasesListComponent;
  let fixture: ComponentFixture<TestcasesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcasesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcasesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
