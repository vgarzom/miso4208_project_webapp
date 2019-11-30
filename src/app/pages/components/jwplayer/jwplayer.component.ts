import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var jwplayer: any;

@Component({
  selector: 'app-jwplayer',
  templateUrl: './jwplayer.component.html',
  styleUrls: ['./jwplayer.component.css']
})
export class JwplayerComponent implements OnInit {

  @Output() onVideoFound = new EventEmitter();

  constructor() { }
  private videoOk: Boolean = true;
  private videoError: Boolean = false;
  private videoNotFound: Boolean = false;
  private loading: Boolean = true;

  private _video: any;

  @Input() set video(value: any) {
    this.loading = true;
    this.videoOk = true;
    this.videoError = false;
    this.videoNotFound = false;
    console.log("Setting video to jwplayer -> " + JSON.stringify(value))
    this._video = value;
    setTimeout(() => {
      this.videoOk = true;
      this.uploadVideoPlayer()
    }, 500);
  }

  get video(): any {

    return this._video;

  }

  ngOnInit() {
    console.log("Videoplayer initialized");
  }

  uploadVideoPlayer() {

    var player = jwplayer('player');

    player.stop();

    player.setup({
      title: this.video.name,
      file: this.video['file'],
      image: this.video['image'],
      width: "100%",
      aspectratio: '16:10',
      mute: false,
      autostart: false,
      primary: 'html5',
    });

    player.on("ready", () => {
      this.videoOk = true;
      this.loading = false;
      this.onVideoFound.emit(true);
    });

    player.on("setupError", (err) => {
      this.videoOk = false;
      this.loading = false;
      this.videoError = true;
      this.onVideoFound.emit(true);
      console.log("Something was wrong  --> " + JSON.stringify(err));
    });

    player.on("error", (err) => {
      this.videoOk = false;
      this.loading = false;
      this.videoNotFound = true;
      this.onVideoFound.emit(false);
      console.log("Something was wrong  --> " + JSON.stringify(err));
    });
  }


}