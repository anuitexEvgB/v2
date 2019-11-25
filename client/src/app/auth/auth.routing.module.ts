import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from 'src/app/auth/login/login.page';
import { RegisterPage } from 'src/app/auth/register/register.page';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginPage,
            },
            {
                path: 'register',
                component: RegisterPage,
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
  export class AuthRoutingModule { }
