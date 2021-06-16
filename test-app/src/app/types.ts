export interface Entry {
  date: string;
  name: string;
  folder: Folder['id'];
  user: User['id'];
  status: EntryStatus;
}

export interface Folder {
  id: number;
  title: string;
}

export interface User {
  id: number;
  name: string;
}

export type EntryStatus = 'pending' | 'completed';
