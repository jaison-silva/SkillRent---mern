import User from "../models/User";
import IUserhRepository from "../interfaces/IUserInterface";

export default class MongoUserRepository implements IUserhRepository {
  findUsers() {
    return User.find()
  }

  findUserById(id: string) {
    return User.findById({ id });
  };

  updateUserById(id: String) {
    return User.findById(id)
  }

   blockUserById(id: string, isBanned: boolean) {
    return User.findById(id)
  }

}