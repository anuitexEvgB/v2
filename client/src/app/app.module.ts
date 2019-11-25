// Vendors
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';
import { Backlight } from '@ionic-native/backlight/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Instagram } from '@ionic-native/instagram/ngx';

// Component
import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

// Provider
import { InterceptorProvider } from 'src/app/prodivers/interceptor';

// Service
import { NestMongoService, UploadImgNestService } from 'src/app/services';

const firebaseConfig = {
  apiKey: 'AIzaSyBTC3bPN4RtCWU42UzBLCOPol098BfbBo8',
  authDomain: 'client-1570537507043.firebaseapp.com',
  databaseURL: 'https://client-1570537507043.firebaseio.com',
  projectId: 'client-1570537507043',
  storageBucket: 'client-1570537507043.appspot.com',
  messagingSenderId: '160010738906',
  appId: '1:160010738906:web:c0d2ea54da1c72612699e3',
  measurementId: 'G-PZMCN78RQN'
};

@NgModule({
  declarations: [AppComponent ],
  entryComponents: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
    UploadImgNestService,
    NestMongoService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    Camera,
    File,
    FilePath,
    WebView,
    Geolocation,
    LocationAccuracy,
    AndroidPermissions,
    PhotoViewer,
    GooglePlus,
    Facebook,
    Network,
    Dialogs,
    SQLite,
    Base64ToGallery,
    Vibration,
    YoutubeVideoPlayer,
    TextToSpeech,
    Brightness,
    Backlight,
    CallNumber,
    Instagram,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
