import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilationsListComponent } from './compilations-list.component';

describe('CompilationsListComponent', () => {
  let component: CompilationsListComponent;
  let fixture: ComponentFixture<CompilationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompilationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompilationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
