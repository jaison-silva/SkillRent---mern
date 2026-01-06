import User from "../models/userModel";
import IUserhRepository from "../interfaces/IUserRepo";

export default class MongoUserRepository implements IUserhRepository {

  async findUsers() {
    return await User.find() // should exclude pass
  }
  
  async findUserById(id: string) {
    return await User.findById(id);
  };

  async updateUserById(id: string, updateData: any) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData }
    )
  }
 
  async blockUserById(id: string, isBanned: boolean) {
    return await User.findByIdAndUpdate(
      id,
      { $set: {isBanned} },
      { new: true } // ithu full docu update akkum 
    )
  }

}