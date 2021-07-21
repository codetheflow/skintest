import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { entries } from '../data/entries';
import { folders } from '../data/folders';
import { users } from '../data/users';
import { Entry, Folder, User } from '../types';
import { EntryDataModule } from './entry-data.module';
import { EntryRow } from './entry-row';

@Injectable({
  providedIn: EntryDataModule
})
export class EntryDataService {
  getEntriesView(): Observable<EntryRow[]> {
    const entries$ = this.getEntries();
    const folders$ = this.getFolders();
    const users$ = this.getUsers();
    const avatars$ = this.getAvatars();

    return zip(entries$, folders$, users$, avatars$)
      .pipe(
        map(([entryList, folderList, userList, avatarList]) => {
          const folderMap = new Map(folderList.map(x => [x.id, x]));
          const userMap = new Map(userList.map(x => [x.id, x]));
          const avatarMap = new Map(avatarList.map(x => [x.user, x]));

          return entryList
            .map(entry => ({
              ...entry,
              folder: folderMap.get(entry.folder),
              user: {
                ...userMap.get(entry.user),
                avatar: avatarMap.get(entry.user)?.path
              }
            }));
        })
      );
  }

  // for testing many rows in the UI
  generateEntriesView(count: number): Observable<EntryRow[]> {
    // I'd like to use "faker" but for the exercise next approach
    // should be sufficient
    const rows: EntryRow[] = [];
    while (count--) {
      rows.push({
        date: Date.now().toString(),
        folder: { id: count, title: `fake folder ${count}` },
        name: `fake name ${count}`,
        status: count % 2 ? 'completed' : 'pending',
        user: { id: count, name: `fake user ${count}`, avatar: '' },
      });
    }

    return of(rows);
  }

  private getEntries(): Observable<Entry[]> {
    // to show rxjs skills emulate real data service
    return of(entries);
  }

  private getFolders(): Observable<Folder[]> {
    return of(folders);
  }

  private getUsers(): Observable<User[]> {
    return of(users);
  }

  private getAvatars(): Observable<Array<{ user: User['id'], path: string }>> {
    return of([
      { user: 1, path: '../assets/customer1.png' },
      { user: 2, path: '../assets/customer2.png' }
    ]);
  }
}