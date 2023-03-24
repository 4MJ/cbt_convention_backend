import * as bcrypt from 'bcrypt'; 

export const AuthUtils = {
    harshPass: (saltRounds:number, password: string) =>{
        const genSalt = bcrypt.genSaltSync(saltRounds);
        const harshPassword = bcrypt.hashSync(password, genSalt);
        return harshPassword;
    },
    comparePass: (password:string, harshPass:string) =>{
        const result = bcrypt.compareSync(password, harshPass);
        return result;
    }
}