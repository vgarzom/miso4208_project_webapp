import { Component, OnInit, Input } from '@angular/core';
import { TestObjectService } from 'src/app/service-clients/test-object.service';

@Component({
  selector: 'app-vrt-comparator',
  templateUrl: './vrt-comparator.component.html',
  styleUrls: ['./vrt-comparator.component.scss']
})
export class VrtComparatorComponent implements OnInit {

  _test: any;
  otherTests: any[];
  isLoading: boolean = false;

  get test(): any {
    return this._test;
  }

  @Input('test')
  set test(value: any) {
    this._test = value;
    this.getTestsForComparison();
  }

  @Input() index: number;

  constructor(private testObjectService: TestObjectService) { }

  ngOnInit() {
  }

  getTestsForComparison() {
    this.testObjectService.getForComparison(this.test._id, this.test.case_id, (data) => {
      this.otherTests = data;
    })
  }

  compare() {
    
  }

}

