import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedReadTestListComponent } from './red-read-test-list.component';

describe('RedReadTestListComponent', () => {
  let component:RedReadTestListComponent;
  let fixture: ComponentFixture<RedReadTestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedReadTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedReadTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
