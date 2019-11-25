import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NetworkService, ConnectionStatus, OfflineManagerService, DatabaseService } from 'src/app/services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private networkService: NetworkService,
    private offlineManagerService: OfflineManagerService,
    private databaseService: DatabaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.databaseService.createDB();
      this.storage.get('ACCESS_TOKEN').then(res => {
        if (res === null) {
          this.router.navigateByUrl('/auth/login');
          this.splashScreen.hide();
        } else {
          this.router.navigateByUrl('/pages/home');
          this.splashScreen.hide();
        }
      });
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          this.offlineManagerService.checkForEvents();
        }
      });
      this.statusBar.styleDefault();
    });
  }
}
