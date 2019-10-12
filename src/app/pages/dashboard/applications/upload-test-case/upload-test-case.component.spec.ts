import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTestCaseComponent } from './upload-test-case.component';

describe('UploadTestCaseComponent', () => {
  let component: UploadTestCaseComponent;
  let fixture: ComponentFixture<UploadTestCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTestCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
