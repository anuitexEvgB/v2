import { Note } from 'src/app/models';
import { Sql } from './../models/sqLite.model';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { NetworkService } from 'src/app/services/network.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database: SQLiteObject;
  public nameModel = '';
  public rowData: any[] = [];
  public rowDataDelete: Note[] = [];
  public rowDataUpdate: Note[] = [];
  public rowDataPhotos = [];
  readonly databaseName: string = 'pyps.db';
  readonly tableName: string = 'notes';
  readonly tableDelete: string = 'del';
  readonly tableUpdate: string = 'up';
  readonly tablePhotos: string = 'photos';

  constructor(
    public sqlite: SQLite,
    private storage: Storage,
  ) {
  }

  public createDB() {
    this.sqlite.create({
      name: this.databaseName,
      location: 'default',
    }).then((db: SQLiteObject) => {
      console.log(JSON.stringify(db));
      this.database = db;
      this.createTable();
      this.tableForDelete();
      this.tableForUpdate();
      this.tableForPhotos();
    }).catch(e => console.log(e));
  }

  public createTable() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableName + ' (LiteId INTEGER PRIMARY KEY, id, title, text, completed, latLng, userId, PhotoId)', [])
      .then(() => {
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public tableForPhotos() {
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePhotos + ' (LiteId INTEGER PRIMARY KEY, id, photos)', [])
      .then(() => {
      })
      .catch(e => {
        console.log(e);
      });
  }

  public tableForDelete() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableDelete + ' (id, userId)', [])
      .then(() => {
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public tableForUpdate() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableUpdate + ' (LiteId INTEGER PRIMARY KEY, id, title, text, completed, latLng, userId, PhotoId)', [])
      .then(() => {
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public async insertRowPhotos(id: number, photo: string) {
    let insertId: number;
    await this.database.executeSql('INSERT INTO ' + this.tablePhotos + '(id, photos) VALUES (?, ?)', [id, photo])
      .then(a => {
        insertId = a.insertId;
      })
      .catch(e => {
        console.log(e);
      });
    return insertId;
  }

  public async insertRowUpdate(note: Sql) {
    note.latLng = JSON.stringify(note.latLng);
    const { id, title, text, completed, latLng, userId } = note;
    const PhotoId = JSON.stringify(note.PhotoId);
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableUpdate + '(id, title, text, completed, latLng, userId, PhotoId) VALUES (?,?,?,?,?,?,?)', [id, title, text, completed, latLng, userId, PhotoId])
      .then(p => console.log(p))
      .catch(e => console.log(e));
  }

  public async insertRowDelete(id: { id: number; userId: string; }) {
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableDelete + '(id, userId) VALUES (?, ?)', [id.id, id.userId])
      .catch(e => console.log(e));
  }

  public async insertRow(note: any) {
    let insertId: number;
    note.resolv.latLng = JSON.stringify(note.resolv.latLng);
    const { id, title, text, completed, latLng, userId } = note.resolv;
    const PhotoId = JSON.stringify(note.PhotoId);
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableName + '(id, title, text, completed, latLng, userId, PhotoId) VALUES (?,?,?,?,?,?,?)', [id, title, text, completed, latLng, userId, PhotoId])
      .then(a => {
        insertId = a.insertId;
      })
      .catch(e => console.log(e));
    return insertId;
  }

  public async getRowsPhotoId(id) {
    await this.database.executeSql('SELECT * FROM ' + this.tablePhotos + ' WHERE LiteId = ' + "'" + id + "'", [])
      .then((res) => {
        this.rowDataPhotos = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            this.rowDataPhotos.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
    return this.rowDataPhotos;
  }

  public async getRowsPhotos() {
    await this.database.executeSql('SELECT * FROM ' + this.tablePhotos, [])
      .then((res) => {
        this.rowDataPhotos = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            this.rowDataPhotos.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
    return this.rowDataPhotos;
  }

  public async getRowsForDelete() {
    let userId = '';
    await this.storage.get('USER_ID').then(user => {
      userId = user;
    });
    await this.database.executeSql('SELECT * FROM ' + this.tableDelete + ' WHERE userId = ' + "'" + userId + "'", [])
      .then((res) => {
        this.rowDataDelete = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            this.rowDataDelete.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowDataDelete;
  }

  public async getRows() {
    let userId = '';
    await this.storage.get('USER_ID').then(user => {
      userId = user;
    });
    await this.database.executeSql('SELECT * FROM ' + this.tableName + ' WHERE userId = ' + "'" + userId + "'", [])
      .then((res) => {
        this.rowData = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            res.rows.item(i).completed = JSON.parse(res.rows.item(i).completed);
            res.rows.item(i).latLng = JSON.parse(res.rows.item(i).latLng);
            res.rows.item(i).PhotoId = JSON.parse(res.rows.item(i).PhotoId);
            this.rowData.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowData;
  }

  public async getRowsForUpdate() {
    let userId = '';
    await this.storage.get('USER_ID').then(user => {
      userId = user;
    });
    await this.database.executeSql('SELECT * FROM ' + this.tableUpdate + ' WHERE userId = ' + "'" + userId + "'", [])
      .then((res) => {
        this.rowDataUpdate = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            res.rows.item(i).completed = JSON.parse(res.rows.item(i).completed);
            res.rows.item(i).latLng = JSON.parse(res.rows.item(i).latLng);
            res.rows.item(i).PhotoId = JSON.parse(res.rows.item(i).PhotoId);
            this.rowDataUpdate.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowDataUpdate;
  }

  public deleteRowDelete(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableDelete + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowUpdate(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableUpdate + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowOnl(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableName + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowOff(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableName + ' WHERE LiteId = ' + item, [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deletePhotoOff(id) {
    this.database.executeSql('DELETE FROM ' + this.tablePhotos + ' WHERE LiteId = ' + id, [])
      .catch(e => {
        console.log('erro ' + JSON.stringify(e));
      });
  }

  public deletePhotoOnl(id) {
    this.database.executeSql('DELETE FROM ' + this.tablePhotos + ' WHERE id = ' + id, [])
      .catch(e => {
        console.log('erro ' + JSON.stringify(e));
      });
  }

  public updateId(note: Note) {
    const id = note.id;
    const LiteId = note.LiteId;
    this.database.executeSql('UPDATE ' + this.tableName + ' SET id = ' + "'" + id + "'" + ' WHERE LiteId = ' + "'" + LiteId + "'", []);
  }

  public updateDataOff(note: Sql) {
    console.log(note);
    const PhotoId = JSON.stringify(note.PhotoId);
    note.latLng = JSON.stringify(note.latLng);
    const { LiteId, title, text, completed, latLng } = note;
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('UPDATE ' + this.tableName + ' SET title = ' + "'" + title + "'" + ', text = ' + "'" + text + "'" + ', completed = ' + "'" + completed + "'" + ', latLng = ' + "'" + latLng + "'" + ', PhotoId = ' + "'" + PhotoId + "'" + ' WHERE LiteId = ' + "'" + LiteId + "'", [])
      .then(() => {
      })
      .catch(e => console.log(e));
  }

  public updateDataOnl(note: Sql) {
    console.log(note);
    const PhotoId = JSON.stringify(note.PhotoId);
    note.latLng = JSON.stringify(note.latLng);
    const { id, title, text, completed, latLng } = note;
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('UPDATE ' + this.tableName + ' SET title = ' + "'" + title + "'" + ', text = ' + "'" + text + "'" + ', completed = ' + "'" + completed + "'" + ', latLng = ' + "'" + latLng + "'" + ', PhotoId = ' + "'" + PhotoId + "'" + ' WHERE id = ' + "'" + id + "'", [])
      .then(() => {
      })
      .catch(e => console.log(e));
  }

  public dropDB() {
    this.database.executeSql('DROP TABLE ' + this.tableName, []);
  }

  public dropDBDel() {
    this.database.executeSql('DROP TABLE ' + this.tableDelete, []);
  }

  public dropDBUpdate() {
    this.database.executeSql('DROP TABLE ' + this.tableUpdate, []);
  }

  public dropDBPhotos() {
    this.database.executeSql('DROP TABLE ' + this.tablePhotos, []);
  }
}