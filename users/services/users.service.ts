import UsersDao from '../daos/users.dao';
import { CRUD } from '../../common/crud.interface';
import { CreateUserDto } from '../dto/create.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';

class UsersService implements CRUD {
  list(limit: number, page: number): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async create(ressource: CreateUserDto) {
    return UsersDao.addUser(ressource);
  }

  async putById(id: string, ressource: PutUserDto) {
    return UsersDao.putUserById(id, ressource);
  };

  async readById(id: string) {
    return UsersDao.getUserById(id);
  }

  async deleteById(id: string) {
    return UsersDao.removeUserById(id);
  };
  async patchById(id: string, ressource: PatchUserDto) {
    return UsersDao.patchUserById(id, ressource);
  };
  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }
}

export default new UsersService();
