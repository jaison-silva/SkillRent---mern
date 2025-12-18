import User from "../models/User";
import Provider from "../models/Provider";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { UserRegisterInput, ProviderCreateInput } from "../types/authTypes";


export class MongoAuthRepository implements IAuthRepository {

  findByEmail(email: string){
  return User.findOne({ email });
};

createUser(data: UserRegisterInput) {
  return User.create(data);
};

createProvider(data: ProviderCreateInput) {
  return Provider.create(data)
}

}


// export default {
//   findByEmail,
//   createUser,
//   createProvider
// };
