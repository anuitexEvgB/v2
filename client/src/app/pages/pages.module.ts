import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UpserNotePage } from 'src/app/pages/upser-note/upser-note.page';
import { HomePage } from 'src/app/pages/home/home.page';
import { PagesRoutingModule } from 'src/app/pages/pages.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagesRoutingModule,
  ],
  exports: [UpserNotePage, HomePage],
  declarations: [UpserNotePage, HomePage]
})
export class PagesModule {}
