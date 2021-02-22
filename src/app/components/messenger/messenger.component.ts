import { Component, OnInit,AfterViewChecked, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { Message } from 'src/app/models/Message';
import * as io from "socket.io-client";
import Push from "push.js"

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})

export class MessengerComponent implements OnInit, DoCheck {

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;

  public identity : any = {};
  public de;
  public url;
  public data_message;
  public socket = io('http://localhost:4201');
  public usuarios : Array<any> = [];
  public mensajes;
  public message;
  public usuario_select : any;
  public token;
  public pre_selected;
  public last_msm;

  constructor(
    private _userService : UserService,
    private _messageService : MessageService,
    private _router :Router,
  ) {
    this.identity = this._userService.getIdentity();
    console.log(this.identity);

    this.url = GLOBAL.url;
    this.de = this.identity._id;
    this.data_message = new Message(1,'','','',false);
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.de = this.identity._id;
    if(!this.identity){
      this._router.navigate(['']);
    }else{



      this._userService.listar('').subscribe(
        response =>{
         this.usuarios = response.users;
        },
        error =>{
        }
      );



      this.socket.on('new-message', function (data) {

        var data_all = {
          de: data.message.user.de,
          para: data.message.user.para,
          msm:data.message.user.msm,
          createAt:data.message.user.createAt,
        }

        this._userService.get_user(data.message.user.de).subscribe(
          response =>{

            this.socket.on('get-identity', function (data) {
              console.log(data);

              this.identity = data;

            }.bind(this));

            if(data.message.user.de != this.de){

                Push.create(response.user.nombre, {
                    body: data.message.user.msm,
                    icon: this.url+'usuarios/img/'+response.user.imagen,
                    timeout: 4000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    }
                });



                (document.getElementById('player') as any).load();
                (document.getElementById('player') as any).play();

            }
          },
          error =>{

          }
        )

          debugger;
        this.mensajes.push(data_all);

      }.bind(this));

      this.socket.on('get-user', function (data) {

        this.usuarios.push(data.user);

      }.bind(this));

      this.socket.on('get-users', function (data) {
        this.usuarios = data.users.users;
      }.bind(this));



    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  listar(para){
    this._userService.get_messages(para,this.de).subscribe(
      response =>{
        debugger;
        this.mensajes = response.messages;
        this.scrollToBottom();



      },
      error =>{
      }
    );

    this._userService.get_user(para).subscribe(
      response =>{
        this.usuario_select = response.user;


      },
      error =>{

      }
    );

    this._messageService.last_messages(para,this.de).subscribe(
      response =>{

      },
      error =>{

      }
    );

  }

  onSubmit(send_message){
    if(send_message.valid){
      this.message = {
        de: this.de,
        para: this.usuario_select._id,
        msm: this.data_message.msm,
      };
      this._messageService.send_message(this.message).subscribe(
        response =>{
          //SEND MESSAGE
          this.socket.emit('save-message', response);

          this.scrollToBottom();
          this.data_message.msm = "";



        },
        error =>{
        }
      )

    }else{

    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngDoCheck(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();

  }

  logout(){
    this._userService.desactivar_user(this.identity._id).subscribe(
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
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.token = null;
    this.identity = null;



    this._router.navigate(['']);
  }
}
