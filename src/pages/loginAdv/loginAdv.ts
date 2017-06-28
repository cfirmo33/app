import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import {NewAdv, AreaAdv} from '../pages';
import {UtilsService, FirebaseService, SQLiteService, FacebookService} from '../../providers/providers';

@Component({
  selector: 'page-loginAdv',
  templateUrl: 'loginAdv.html'
})
export class LoginAdv {

  username:string;
  password:string;
  bloqueado: string;
  adv: any;

  type= "text";
  show = false;

  constructor(public navCtrl: NavController, public fire: FirebaseService, private utils: UtilsService, private sqlite: SQLiteService, private alert: AlertController, public loading: LoadingController) {
    this.navCtrl = navCtrl;
    this.username = null;
    this.password = null;
    this.bloqueado = 'N';
    this.toggleShow();
  }

  login(){
    this.fire.getAdvs().then(data => {
      for (const key of Object.keys(data)) {
        if (this.username === data[key].email) {
          this.bloqueado = data[key].bloqueado;
        }
      }
    });
    console.log('bloqueado: '+this.bloqueado);
    if (this.utils.checkNetwork) {
      if (!this.username) {
        this.utils.toastMessage('Usuário não informado', 3000);
      } else
      if (!this.password) {
        this.utils.toastMessage('Senha não informada', 3000);
      } else {
        if (this.bloqueado === 'N') {
          this.fire.login(this.username,this.password, response =>{
            let loader = this.loading.create({
                content: 'Realizando login...',
                dismissOnPageChange: true
            });
            loader.present();
            this.sqlite.getAdvSQlite('EMAIL').then((email) => {
              if (!email) {
                this.sqlite.setAdvSQLite(this.username, this.password);
              }
            });

            this.navCtrl.setRoot(AreaAdv, {username: this.username, password: this.password});
          }, error =>{
            this.utils.toastMessage('Usuário e senha não encontrados', 3000);
            this.ionViewWillEnter();
          });
        } else {
          this.utils.toastMessage('Cadastro bloqueado. Entre em contato', 3000);
        }
      }
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }

  }

  toggleShow(){
      this.show = !this.show;
      if (this.show){
          this.type = "password";
      }
      else {
          this.type = "text";
      }
  }

  ionViewWillEnter(){
    this.sqlite.getAdvSQlite('EMAIL').then((email) => {
      this.sqlite.getAdvSQlite('SENHA').then((senha) => {
        this.username = email;
        this.password = senha;
        //this.login();
      });
    });

    this.fire.getAdvs().then(data => {
      for (const key of Object.keys(data)) {
        if (this.username === data[key].email) {
          this.bloqueado = data[key].bloqueado;
        }
      }
    });
  }

  goToNewAdv() {
    this.navCtrl.push(NewAdv);
  }

  getNewPassword() {
      let prompt = this.alert.create({
        title: 'Recuperar Senha',
        message: "Insira seu email cadastrado",
        inputs: [
          {
            name: 'rescueEmail',
            placeholder: 'email@email.com.br',
            type: 'email'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              close;
            }
          },
          {
            text: 'Enviar',
            handler: data => {
              this.fire.rescuePassword(data.rescueEmail, response =>{
                let alert = this.alert.create({
                  title: 'Verifique',
                  subTitle: 'Enviamos um e-mail para '+ data.rescueEmail +' Redefina sua senha',
                  buttons: ['OK']
                });
                alert.present();
              }, error => {
                this.utils.toastMessage('E-mail não encontrado', 3000);
              });

            }
          }
        ]
      });
      prompt.present();

  }
}
