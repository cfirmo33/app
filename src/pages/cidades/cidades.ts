import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams, LoadingController } from 'ionic-angular';
import _ from 'lodash';

import {NewAdv, AreaAdv} from '../pages';
import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-cidades',
  templateUrl: 'cidades.html'
})
export class Cidades {

  cidades: any;
  allCidades: any;
  estado: any;
  queryText: string;

  constructor(public navCtrl: NavController, public fire: FirebaseService, private utils: UtilsService, private sqlite: SQLiteService, private alert: AlertController, public loading: LoadingController, private viewCtrl: ViewController, private navParams: NavParams) {

    this.navCtrl = navCtrl;
    this.queryText = '';
    this.estado =  this.navParams.get('estado');
    this.cidades = [];
    this.init();

  }

  init(){

    this.fire.getCidades(this.estado).then(data => {
      let loader = this.loading.create({
          content: 'Carregando Cidades..'
      });
      loader.present();
      setTimeout(() => {
        this.cidades = data;
        setTimeout(() => {
          this.allCidades = data;
          loader.dismiss();
        }, 1000);
      }, 800);
    });
  }

  setCidade($event, cidade) {
    this.viewCtrl.setBackButtonText('');
    this.viewCtrl.dismiss(cidade);
  }

  filterCid(cid: any) {
    let val = cid.target.value;
    if (val && val.trim() != '') {
      this.cidades = _.values(this.allCidades);
      this.cidades = this.cidades.filter((cidade) => {
        return (cidade.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.cidades = this.allCidades;
    }
  }


}
