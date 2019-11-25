import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpserNotePage } from 'src/app/pages/upser-note/upser-note.page';
import { HomePage } from 'src/app/pages/home/home.page';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'home',
                component: HomePage,
            },
            {
                path: 'upsert',
                component: UpserNotePage,
            }
        ]
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
  })
  export class PagesRoutingModule { }
