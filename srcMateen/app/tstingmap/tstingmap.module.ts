import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TstingmapPage } from './tstingmap.page';
import { TstingmapPageRoutingModule } from './tstingmap-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TstingmapPageRoutingModule,
    TstingmapPage
  ],
})
export class TstingmapPageModule {}
