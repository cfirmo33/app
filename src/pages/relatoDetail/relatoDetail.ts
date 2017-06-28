import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

import {Cidades, DadosCliente} from '../pages';
import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-relatoDetail',
  templateUrl: 'relatoDetail.html'
})
export class RelatoDetail {

  public relato : any;

  constructor(public navCtrl: NavController, private utils: UtilsService, public fire: FirebaseService, public modal: ModalController, public params: NavParams) {
    this.navCtrl = navCtrl;
    this.relato  = this.params.get('relato');
  }



}
