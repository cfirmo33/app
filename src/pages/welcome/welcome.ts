import { Component } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';
import { Network } from 'ionic-native';

import {LoginAdv, Relato, CustomAlert} from '../pages';
import {UtilsService, FirebaseService} from '../../providers/providers';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class Welcome {

  isOnline:boolean;
  cadRelatoLiberado:boolean;

  constructor(public navCtrl: NavController, private platform: Platform, private utils: UtilsService, public modal: ModalController, public fire: FirebaseService) {
    this.navCtrl = navCtrl;
    this.isOnline = this.utils.checkNetwork();
    this.cadRelatoLiberado = true;
    this.fire.getParametros().then(data => {
      for (const key of Object.keys(data)) {
        this.cadRelatoLiberado = data[key] === 'S' ? true : false;;
      }
    })
  }

  openAdvPage(){
    if (this.utils.checkNetwork) {
      this.navCtrl.setRoot(LoginAdv);
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }

  }

  openCliPage(){
    if (this.utils.checkNetwork) {
      if (this.cadRelatoLiberado) {
        this.navCtrl.setRoot(Relato);
      } else {
        let profileModal = this.modal.create(CustomAlert, {mensagem: "Estamos em fase de cadastro dos advogados. Em breve estará disponível, aguarde..."});
        profileModal.onDidDismiss(data => {
          //
        });
        profileModal.present();
      }
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }
  }

  openSite(url){
    if (this.utils.checkNetwork) {
      let browser = new InAppBrowser(url, '_system');
    } else {
      this.utils.toastMessage('Sem conexão com internet. Verifique', 3000);
    }

  }

}
