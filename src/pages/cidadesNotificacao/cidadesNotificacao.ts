import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams, LoadingController } from 'ionic-angular';
import _ from 'lodash';

import {UtilsService, FirebaseService, SQLiteService} from '../../providers/providers';

@Component({
  selector: 'page-cidadesNotificacao',
  templateUrl: 'cidadesNotificacao.html'
})
export class CidadesNotificacao {

  cidades: any;
  allCidades: any;
  estado: any;
  queryText: string;
  allEstados = [];
  estados = [];

  show = false;
  advogado: any;
  cidadesNotificacao:string[] = [];
  cidadesJaNotificadas:string[] = [];
  cidadesRemovidas:string[] = [];

  constructor(public navCtrl: NavController, public fire: FirebaseService, private utils: UtilsService, private sqlite: SQLiteService, private alert: AlertController, private viewCtrl: ViewController, private navParams: NavParams, public loading: LoadingController) {
    this.navCtrl = navCtrl;
    this.queryText = '';
    this.cidades = [];
    this.estado = '';
    this.advogado  = this.navParams.get('nome');
    this.cidadesJaNotificadas = [];
    this.cidadesJaNotificadas = this.navParams.get('cidades');
  }

  ionViewWillEnter(){
    this.fire.getEstados().then(data => {
       for (const key of Object.keys(data)) {

        this.estados.push({ nome: key });
        this.allEstados = this.estados;
       }
    });
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

  onEstadoChange(event:string, estado:string):void {
     this.estados = this.allEstados;
     this.estados = this.estados.filter(g => g.nome === event);
     this.cidades = [];
     let loader = this.loading.create({
         content: 'Carregando Cidades...',
         dismissOnPageChange: true
     });
    loader.present();
     this.fire.getCidades(estado).then(data => {
       this.cidades = data;
       this.allCidades = data;
       setTimeout(() => {
         loader.dismiss();
       }, 1000);
     });
  }

  checkBoxClick(cidade, estado){
    const foundAt = this.cidadesNotificacao.indexOf(cidade+'-'+estado);
    if (this.cidadeChecada(cidade, estado)) {
      const foundAtCheckada = this.cidadesJaNotificadas.indexOf(cidade+'-'+estado);
      if (foundAtCheckada >= 0) {
        this.cidadesJaNotificadas.splice(foundAtCheckada, 1);
        this.cidadesNotificacao.splice(foundAt, 1);
      }
    } else {
      this.cidadesNotificacao.push(cidade+'-'+estado);
    }
  }

  cidadeChecada(cidade, estado): boolean{
    const foundAt = this.cidadesJaNotificadas.indexOf(cidade+'-'+estado);
    if (foundAt >= 0) {
      return true
    } else {
      return false
    }
  }

  mergeCidades(array){

        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;

  }

  saveCidades(){
    this.fire.clearCidadesNotificacao(this.advogado);
    this.cidadesNotificacao = this.mergeCidades(this.cidadesNotificacao.concat(this.cidadesJaNotificadas));
    for (let i = 0; i < this.cidadesNotificacao.length; i++) {
        //this.cidadesNotificacao[i];
        this.fire.setCidadesNotificacao(this.advogado, this.cidadesNotificacao[i], i);
    }
    this.utils.toastMessage('Cidades para notificações cadastradas', 3000);
    this.navCtrl.pop();
  }


}
