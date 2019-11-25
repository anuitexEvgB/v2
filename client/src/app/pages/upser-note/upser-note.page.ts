// Vendors
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Storage } from '@ionic/storage';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions,
  LatLng
} from '@ionic-native/google-maps';
import { Instagram } from '@ionic-native/instagram/ngx';

// Models
import { Note, PhotoNote, Photo } from 'src/app/models';

// Service
import { UploadImgNestService, NestMongoService, DatabaseService, NetworkService } from 'src/app/services';

// Enviroment
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {
  public note: Note;
  public checked = false;
  public photos: PhotoNote[] = [];
  public photosRes: Photo[] = [];

  private map: GoogleMap;
  private editMode: boolean = !!this.route.snapshot.queryParams.edit;
  private api = environment.api;
  private inserId = [];

  constructor(
    public camera: Camera,
    public uploadImgNestService: UploadImgNestService,
    public photoViewer: PhotoViewer,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    public router: Router,
    public alertController: AlertController,

    private storage: Storage,
    private route: ActivatedRoute,
    private noteService: NestMongoService,
    private databaseService: DatabaseService,
    private networkService: NetworkService,
    private instagram: Instagram,
  ) {
  }

  ngOnInit() {
    if (this.editMode) {
      this.note = this.noteService.selectedNote;
    } else {
      this.note = {
        title: '',
        text: '',
        completed: false,
        latLng: {
          lat: 0,
          lng: 0,
        },
        userId: '',
        PhotoId: [],
      };
    }

    this.storage.get('USER_ID').then(id => {
      this.note.userId = id;
    });
    this.platform.ready();
    this.loadMap();
    this.uploadPhoto();
  }

  public blockPhoto() {
    const status = this.networkService.getCurrentNetworkStatus();
    if (status === 1) {
      return true;
    }
    if (status === 0) {
      return false;
    }
  }

  public close() {
    this.router.navigate(['pages/home']);
    const undef = this.photosRes;
    undef.forEach((del) => {
      if (del.noteId === 'undefined') {
        this.uploadImgNestService.deletePhoto(del.id, del.photo).subscribe();
      }
    });
  }

  public toggleChange(event: { detail: { checked: false; }; }) {
    this.note.completed = event.detail.checked;
    this.checked = event.detail.checked;
  }

  public showPhoto(img: string) {
    this.photoViewer.show(img, 'Photo');
  }

  public uploadPhoto() {
    const status = this.networkService.getCurrentNetworkStatus();
    if (status === 1 && this.note.PhotoId.length > 0) {
      this.note.PhotoId.forEach(id => {
        this.databaseService.getRowsPhotoId(id).then(photos => {
          photos.forEach(photo => {
            const photoForPush = 'data:image/png;base64,' + photo.photos;
            this.photos.unshift({
              id: photo.id,
              photo: photoForPush,
              namePhoto: 'your photo',
              SqlPhoto: photo.LiteId,
            });
          });
        });
      });
    }
    this.uploadImgNestService.getPhoto(this.note.id)
      .subscribe(res => {
        res.forEach(element => {
          if (element.noteId === this.note.id) {
            const path = `${this.api}/uploads/${element.photo}`;
            this.photos.unshift({
              id: element.id,
              photo: path,
              namePhoto: element.photo,
              SqlPhoto: element.SqlPhoto,
            });
          }
        });
      });
  }

  public deleteFile(photo: PhotoNote) {
    const index = this.photos.indexOf(photo);
    if (index > -1) {
      this.photos.splice(index, 1);
      this.uploadImgNestService.deletePhoto(photo.id, photo.namePhoto).subscribe();
      this.databaseService.deletePhotoOff(photo.SqlPhoto);
      for (let i = 0; i < this.note.PhotoId.length; i++) {
        if (this.note.PhotoId[i] === photo.SqlPhoto) {
          this.note.PhotoId.splice(i, 1);
        }
      }
    }
  }

  public async presentPhotoSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'PHOTO',
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.addPhoto();
        }
      },
      {
        text: 'Library',
        role: 'openLibrary',
        icon: 'image',
        handler: () => {
          this.openLibrary();
        }
      }]
    });
    await actionSheet.present();
  }

  public async addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    };

    this.camera.getPicture(options).then(async img => {
      let inserOnl: number;
      const status = this.networkService.getCurrentNetworkStatus();
      await this.databaseService.insertRowPhotos(this.note.id, img).then(insert => {
        this.inserId.push(insert);
        this.note.PhotoId.push(insert);
        inserOnl = insert;
        if (status === 1) {
          this.databaseService.getRowsPhotoId(insert).then(res => {
            res.forEach(photo => {
              const photoForPush = 'data:image/png;base64,' + photo.photos;
              this.photos.unshift({
                id: photo.id,
                photo: photoForPush,
                namePhoto: 'your photo',
                SqlPhoto: photo.LiteId,
              });
            });
          });
        }
      });
      const blob = this.getBlob(img, 'image/jpeg');
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe(res => {
        const path = `${this.api}/uploads/${res.result.photo}`;
        this.photos.unshift({
          id: res.result.id,
          photo: path,
          namePhoto: res.result.photo,
          SqlPhoto: res.result.SqlPhoto,
        });
        this.photosRes.push(res.result);
      });
    });
  }

  public async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
    };
    this.camera.getPicture(options).then(async (img) => {
      const alert = await this.alertController.create({
        header: 'Shared to instagram',
        message: 'Woud u like shared your photo',
        buttons: [
          {
            text: 'Cancel',
            role: 'Cancel',
            cssClass: 'danger',
          },
          {
            text: 'YEESS!!1',

            handler: () => {
              this.instagram.share('data:image/png;base64,' + img, 'TEST')
                .then(() => {
                  console.log('work!');
                })
                .catch((e) => console.log(e));
            }
          }
        ]
      });
      await alert.present();
      let inserOnl: number;
      const status = this.networkService.getCurrentNetworkStatus();
      await this.databaseService.insertRowPhotos(this.note.id, img).then(insert => {
        this.inserId.push(insert);
        this.note.PhotoId.push(insert);
        inserOnl = insert;
        if (status === 1) {
          this.databaseService.getRowsPhotoId(insert).then(res => {
            res.forEach(photo => {
              const photoForPush = 'data:image/png;base64,' + photo.photos;
              this.photos.unshift({
                id: photo.id,
                photo: photoForPush,
                namePhoto: 'your photo',
                SqlPhoto: photo.LiteId,
              });
            });
          });
        }
      });
      const blob = this.getBlob(img, 'image/jpeg');
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe((res) => {
        const path = `${this.api}/uploads/` + res.result.photo;
        this.photos.unshift({
          id: res.result.id,
          photo: path,
          namePhoto: res.result.photo,
          SqlPhoto: res.result.SqlPhoto,
        });
        this.photosRes.push(res.result);
      });
    });
  }
  public onSubmit() {
    const stat = this.networkService.getCurrentNetworkStatus();
    if (this.editMode) {
      this.noteService.updateNote(this.note).subscribe();
      if (stat === 0) {
        this.databaseService.updateDataOnl(Object.assign({}, this.note));
      }
      if (stat === 1) {
        this.databaseService.updateDataOff(Object.assign({}, this.note));
        if (this.note.id) {
          this.databaseService.insertRowUpdate(Object.assign({}, this.note));
        }
      }
    } else {
      const PhotoId = this.inserId;
      this.noteService.postNotes(this.note, this.photosRes).subscribe(res => {
        this.noteService.noteSubject.next(res);
        const resolv = Object.assign({}, res);
        const insert = { resolv, PhotoId };
        this.databaseService.insertRow(Object.assign({}, insert));
      });
      if (stat === 1) {
        const resolv = Object.assign({}, this.note);
        const insert = { resolv, PhotoId };
        this.databaseService.insertRow(Object.assign({}, insert));
        this.noteService.noteSubject.next(this.note);
      }
    }
    this.router.navigate(['pages/home']);
  }

  private getBlob(b64Data: string, contentType: string, sliceSize: number = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  private loadMap() {
    const options: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true,
        zoom: true,
      }
    };
    this.map = GoogleMaps.create('map_canvas', options);
    if (this.note.latLng.lat === 0 && this.note.latLng.lng === 0) {
      this.goToMyLocation();
    } else {
      this.map.animateCamera({
        target: this.note.latLng,
        zoom: 17,
        duration: 1000,
      });
      const nextMarker = this.map.addMarkerSync({
        title: 'Your marker',
        icon: 'blue',
        animation: GoogleMapsAnimation.BOUNCE,
        position: this.note.latLng,
      });
      nextMarker.showInfoWindow();
    }
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((params: any[]) => {
      this.map.clear();
      const geo: LatLng = params[0];
      this.note.latLng.lat = geo.lat;
      this.note.latLng.lng = geo.lng;
      this.map.addMarkerSync({
        position: this.note.latLng,
        target: this.note.latLng,
        title: 'Your marker',
        animation: GoogleMapsAnimation.BOUNCE,
      });
    });
  }

  private async goToMyLocation() {
    await this.map.getMyLocation().then((location: MyLocation) => {
      this.note.latLng = location.latLng;
      this.map.animateCamera({
        target: this.note.latLng,
        zoom: 17
      });
      const marker = this.map.addMarkerSync({
        title: 'Your marker',
        position: this.note.latLng,
        animation: GoogleMapsAnimation.BOUNCE,
      });
      marker.showInfoWindow();
    });
  }
}
