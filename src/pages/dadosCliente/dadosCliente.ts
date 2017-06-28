import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, AlertController } from 'ionic-angular';

import {Cidades, Estados } from '../pages';
import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-dadosCliente',
  templateUrl: 'dadosCliente.html'
})
export class DadosCliente {

  allEstados = [];
  cidades: any;
  estados: any;
  estado: any;
  nome; telefone; email; cidadeEscolhida;
  relato:any;
  phoneNumberMask: any = "";

  constructor(public navCtrl: NavController, private utils: UtilsService, public fire: FirebaseService, public modal: ModalController, public params: NavParams, public viewCtrl: ViewController, public alert: AlertController) {
    this.navCtrl = navCtrl;
    this.nome   = this.utils.dadosRelato.nome;
    this.estado = this.utils.dadosRelato.estado;
    this.cidadeEscolhida = this.utils.dadosRelato.cidade;
    this.telefone = this.utils.dadosRelato.telefone;
    this.email = this.utils.dadosRelato.email;
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

  backToRelato(){
    this.utils.setDadosRelato(this.nome, this.telefone, this.email, this.estado, this.cidadeEscolhida, this.relato);
    this.viewCtrl.dismiss({nome: this.nome, telefone: this.telefone, email: this.email, estado: this.estado, cidade: this.cidadeEscolhida, relato: this.relato});
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
    this.relato = this.params.get('relato');
  }

  sendRelato(){
    if (this.utils.checkNetwork()) {
      this.utils.setDadosRelato(this.nome, this.telefone, this.email, this.estado, this.cidadeEscolhida, this.relato);

      if (this.utils.validarRelato(this.utils.dadosRelato.nome, this.utils.dadosRelato.telefone, this.utils.dadosRelato.email, this.estado, this.utils.dadosRelato.cidade, this.utils.dadosRelato.relato)) {
        this.fire.saveRelato(this.utils.dadosRelato.nome,
                             this.utils.dadosRelato.telefone,
                             this.utils.dadosRelato.email,
                             this.utils.dadosRelato.estado,
                             this.utils.dadosRelato.cidade,
                             this.utils.dadosRelato.relato);

         let alert = this.alert.create({
           title: 'Sucesso',
           subTitle: 'Seu relato foi enviado, em breve advogados entrarão em contato',
           buttons: ['OK']
         });
         alert.present();

         this.utils.clearDadosRelato();
         this.nome = '';
         this.telefone = '';
         this.email = '';
         this.estado = '';
         this.cidadeEscolhida = '';
         this.relato = '';
         this.navCtrl.pop();
      }
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }


}
