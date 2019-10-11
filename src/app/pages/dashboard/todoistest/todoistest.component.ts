import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CypressTestService } from 'src/app/service-clients/cypress-test.service';
import { CypressTest } from '../../../../../api/models/cypress-test.model';

@Component({
  selector: 'app-todoistest',
  templateUrl: './todoistest.component.html',
  styleUrls: ['./todoistest.component.scss']
})
export class TodoistestComponent implements OnInit {

  testId: string;
  cypresstest: CypressTest = null;
  loadingStatus: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private cypressTestService: CypressTestService) { }

  ngOnInit() {
    this.loadingStatus = "loading";
    this.testId = this.activatedRoute.snapshot.paramMap.get("id");
    this.cypressTestService.getById(this.testId, (res) => {
      this.loadingStatus = "found";
      this.cypresstest = res;
    }, (err) => {
      this.loadingStatus = "not-found";
      console.log("error consultando test");
    });

  }

  getTimeFromTest(): string {
    if (this.cypressTestService === null) {
      return "";
    }
    var one_day = 1000 * 60 * 60 * 24;
    var one_hour = 1000 * 60 * 60;
    var one_minute = 1000 * 60;
    var one_second = 1000 * 60;

    const now: Date = new Date();
    const last: number = Date.parse(this.cypresstest.reporterStats.start);
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

  getSummaryBackgroundStyle(key: string): any {
    const successColor = "#87d068";
    const errorColor = "#f50";
    const neutralColor = "#2db7f5";

    if (this.cypresstest === null) {
      return {};
    }
    switch (key) {
      case 'failures':
      case 'pending':
        if (this.cypresstest.reporterStats[key] === 0)
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
        if (this.cypresstest.reporterStats.passes === this.cypresstest.reporterStats.tests) {
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
}
