import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import _ from 'lodash';

import { PerfilAdv, RelatoDetail } from '../pages'
import {UtilsService, FirebaseService} from '../../providers/providers';

@Component({
  selector: 'page-areaAdv',
  templateUrl: 'areaAdv.html'
})
export class AreaAdv {

  username:string;
  password:string;
  nome:string;
  estado: string;
  oab: string;
  telefone: string;
  cidade: string;
  cpf: string;
  cpfMask: any ="";
  relatos:any[] = [];
  cidadesNotificacao:string[] = [];
  pegouRelatos = false;
  temRelato = true;


  constructor(public navCtrl: NavController, private params: NavParams, public loading: LoadingController, public fire: FirebaseService, public utils: UtilsService) {
    this.navCtrl = navCtrl;
    this.username  = this.params.get('username');
    this.password  = this.params.get('password');
    this.relatos = [];
  }

  goToPerfil(){
    let loader = this.loading.create({
        content: 'Carregando seu Perfil...',
        dismissOnPageChange: true
    });
    loader.present();
    this.navCtrl.push(PerfilAdv, {username: this.username, password: this.password})
  }

  ionViewWillEnter(){
    this.pegouRelatos = false;
  }

  ionViewDidEnter(){
      setInterval(() => {
        if (!this.pegouRelatos) {
        this.fire.getAdvs().then(data => {

          for (const key of Object.keys(data)) {
            if (this.username === data[key].email) {
              this.nome = data[key].nome;
              this.estado = data[key].estado;
              this.cidade = data[key].cidade;
              this.oab = data[key].oab;
              this.telefone = data[key].telefone;
              this.cpf = data[key].cpf;
              this.cpfMask = this.utils.cpf;
            }

          }
        });

        if (this.nome != undefined) {
          //this.relatos = [];
          this.pegouRelatos = true;
          this.getRelatos();
        }
      }
    }, 100);
  }



  copyRelato(relato){
    return relato.substr(0, 35);
  }

  getRelatos(){
    this.cidadesNotificacao = [];
    this.relatos = [];
    this.fire.getCidadesNotificacao(this.nome).then(cidadeEstadoNotificacaoVar => {
    this.temRelato = false;
      for (const keyCidade of Object.keys(cidadeEstadoNotificacaoVar)) {

        this.fire.getRelatos().then(data => {
          for (const key of Object.keys(data)) {
            if (data[key].ativo == 'S') {
              if (cidadeEstadoNotificacaoVar[keyCidade].cidade === data[key].cidade+'-'+data[key].estado) {
                console.log(key);
                this.temRelato = true;
                this.relatos.push({nome: data[key].nome,
                                   data: data[key].data,
                                   telefone: data[key].telefone,
                                   email: data[key].email,
                                   cidade: data[key].cidade,
                                   estado: data[key].estado,
                                   relato: data[key].relato,
                                   hora: data[key].hora,
                                   minutos: data[key].minutos,
                                   segundos: data[key].segundos,
                                   ativo: data[key].ativo,
                                   mes : data[key].mes,
                                   dia : data[key].dia,
                                   ano : data[key].ano,
                                   ordenacao : data[key].ano+data[key].mes+data[key].dia+data[key].hora+data[key].minutos+data[key].segundos,
                                   quantidadeVisualizacoes: data[key].vezesVisualizados,
                                   chaveDoRelato: key
                                 });

                                 this.relatos.sort((a,b) => {
                                    return  b.ordenacao - a.ordenacao;
                                  });
              }
            }

          }
        });

      }

    })
  }



  goToRelatoDetail(event, relato, chaveDoRelato, quantidadeVisualizacoes){
    this.fire.setVisualizacaoRelato(chaveDoRelato, quantidadeVisualizacoes);
    this.navCtrl.push(RelatoDetail, {relato: relato});
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.getRelatos()
      refresher.complete();
    }, 3000);
  }

}
