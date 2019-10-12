import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCompilationComponent } from './upload-compilation.component';

describe('UploadCompilationComponent', () => {
  let component: UploadCompilationComponent;
  let fixture: ComponentFixture<UploadCompilationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCompilationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCompilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
