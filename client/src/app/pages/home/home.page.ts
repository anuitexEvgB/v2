import { switchMap } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Backlight } from '@ionic-native/backlight/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';

import { Note } from 'src/app/models/note.model';
import { AuthService, NestMongoService, DatabaseService, NetworkService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public notes: Note[] = [];
  public brightnessModel = 0.40;

  constructor(
    public modalController: ModalController,
    public databaseService: DatabaseService,
    public alertController: AlertController,
    public toastController: ToastController,

    private noteService: NestMongoService,
    private router: Router,
    private authService: AuthService,
    private networkService: NetworkService,
    private backlight: Backlight,
    private callNumber: CallNumber,
    private vibration: Vibration,
    private youtube: YoutubeVideoPlayer,
    private tts: TextToSpeech,
    private brightness: Brightness,
  ) {
    this.brightness.setBrightness(this.brightnessModel);
    const subscription = this.noteService.noteSubject.pipe(switchMap((res) => {
      this.notes.push(res);
      return this.networkService.status;
    }));

    subscription.subscribe((res) => {
      if (res === 1) {
        this.databaseService.getRows().then(response => {
          this.notes = response;
        });
      }
    });
  }

  ngOnInit() {
    this.refreshSQL();
    this.getAll();
  }

  public refreshSQL() {
    this.networkService.status.subscribe(res => {
      if (res === 1) {
        this.databaseService.getRows().then(response => {
          this.notes = response;
        });
      }
    });
  }

  public adjustBrightness() {
    this.brightness.setBrightness(this.brightnessModel);
  }

  async test() {
    const toast = await this.toastController.create({
      header: 'Вийди звідси, розбійник',
      animated: true,
      mode: 'md',
      color: 'danger',
      showCloseButton: true,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
    this.vibration.vibrate(1000);
  }

  async test2() {
    const alert = await this.alertController.create({
      header: 'Call',
      inputs: [
        {
          name: 'Number',
          type: 'number',
          min: 9,
          max: 9,
          value: '+380',
          placeholder: 'write your number',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Call',
          handler: a => {
            this.callNumber.callNumber(a.number, true)
            .then(res => console.log(res))
            .catch(e => console.log(e));
          }
        }
      ]
    });
    await alert.present();
  }

  test3() {
    this.youtube.openVideo('W5adeFNRk6Y');
  }

  test4() {
    this.tts.speak('Fuck you')
    .then(() => console.log('wokred'))
    .catch(e => console.log(e));
  }

  public doRefresh(event: { target: { complete: () => void; }; }) {
    this.getAll();
    this.refreshSQL();
    event.target.complete();
  }

  public async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/auth/login');
  }

  public add() {
    this.router.navigate(['/pages/upsert']);
  }

  public edit(note: Note) {
    this.noteService.selectedNote = note;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit: true,
      }
    };
    this.router.navigate(['/pages/upsert'], navigationExtras);
  }

  public delete(note: Note) {
    const status = this.networkService.getCurrentNetworkStatus();
    const index = this.notes.indexOf(note);
    if (index > -1) {
      this.notes.splice(index, 1);
      if (status === 1) {
        if (note.id) {
          const del = {
            id: note.id,
            userId: note.userId
          };
          this.databaseService.insertRowDelete(del);
        }
        this.databaseService.deleteRowOff(note.LiteId);
        note.PhotoId.forEach(id => {
          this.databaseService.deletePhotoOff(id);
        });
      }
      if (status === 0) {
        this.databaseService.deleteRowOnl(note.id);
        note.PhotoId.forEach(id => {
          this.databaseService.deletePhotoOff(id);
        });
      }
      this.noteService.deleteNoteId(note.id).subscribe();
      return;
    }
  }

  public autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  private getAll() {
    this.noteService.getNotes()
      .subscribe(response => {
        this.notes = response;
      });
  }
}
