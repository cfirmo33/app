import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import {Firebase} from 'ionic-native';
import _ from 'lodash';

import {Cidades, CidadesNotificacao, Estados} from '../pages';
import {UtilsService, FirebaseService} from '../../providers/providers';

@Component({
  selector: 'page-perfilAdv',
  templateUrl: 'perfilAdv.html'
})
export class PerfilAdv {

  username:string;
  password:string;
  advogado = [];

  allEstados = [];
  cidades: any;
  estados = [];
  nome:string;
  nomeAntigo:string;
  estado: string;
  oab: string;
  telefone: string;
  cpf: string;
  pagante: boolean;
  cidadeEscolhida;
  cidadesNotificacao:string[] = [];
  cpfMask: any ="";
  phoneNumberMask: any = "";

  constructor(public navCtrl: NavController, public params: NavParams, public fire: FirebaseService, private modal: ModalController, public utils: UtilsService, public loading: LoadingController) {
    this.navCtrl = navCtrl;
    this.username  = this.params.get('username');
    this.password  = this.params.get('password');
    this.nomeAntigo= '';
    this.nome= '';
    this.cidadeEscolhida= '';
    this.estado= '';
    this.oab= '';
    this.telefone= '';
    this.cpf = '';
    this.pagante = false;
    this.phoneNumberMask = this.utils.noMask;
    this.cpfMask = this.utils.cpf;
    //this.ionViewWillEnter();
    //this.ionViewDidEnter();
  }

  ionViewDidEnter(){
    this.ionViewWillEnter();

    if (this.nome != undefined) {

      this.cidadesNotificacao = [];
      this.fire.getCidadesNotificacao(this.nome).then(data => {
        for (const key of Object.keys(data)) {
          this.cidadesNotificacao.push(data[key].cidade);
        }
      })
    }


  }

  ionViewWillEnter(){

    this.fire.getAdvs().then(data => {

      for (const key of Object.keys(data)) {
        if (this.username === data[key].email) {
          this.nomeAntigo = data[key].nome;
          this.nome = data[key].nome;
          this.cidadeEscolhida = data[key].cidade;
          this.estado = data[key].estado;
          this.oab = data[key].oab;
          this.telefone = data[key].telefone;
          this.cpf = data[key].cpf;
          this.cpfMask = this.utils.cpf;
          this.pagante = data[key].pagante==='S' ? true : false;
        }

      }
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

  goToCidadesNotificacao(){
    if (this.utils.checkNetwork()) {
      this.navCtrl.push(CidadesNotificacao, {nome: this.nome, cidades: this.cidadesNotificacao});
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }

  updateAdv(){
    if (this.utils.checkNetwork()) {
      if (this.utils.validarUpdAdv(this.nome, this.oab, this.estado, this.cidadeEscolhida, this.telefone)) {
        this.fire.updateAdv(this.nomeAntigo, this.nome, this.oab, this.telefone, this.cpf, this.estado, this.cidadeEscolhida);
        this.utils.toastMessage('Cadastro atualizado', 3000);
        this.navCtrl.popToRoot();
      }
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }


}
