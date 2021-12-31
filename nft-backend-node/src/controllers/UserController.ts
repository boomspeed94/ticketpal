import { BadRequest } from "http-errors";
import { UserModel } from "../models";
import { generateToken, getUserContext } from "../modules/auth";
import { userStore } from "../stores";
import { Request } from 'express';

class UserController {
  async getCurrentUserInfo(request: Request<{}, any, any, any, Record<string, any>>) {
    const user = getUserContext(request);
    if (user) {
      return user;
    } else {
      throw new BadRequest('Not logged in');
    }
  }

  async update(user: UserModel) {
    const updatedUser = await userStore.update(user);

    return updatedUser;
  }

  async createLoginSession(address: string) {
    const userData: UserModel = {
      id: '',
      address,
      name: '',
      phone: '',
      email: '',
      avatarUrl: '',
      birthday: '',
      createAt: '',
    };
    const user = await userStore.createIfNotExists(userData);
    const sessionId = await userStore.createLoginSession(user.id, user.address);

    return sessionId;
  }

  async authenticate(address: string, trxId: string){
    // Verify and get user info
    // TODO: validate transaction
    if (!trxId.startsWith('0x')) {
      throw new BadRequest('Invalid signature');
    }

    // Get user by address
    const user = await userStore.getByAddress(address);
    const authToken = generateToken(user);

    return ({ address, token: authToken });
  }
}

export const userController = new UserController();