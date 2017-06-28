import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {  AlertController, ToastController } from 'ionic-angular';


@Injectable()
export class FirebaseService {

  user: any = {};
  public baseUrl = 'https://jus-fc014.firebaseio.com/';

  constructor(public http: Http, private alert: AlertController, private toast: ToastController) {
    var config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "https://jus-fc014.firebaseio.com",
      storageBucket: "",
      messagingSenderId: ""
    };
    firebase.initializeApp(config);
  }

  login(email, senha, successCallback, errorCallback) {
    firebase.auth().signInWithEmailAndPassword(email, senha).then(response => {
      if (firebase.auth().currentUser.emailVerified.valueOf()) {
        successCallback(response.authResponse);
      } else {
        let toast = this.toast.create({
          message: 'Valide seu cadastro no email enviado',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    }, error => {
      errorCallback(error);
    })
  }

  rescuePassword(email, successCallback, errorCallback){
    firebase.auth().sendPasswordResetEmail(email).then(response => {
      successCallback(response)
    }, error =>{
      errorCallback(error);
    });
   };


  setUser(nome, oab, estado, cidade, telefone, email, senha, cpf, pushId, successCallback, errorCallback) {
    this.user.nome = nome;
    this.user.oab  = oab;
    this.user.estado = estado;
    this.user.cidade = cidade;
    this.user.telefone = telefone;
    this.user.email = email;
    this.user.senha = senha;
    this.user.cpf   = cpf;
    this.user.pushId = pushId;

    var date = new Date();
    var month = '';
    if (date.getMonth() === 0) {
        month = '01';
    } else if (date.getMonth() === 1) {
        month = '02';
    } else if (date.getMonth() === 2) {
        month = '03';
    } else if (date.getMonth() === 3) {
        month = '04';
    } else if (date.getMonth() === 4) {
        month = '05';
    } else if (date.getMonth() === 5) {
        month = '06';
    } else if (date.getMonth() === 6) {
        month = '07';
    } else if (date.getMonth() === 7) {
        month = '08';
    } else if (date.getMonth() === 8) {
        month = '09';
    } else if (date.getMonth() === 9) {
        month = '10';
    } else if (date.getMonth() === 10) {
        month = '11';
    } else if (date.getMonth() === 11) {
        month = '12';
    }
    this.user.date = date.getDate() + "/" + month + "/" + date.getFullYear();
    this.saveUser(response =>{
      successCallback(response);
    }, error => {
      errorCallback(error);
    });
  }

  private saveUser(successCallback, errorCallback) {

    firebase.database().ref('advogados').child(this.user.nome).set({
      cidade: this.user.cidade,
      email: this.user.email,
      estado: this.user.estado,
      nome: this.user.nome,
      oab: this.user.oab,
      pagante: 'N',
      senha: this.user.senha,
      telefone: this.user.telefone,
      cpf: this.user.cpf,
      pushId: this.user.pushId,
      bloqueado: 'N'
    });

    firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.senha).then(response => {
      firebase.auth().currentUser.sendEmailVerification().then(response => {

        let alert = this.alert.create({
          title: 'Verifique',
          subTitle: 'Enviamos um e-mail para '+ this.user.email +'. Ative seu cadastro',
          buttons: ['OK']
        });
        alert.present();

        successCallback(response);
      }, error =>{
        errorCallback(error);
      })
    }, error => {
      errorCallback(error);
    });

  }

  public updateAdv(nomeAntigo, nome, oab, telefone, cpf, estado, cidade){
    firebase.database().ref('advogados').child(nomeAntigo).update({
      cidade: cidade,
      estado: estado,
      nome: nome,
      oab: oab,
      telefone: telefone,
      cpf: cpf,
    });
  }

  public saveRelato(nome, telefone, email, estado, cidade, relato) {
    var date = new Date();
    var month = '';
    if (date.getMonth() === 0) {
        month = '01';
    } else if (date.getMonth() === 1) {
        month = '02';
    } else if (date.getMonth() === 2) {
        month = '03';
    } else if (date.getMonth() === 3) {
        month = '04';
    } else if (date.getMonth() === 4) {
        month = '05';
    } else if (date.getMonth() === 5) {
        month = '06';
    } else if (date.getMonth() === 6) {
        month = '07';
    } else if (date.getMonth() === 7) {
        month = '08';
    } else if (date.getMonth() === 8) {
        month = '09';
    } else if (date.getMonth() === 9) {
        month = '10';
    } else if (date.getMonth() === 10) {
        month = '11';
    } else if (date.getMonth() === 11) {
        month = '12';
    }
    this.user.date = date.getDate() + "/" + month + "/" + date.getFullYear();
    this.user.hour = date.getHours();
    this.user.minutes = date.getMinutes();
    this.user.seconds = date.getSeconds();

    firebase.database().ref('clientes').child(nome + ' - ' + date).set({
      nome: nome,
      cidade: cidade,
      email: email,
      telefone: telefone,
      data: this.user.date,
      hora: this.user.hour,
      minutos: this.user.minutes,
      segundos: this.user.seconds
    });

    firebase.database().ref('casos').child(nome + ' - ' + date).set({
      nome: nome,
      cidade: cidade,
      email: email,
      telefone: telefone,
      relato: relato,
      estado: estado,
      data: this.user.date,
      hora: this.user.hour,
      minutos: this.user.minutes,
      segundos: this.user.seconds,
      ativo: 'S',
      mes : month,
      dia : date.getDate(),
      ano : date.getFullYear(),
      vezesVisualizados: 0
    });
  }

  setVisualizacaoRelato(chave, quantidade){
    firebase.database().ref('casos').child(chave).update({
      vezesVisualizados: quantidade+1
    });
  }

  public clearCidadesNotificacao(nome) {
    firebase.database().ref('advogados').child(nome).child('cidadesNotificacao').remove();
  }

  public setCidadesNotificacao(nome, cidade, posicao) {
    firebase.database().ref('advogados').child(nome).child('cidadesNotificacao').child(posicao).set({
      cidade: cidade
    });
  }

  public getCidadesNotificacao(advogado){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/advogados/${advogado}/cidadesNotificacao.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

  public getEstados(){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/estados.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

  public getCidades(estado) {
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/estados/${estado}.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

  public getAdvs(){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/advogados.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

  public getAdv(id){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/advogados/${id}.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

  public getRelatos(){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/casos.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

  public getParametros(){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/parametros.json`)
            .subscribe(res => resolve(res.json()));
    });
  }

}
