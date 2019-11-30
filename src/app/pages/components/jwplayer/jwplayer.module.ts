import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { JwplayerComponent } from './jwplayer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    JwplayerComponent
  ],
  exports: [JwplayerComponent],
})
export class JwplayerModule { }
