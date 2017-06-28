import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import {Cidades, DadosCliente} from '../pages';
import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-relato',
  templateUrl: 'relato.html'
})
export class Relato {

  public relato = '';

  constructor(public navCtrl: NavController, private utils: UtilsService, public fire: FirebaseService, public modal: ModalController) {
    this.utils.clearDadosRelato();
    this.navCtrl = navCtrl;
  }

  goToCliente(){
    let profileModal = this.modal.create(DadosCliente,{relato: this.relato});
    profileModal.onDidDismiss(data => {
      if (data) {
        this.utils.setDadosRelato(data.nome, data.telefone, data.email, data.estado, data.cidade, data.relato);
      } else {
        this.relato = '';
      }

    });
    profileModal.present();
  }


}
