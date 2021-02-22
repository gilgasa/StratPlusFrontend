export class User{
    constructor(
        public _id : number,
        public nombre: string,
        public apellidos: string,
        public email : string,
        public pais: string,
        public telefono: string,
        public twitter: string,
        public facebook: string,
        public github: string,
        public password : string,
        public bio : string,
    ){

    }
}