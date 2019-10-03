import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { CypressTestService } from 'src/app/service-clients/cypress-test.service';
import { CypressTest } from '../../../../api/models/cypress-test.model';
import { CypressSpecModel } from '../../../../api/models/cypress-spec.model';
import { OnTestCreatedService } from 'src/app/service-clients/ont-test-created.service';
import { Subscription } from 'rxjs';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TodoistCypressCaseService } from 'src/app/service-clients/todoist-cypress-case.service copy';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit, OnDestroy {
  private onTestCreatedSubscription: Subscription;
  cypressTests: CypressTest[] = [];

  lastTest: CypressTest = null;
  newTestTempProgress: number = 0;
  newTestProgress: number = 0;
  newTestStatus: String = "active";
  loadingStatus = "stopped";
  maxTime: number = 20000; //Max time in milliseconds to create a test.
  intervalTime: number = 50; //Time between progress change
  requesterName: String = "";
  todoistCases: CypressSpecModel[];
  todoistSelectedCase: CypressSpecModel = null;

  images = [];
  isVisible = false;
  constructor(
    private cypressTestService: CypressTestService,
    private todoistCypressCaseService: TodoistCypressCaseService,
    private onTestCreatedService: OnTestCreatedService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private router: Router,
    private msg: NzMessageService
  ) { }

  showConfirm(tplContent: TemplateRef<{}>): void {
    let r = this.modalService.confirm({
      nzTitle: 'Iniciar prueba',
      nzContent: tplContent,
      nzOkText: 'Iniciar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        if (this.requesterName === "") {
          this.msg.error('Debes ingresar tu nombre para continuar.');
          return false;
        } else if (this.todoistSelectedCase === null) {
          this.msg.error('Debes seleccionar un caso de prueba');
          return false;
        }
        this.initTest();
      }
    });

  }

  initTest(): void {
    console.log("starting test");
    this.loadingStatus = "executing-test";
    this.newTestStatus = "active";
    this.newTestProgress = 0;
    this.newTestTempProgress = 0;

    let interval = setInterval(() => {
      this.newTestTempProgress += (this.intervalTime / this.maxTime) * 100;
      this.newTestProgress = Math.round(this.newTestTempProgress);
      if (this.newTestProgress > 95) {
        this.newTestProgress = 95;
      }
    }, this.intervalTime);

    console.log("selected case", this.todoistSelectedCase);
    this.cypressTestService.create({ requester: this.requesterName, caseId: this.todoistSelectedCase }, (res) => {
      console.log("creation result", res);
      clearInterval(interval);
      this.newTestProgress = 100;
      this.newTestStatus = res.data.status === 'success' ? "success" : "exception";
      setTimeout(() => {
        this.updateTestsList();
      }, 1000);
      this.onTestCreatedService.onTestCreated(true);
    }, (err) => {
      this.newTestStatus = "exception";
      clearInterval(interval);
      setTimeout(() => {
        this.updateTestsList();
      }, 1000);
      this.onTestCreatedService.onTestCreated(true);
    })
  }

  ngOnInit() {
    this.updateTestsList();
    this.updateCasesList();
  }

  getSummaryBackgroundStyle(key: string): any {
    const successColor = "#87d068";
    const errorColor = "#f50";
    const neutralColor = "#2db7f5";

    if (this.lastTest === null) {
      return {};
    }
    switch (key) {
      case 'failures':
      case 'pending':
        if (this.lastTest.reporterStats[key] === 0)
          return {
            "background-color": successColor
          }
        else {
          return {
            "background-color": errorColor
          }
        }
        break;

      case 'suites':
      case 'tests':
        return {
          "background-color": neutralColor
        }

      case 'passes':
        if (this.lastTest.reporterStats.passes === this.lastTest.reporterStats.tests) {
          return {
            "background-color": successColor
          }
        }
        else {
          return {
            "background-color": errorColor
          }
        }

      default:
        return {}

    }
    return {};
  }

  getTimeFromLastTest(): string {
    if (this.lastTest === null) {
      return "";
    }
    var one_day = 1000 * 60 * 60 * 24;
    var one_hour = 1000 * 60 * 60;
    var one_minute = 1000 * 60;
    var one_second = 1000 * 60;

    const now: Date = new Date();
    const last: number = Date.parse(this.lastTest.reporterStats.start);
    let milliseconds = now.getTime() - last;
    let days = Math.round(milliseconds / one_day);
    if (days > 0) {
      return `Hace ${days} días`;
    }

    let hours = Math.round(milliseconds / one_hour);
    if (hours > 0) {
      return `Hace aproximadamente ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    let minutes = Math.round(milliseconds / one_minute);
    if (minutes > 0) {
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    let seconds = Math.round(milliseconds / one_second);
    return `Hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  }

  ngOnDestroy() {
  }

  updateTestsList(): void {
    
    this.loadingStatus = "loading";
    this.cypressTestService.getAll(
      res => {
        this.cypressTests = res;
        if (this.cypressTests.length > 0) {
          this.loadingStatus = "found";
          this.lastTest = this.cypressTests[0];
        } else {
          this.lastTest = null;
          this.loadingStatus = "not-found";
        }
      },
      err => {
        console.log("error consultando");
      });
  }

  updateCasesList(): void {
    this.todoistCypressCaseService.getAll(
      res => {
        this.todoistCases = res;
      },
      err => {
        console.log("error consultando");
      });
  }

  getPath(data, position) {
    if (position === "diff") {
      return "public/" + data.resemble.img;
    }
    if (data.screenshots.length > position) {
      return "public/" + data.screenshots[position].name;
    }
  }

  showCarousel(data) {
    this.isVisible = true;
    setTimeout(() => {
      this.images = [];
      if (data.screenshots.length > 0) {
        this.images.push(
          {
            img: "public/" + data.screenshots[0].name,
            name: 'Imagen 1'
          });
      }
      if (data.screenshots.length > 1) {
        this.images.push({
          img: "public/" + data.screenshots[1].name,
          name: 'Imagen 2'
        });
      }
      if (data.resemble) {
        this.images.push(
          {
            img: "public/" + data.resemble.img,
            name: "Diferencias"
          }
        )
      }
    }, 100);
  }

  goToSelectedTest(id:String):void {
    this.router.navigate(['/todoist/'+id]);
  }

}
