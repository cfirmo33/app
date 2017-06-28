import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams, LoadingController } from 'ionic-angular';
import _ from 'lodash';

import {NewAdv, AreaAdv} from '../pages';
import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-estados',
  templateUrl: 'estados.html'
})
export class Estados {

  estados: any;
  allEstados: any;
  queryText: string;

  constructor(public navCtrl: NavController, public fire: FirebaseService, private utils: UtilsService, private sqlite: SQLiteService, private alert: AlertController, private viewCtrl: ViewController, private navParams: NavParams, public loading: LoadingController) {
    this.navCtrl = navCtrl;
    this.queryText = '';
    this.estados = [];


          this.fire.getEstados().then(data => {
            let loader = this.loading.create({
                content: 'Carregando Estados..'
            });
            loader.present();
              setTimeout(() => {
                for (const key of Object.keys(data)) {

                  this.estados.push({ nome: key });  
                  setTimeout(() => {
                    this.allEstados = this.estados;
                    loader.dismiss();
                  }, 500);
                }
              }, 200);
          });

  }

  setEstado($event, estado) {
    this.viewCtrl.setBackButtonText('');
    this.viewCtrl.dismiss(estado.nome);
  }

  filterEstado(cid: any) {
    let val = cid.target.value;
    if (val && val.trim() != '') {
      this.estados = _.values(this.allEstados);
      this.estados = this.estados.filter((estado) => {
        return (estado.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.estados = this.allEstados;
    }
  }


}
