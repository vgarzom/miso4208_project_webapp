import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoistestComponent } from './todoistest.component';

describe('TodoistestComponent', () => {
  let component: TodoistestComponent;
  let fixture: ComponentFixture<TodoistestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoistestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoistestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
