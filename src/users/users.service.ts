import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthUtils } from 'src/utils/auth.util';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  private readonly saltRounds = 10;

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }


  async createUser(user: any): Promise<User> {
    console.log(user);
    user.password = AuthUtils.harshPass(this.saltRounds, user.password);
    return await this.usersRepository.save(user);
  }
}
