import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoistCypressCasesComponent } from './todoist-cypress-cases.component';

describe('TodoistCypressCasesComponent', () => {
  let component: TodoistCypressCasesComponent;
  let fixture: ComponentFixture<TodoistCypressCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoistCypressCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoistCypressCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
