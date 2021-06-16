import { Entry, Folder, User } from '../types';

// exercise comment:
// for simplicity assume that user and folder can't be null
// avatar is bind to the user
export type EntryRow =
  Pick<Entry, 'date' | 'name' | 'status'>
  & { user: User & { avatar: string } }
  & { folder: Folder, };
