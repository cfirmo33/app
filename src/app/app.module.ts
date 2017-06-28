import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TextMaskModule } from 'angular2-text-mask';

import { Welcome, LoginAdv, NewAdv, DadosCliente, PerfilAdv, AreaAdv, Cidades, Relato, CidadesNotificacao, Estados, RelatoDetail, CustomAlert  } from '../pages/pages';
import { UtilsService, FirebaseService, OneSignal, SQLiteService, FacebookService } from '../providers/providers';

@NgModule({
  declarations: [
    MyApp, Welcome, LoginAdv, NewAdv, DadosCliente, PerfilAdv, AreaAdv, Cidades, Relato, CidadesNotificacao, Estados, RelatoDetail, CustomAlert
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    TextMaskModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, Welcome, LoginAdv, NewAdv, DadosCliente, PerfilAdv, AreaAdv, Cidades, Relato, CidadesNotificacao, Estados, RelatoDetail, CustomAlert
  ],
  providers: [
    UtilsService,
    FirebaseService,
    OneSignal,
    SQLiteService,
    FacebookService
  ]
})
export class AppModule {}
