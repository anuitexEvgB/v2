import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';

import { AuthService } from 'src/app/services';
import { GoogleFB } from 'src/app/models/googleFB.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private userData: GoogleFB;
  public form: FormGroup;

  constructor(
    public loadingCtrl: LoadingController,
    public authService: AuthService,

    private router: Router,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required])
    });
  }

  public login() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(res => {
        this.form.reset();
        if (res.status === 200) {
          this.router.navigate(['/pages/home']);
        } else if (res.status === 404) {
          alert('Wrong email or password');
        }
      });
    }
  }

  public async nativeGoogleLogin(): Promise<any> {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      this.presentLoading(loading);
      const gplus = await this.googlePlus.login({
        'webClientId': '160010738906-m7r2ltrlf0cugjb033f76n39hhs2aj9r.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });
      const userData = {
        name: gplus.displayName,
        email: gplus.email,
      };
      this.authService.socialLogin(userData).subscribe(_ => {
        this.router.navigate(['/pages/home']);
      });
      loading.dismiss();
    } catch (err) {
      console.log(err);
      this.loadingCtrl.dismiss();
    }
  }

  public async fbLogin() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
      });
    this.presentLoading(loading);
    const permissions = ['public_profile', 'email'];
    await this.fb.login(permissions)
    .then(_ => {
      this.fb.api('/me?fields=name,email', permissions)
      .then(user => {
        this.userData = {
          name: user.name,
          email: user.email
        };
        this.authService.socialLogin(this.userData).subscribe((res) => {
          this.router.navigate(['/pages/home']);
        });
        loading.dismiss();
      });
    }).catch(err => {
      console.log(err);
      loading.dismiss();
    });
}
  private async presentLoading(loading: HTMLIonLoadingElement) {
    return await loading.present();
  }
}

