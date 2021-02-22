import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { User } from '../../models/User';
import * as io from "socket.io-client";

import { UserService } from '../../services/user.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  public user : User;
  public status;
  public token;
  public identity;
  public socket = io('http://localhost:4201');
  public usuarios;

  constructor(
    private _userService : UserService,
    private _router : Router,
  ) {
    this.user = new User(1,'','','','','','','','','','');
    this.identity = this._userService.getIdentity();
  }

  ngOnInit() {
    if(this.identity){
      this._router.navigate(['messenger']);
    }
  }

  onSubmit(loginForm){
    if(loginForm.valid){
      this._userService.login(this.user).subscribe(
        response =>{
          console.log(response);
          this.token = response.jwt;
          localStorage.setItem('token',this.token);

          this._userService.login(this.user,true).subscribe(
            response =>{
              console.log(response);

              localStorage.setItem('identity',JSON.stringify(response.user));
                this._userService.activar_user(response.user._id).subscribe(
                  response => {
                    this._userService.listar('').subscribe(
                      response =>{
                       this.usuarios = response.users;
                       this.socket.emit('save-users', {users: this.usuarios});


                      },
                      error =>{

                      }
                    );
                  },
                  error =>{

                  }
                );

                this._router.navigate(['messenger']);

            },
            error =>{
              console.log(<any>error);
            }
          );

        },
        error=>{
          console.log(<any>error);
        }
      );
    }else{

    }
  }

}
