import { Component, OnInit, Input } from '@angular/core';
import { TestObjectService } from 'src/app/service-clients/test-object.service';
import { ResembleDataService } from 'src/app/service-clients/resemble-data.service';

@Component({
  selector: 'app-vrt-comparator',
  templateUrl: './vrt-comparator.component.html',
  styleUrls: ['./vrt-comparator.component.scss']
})
export class VrtComparatorComponent implements OnInit {

  _test: any;
  _index: number;
  otherTests: any[];
  selectedTest: any;
  isLoading: boolean = false;
  resembleData: any;
  comparison_image_url: string;

  get test(): any {
    return this._test;
  }

  @Input('test')
  set test(value: any) {
    this._test = value;
    this.getTestsForComparison();
  }

  get index(): number {
    return this._index;
  }
  @Input('index') 
  set index(value: number){
    this.comparison_image_url = "";
    this.resembleData = null;
    this.selectedTest = null;
    this._index = value;
  }

  constructor(
    private testObjectService: TestObjectService,
    private resembleService: ResembleDataService) { }

  ngOnInit() {
  }

  getTestsForComparison() {
    this.testObjectService.getForComparison(this.test._id, this.test.case_id, (data) => {
      this.otherTests = data;
    })
  }

  compare() {
    let comparisonReq = {
      test_id: this.test._id,
      other_test_id: this.selectedTest._id,
      screenshot_index: this.index,
      screenshots_names: [
        this.test.screenshots[this.index].name,
        this.selectedTest.screenshots[this.index].name,
      ]
    }

    this.isLoading = true;

    this.resembleService.compare(comparisonReq, (result) => {
      this.isLoading = false;
      this.resembleData = result;
      this.comparison_image_url = `https://koko-testing-storage.s3.us-east-2.amazonaws.com/comparisons/${this.test._id}_${this.selectedTest._id}_${this.index}.png`;
    },
    (err) => {
      this.isLoading = false;
      console.log("err", err);
    })
  }


}

