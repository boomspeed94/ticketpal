import { v4 } from 'uuid';

export interface UserModel {
  id: string,
  address: string,
  name: string,
  phone: string,
  email: string,
  avatarUrl: string,
  birthday: string,
  createAt: string,
}

export function preSaveUser(cm: UserModel) {
  cm.id = v4();
  cm.name = cm.name || '';
  cm.phone = cm.phone || '';
  cm.email = cm.email || '';
  cm.avatarUrl = cm.avatarUrl || '';
  cm.birthday = cm.birthday || '';
  cm.createAt = (new Date()).toISOString();
}

export function isValidUser(cm: UserModel): Error | undefined {
  if (!cm.id) {
    throw new Error('Invalid user id');
  }

  return;
}