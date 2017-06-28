import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams, LoadingController } from 'ionic-angular';
import _ from 'lodash';

import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-customAlert',
  templateUrl: 'customAlert.html'
})
export class CustomAlert {

  mensagem:any;

  constructor(public navCtrl: NavController, public fire: FirebaseService, private utils: UtilsService, private sqlite: SQLiteService, private alert: AlertController, private viewCtrl: ViewController, private navParams: NavParams, public loading: LoadingController) {
    this.mensagem  = this.navParams.get('mensagem');
  }

  close($event) {
    this.viewCtrl.setBackButtonText('');
    this.viewCtrl.dismiss();
  }




}
