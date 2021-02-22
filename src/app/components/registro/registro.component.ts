import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import * as io from "socket.io-client";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistroComponent implements OnInit {

  public user;
  public socket = io('http://localhost:4201');

  constructor(
    private _userService : UserService,
    private _router : Router,
  ) {
    this.user = new User(1,'','','','','','','','','','');
   }

  ngOnInit() {
  }
  onSubmit(registroForm){
    if(registroForm.valid){
      this._userService.registrar(this.user).subscribe(
        response=>{
          this._router.navigate(['']);
          this.socket.emit('save-user', response.user);
        },
        error=>{

        }
      );
    }

  }
}
