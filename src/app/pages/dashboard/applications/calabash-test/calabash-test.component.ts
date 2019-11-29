import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestObjectService } from 'src/app/service-clients/test-object.service';

@Component({
  selector: 'app-calabash-test',
  templateUrl: './calabash-test.component.html',
  styleUrls: ['./calabash-test.component.scss']
})
export class CalabashTestComponent implements OnInit {

  test: any;
  log: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private testService: TestObjectService) { }

  ngOnInit() {
    this.testService.getByID(this.activatedRoute.snapshot.paramMap.get("id"), (res) => {
      //this.loadingStatus = "found";
      this.test = res;
      console.log("currentTest", this.test);
    }, (err) => {
      //this.loadingStatus = "not-found";
      console.log("error consultando test");
    });

    this.testService.getLog(this.activatedRoute.snapshot.paramMap.get("id"), (data) => {
      this.log = data;
    })
  }

  getDuration() {
    if(!this.test) {
      return 0;
    }
    console.log(this.test.end_date);
    return (new Date(this.test.end_date)).getTime() - (new Date(this.test.start_date)).getTime();
  }

}
