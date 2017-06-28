import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import _ from 'lodash';

import {Cidades, Estados} from '../pages';
import {UtilsService, FirebaseService, OneSignal, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-newAdv',
  templateUrl: 'newAdv.html'
})
export class NewAdv {
  allEstados = [];
  cidades: any;
  estados = [];
  estado = '';
  nome; oab; telefone; email; senha; cpf;
  cidadeEscolhida;
  cpfMask: any ="";
  phoneNumberMask: any = "";

  constructor(public navCtrl: NavController, public fire: FirebaseService, private http: Http, private utils: UtilsService, private sqlite: SQLiteService, private modal: ModalController) {
    this.navCtrl = navCtrl;
    this.cpfMask = this.utils.cpf;
    this.phoneNumberMask = this.utils.noMask;
  }

  openModalEstado(event:string){
    if (this.utils.checkNetwork()) {
      let profileModal = this.modal.create(Estados);
      profileModal.onDidDismiss(data => {
        this.estado = data;
        this.cidadeEscolhida = '';
      });
      profileModal.present();
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }

  openModalCidades(event:string, estado:string){
    if (this.utils.checkNetwork()) {
      let profileModal = this.modal.create(Cidades, { estado: estado });
      profileModal.onDidDismiss(data => {
        this.cidadeEscolhida = data;
      });
      profileModal.present();
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }

  onEstadoChange(event:string, estado:string):void {
     this.estados = this.allEstados;
     this.estados = this.estados.filter(g => g.nome === event);
     this.cidades = [];
     this.fire.getCidades(estado).then(data => {
       this.cidades = data;
     });
  }

  maskTel(tel){
    tel.target.value = tel.target.value.replace(/\D/g,"")
    if (tel.target.value.length == 11) {
      this.phoneNumberMask = this.utils.phoneNumberNew;
    } else if (tel.target.value.length == 10) {
      this.phoneNumberMask = this.utils.phoneNumber;
    } else {
      this.telefone = '';
      this.utils.toastMessage('Número de telefone inválido', 3000);
    }
  }

  setLength(){
    this.telefone = this.telefone.replace(/\D/g,"");
    this.phoneNumberMask = this.utils.noMask;
  }

  ionViewWillEnter(){
    this.nome = '';
    this.oab  = '';
    this.estado = '';
    this.cidadeEscolhida = '';
    this.telefone = '';
    this.email = '';
    this.senha = '';
    this.cpf = '';
  }

  saveUser(){
    if (this.utils.checkNetwork()) {
      if (this.utils.validarCadAdv(this.nome, this.oab, this.estado, this.cidadeEscolhida, this.telefone, this.email, this.senha)) {
        OneSignal.getPushId(id => {
          this.fire.setUser(this.nome, this.oab, this.estado, this.cidadeEscolhida, this.telefone, this.email, this.senha, this.cpf, id, response =>{
            this.fire.setCidadesNotificacao(this.nome,this.cidadeEscolhida+'-'+this.estado,0);
            this.sqlite.setAdvSQLite(this.email, this.senha);
            this.utils.toastMessage(this.nome+', cadastro realizado', 3000);
            this.navCtrl.pop();
          }, error =>{
            this.utils.toastMessage('E-mail já cadastrado ou não válido', 3000);
          });
        });
      }
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }
}
