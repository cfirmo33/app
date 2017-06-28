import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class UtilsService {

  dadosRelato: any = {};
  cidadesNotificacao: any = {};

  public masks: any;
  public phoneNumber: any = "";
  public phoneNumberNew: any = "";
  public cpf: any ="";
  public noMask: any ="";

  constructor(private toast: ToastController){
    this.clearDadosRelato();
    this.noMask = [/\d/, /\d/, /\d/, /\d/, /\d/,/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    this.phoneNumberNew = ['(', /\d/, /\d/, ')',/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.phoneNumber = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.cpf = [/\d/, /\d/, /\d/, '.',/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  }

  toastMessage(error, time)
  {
    let toast = this.toast.create({
      message: error,
      duration: time,
      position: 'bottom'
    });
    toast.present();
  }

  checkNetwork(): boolean {
    return navigator.onLine
  }

  validarCadAdv(nome, oab, estado, cidade, telefone, email, senha): boolean{
    if (nome == '') {
      let toast = this.toast.create({
        message: 'Por favor informe seu Nome',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (oab == '') {
      let toast = this.toast.create({
        message: 'Por favor informe número OAB',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (estado == '') {
      let toast = this.toast.create({
        message: 'Por favor informe seu Estado',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (cidade == '') {
      let toast = this.toast.create({
        message: 'Por favor informe sua Cidade',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (telefone == '') {
      let toast = this.toast.create({
        message: 'Por favor informe sua Telefone',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (email == '') {
      let toast = this.toast.create({
        message: 'Por favor informe sua Email',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (senha == '') {
      let toast = this.toast.create({
        message: 'Por favor informe sua Senha',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (senha.length < 6) {
      let toast = this.toast.create({
        message: 'Senha deve ter no minímo 6 dígitos',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    return true
  }

  validarUpdAdv(nome, oab, estado, cidade, telefone): boolean{
    if (!nome) {
      let toast = this.toast.create({
        message: 'Por favor informe seu Nome',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!oab) {
      let toast = this.toast.create({
        message: 'Por favor informe número OAB',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!estado) {
      let toast = this.toast.create({
        message: 'Por favor informe seu Estado',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!cidade) {
      let toast = this.toast.create({
        message: 'Por favor informe sua Cidade',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!telefone) {
      let toast = this.toast.create({
        message: 'Por favor informe sua Telefone',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    return true
  }

  validarRelato(nome, telefone, email, estado, cidade, relato): boolean{
    if (!nome) {
      let toast = this.toast.create({
        message: 'Por favor informe seu Nome',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!telefone) {
      let toast = this.toast.create({
        message: 'Por favor informe seu Telefone',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!estado) {
      let toast = this.toast.create({
        message: 'Por favor informe seu Estado',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!cidade) {
      let toast = this.toast.create({
        message: 'Por favor informe sua Cidade',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }
    if (!relato) {
      let toast = this.toast.create({
        message: 'Por favor informe seu Relato',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false
    }

    return true
  }

  setDadosRelato(nome, telefone, email, estado, cidade, relato){
    this.dadosRelato.nome = nome;
    this.dadosRelato.telefone = telefone;
    this.dadosRelato.email = email;
    this.dadosRelato.estado = estado;
    this.dadosRelato.cidade = cidade;
    this.dadosRelato.relato = relato;
  }

  clearDadosRelato(){
    this.dadosRelato.nome = '';
    this.dadosRelato.telefone = '';
    this.dadosRelato.email = '';
    this.dadosRelato.estado = '';
    this.dadosRelato.cidade = '';
    this.dadosRelato.relato = '';
  }

}
