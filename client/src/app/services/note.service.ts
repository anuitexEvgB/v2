import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, from } from 'rxjs';

import { Note, Photo } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NestMongoService {

  public selectedNote: Note;
  public postNote: Note;
  public noteSubject = new Subject<Note>();

  private api = environment.api;

  constructor(
    private http: HttpClient,
  ) { }

  public getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/note`);
  }

  public postNotes(note: Note, photo: Photo[]): Observable<any> {
    const result = this.http.post<Note>(`${this.api}/note`, {note, photo});
    return result;
  }

  public deleteNoteId(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/note/${id}`);
  }

  public updateNote(data: Note): Observable<Note> {
    return this.http.put<Note>(`${this.api}/note/${data.id}`, data);
  }
}
