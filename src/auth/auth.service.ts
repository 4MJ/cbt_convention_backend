import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUtils } from 'src/utils/auth.util';


@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService
      ) {}
    //Validate a user
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user) {
          const checkPassport = AuthUtils.comparePass(pass, user.password);
          if (checkPassport) {
            return user;
          }
          return {
            message: 'Wrong Password'
          };
        }
        return null;
    }

    //login
    async login(user: any) {
      const loginUser = await this.validateUser(user.email, user.password);
      if(loginUser && !loginUser.message){
        const payload = { email: user.email, pass: user.password };
        return {
          statusCode: 200,
          message: 'Login Sucessfull',
          access_token: this.jwtService.sign(payload),
          user
        };
      }else if (loginUser && loginUser.message) {
        return{
          statusCode: 401,
          message: 'Wrong Password',
        }
      }
      return{
          statusCode: 401,
          message: 'User does not exist',
      }
    }

    //sign up a user
    async sign_up(user: any){
      const checkUser = await this.usersService.findOne(user.email);
      if(checkUser){
        return {
          message : 'User already exist, use another email',
        }
      };

      const signup_user = await this.usersService.createUser(user);
      return signup_user;
    }
}
