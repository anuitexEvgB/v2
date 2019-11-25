import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterPage } from 'src/app/auth/register/register.page';
import { LoginPage } from 'src/app/auth/login/login.page';
import { AuthRoutingModule } from 'src/app/auth/auth.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthRoutingModule,
  ],
  exports: [RegisterPage, LoginPage],
  declarations: [RegisterPage, LoginPage],
})
export class AuthModule { }
