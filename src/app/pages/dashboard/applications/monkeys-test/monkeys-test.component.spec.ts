import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonkeysTestComponent } from './monkeys-test.component';

describe('MonkeysTestComponent', () => {
  let component: MonkeysTestComponent;
  let fixture: ComponentFixture<MonkeysTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonkeysTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonkeysTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
