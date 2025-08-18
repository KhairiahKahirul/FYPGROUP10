import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TstingmapPage } from './tstingmap.page';

const routes: Routes = [
  {
    path: '',
    component: TstingmapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TstingmapPageRoutingModule {}
