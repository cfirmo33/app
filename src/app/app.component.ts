import { Component, ViewChild } from '@angular/core';
import { Events, LoadingController, Nav, Platform, Alert } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Welcome, Cidades } from '../pages/pages';
import { OneSignal, SQLiteService, UtilsService } from '../providers/providers';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isOnline:boolean;

  constructor(
    public events: Events,
    public loadingController: LoadingController,
    public platform: Platform,
    public sqlite: SQLiteService,
    public utils: UtilsService) {
    this.initializeApp();
    this.isOnline = this.utils.checkNetwork();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.isOnline) {
        this.sqlite.initStorage().then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          StatusBar.styleDefault();
          this.hideSplashScreen();
          OneSignal.init();
          this.rootPage = Welcome;
        });
      } else {
        //this.platform.ready().then(() => {
          this.utils.toastMessage('Sem conexão com internet.', 3000);
          StatusBar.styleDefault();
          this.hideSplashScreen();
        //});
      }

    });
  }

  goApp(){
    this.isOnline = this.utils.checkNetwork();
    if (this.isOnline) {
      this.sqlite.initStorage().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        OneSignal.init();
        this.rootPage = Welcome;
      });
    }  else {
      this.utils.toastMessage('Sem conexão com internet.', 3000);
    }
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
      }
  }


}
