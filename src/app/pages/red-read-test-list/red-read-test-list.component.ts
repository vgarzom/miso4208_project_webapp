import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { MonkeyTestService } from '../../service-clients/monkey-test.service';
import { MonkeyTest } from '../../../../api/models/monkey-test.model';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { CalabashFeatureModel } from '../../../../api/models/calabash-feature.model';
import { RedReadCalabashCaseService } from 'src/app/service-clients/redread-calabash-case.service';

@Component({
  selector: 'red-read-app-test-list',
  templateUrl: './red-read-test-list.component.html',
  styleUrls: ['./red-read-test-list.component.scss']
})
export class RedReadTestListComponent implements OnInit, OnDestroy {
  monkeyTests: MonkeyTest[] = [];
  newTest: any = {
    requester: "",
    type: "monkey",
    package: "org.quantumbadger.redreader",
    monkeys: 0
  };
  lastTest: MonkeyTest = null;
  loadingStatus = "stopped";
  requesterName: String = "";

  isVisible = false;
  cases: CalabashFeatureModel[] = [];
  constructor(
    private monkeyTestService: MonkeyTestService,
    private modalService: NzModalService,
    private router: Router,
    private msg: NzMessageService,
    private redReadCalabashCaseService: RedReadCalabashCaseService
  ) { }

  showConfirm(tplContent: TemplateRef<{}>): void {
    let r = this.modalService.confirm({
      nzTitle: 'Solicitar prueba',
      nzContent: tplContent,
      nzOkText: 'Solicitar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        if (this.newTest.requester === "") {
          this.msg.error('Debes ingresar tu nombre para continuar.');
          return false;
        }
        if (this.newTest.type === "monkey" && this.newTest.monkeys === 0) {
          this.msg.error('Ingresa un número de monkeys válido. (monkeys > 0)');
          return false;
        }
        if (this.newTest.type === "calabash" && (this.newTest.calabash_case === "" || typeof (this.newTest.calabash_case) === 'undefined')) {
          this.msg.error('Selecciona un caso de pruebas válido');
          return false;
        }
        this.createTest();
      }
    });

  }

  createTest(): void {
    console.log("creating test");
    this.loadingStatus = "creating-test";

    this.monkeyTestService.create(this.newTest, (res) => {
      console.log("creation result", res);
      this.updateTestsList();
    }, (err) => {
      this.updateTestsList();
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
    const last: number = Date.parse(this.lastTest.start);
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
    this.monkeyTestService.getAll(
      res => {
        this.monkeyTests = res;
        console.log("tests", this.monkeyTests);
        if (this.monkeyTests.length > 0) {
          this.loadingStatus = "found";
          this.lastTest = this.monkeyTests[0];
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
    this.redReadCalabashCaseService.getAll(
      res => {
        this.cases = res;
        console.log("cases found", this.cases);
      },
      err => {
        console.log("error consultando");
      });
  }

  goToSelectedTest(id: String): void {
    this.router.navigate(['/monkey/' + id]);
  }

  getTestDuration(test: MonkeyTest): number {
    let result = Date.parse(test.end) - Date.parse(test.start);
    return result;
  }

}
