import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite } from 'ionic-native';


const win: any = window;

@Injectable()
export class SQLiteService {

  public db: SQLite;
  adv: any = [];

  initStorage(){
    this.db = new SQLite();
    return this.db.openDatabase({ name: '99JUS.db', location: 'default' }).then((db) => {

      return this.db.executeSql('CREATE TABLE IF NOT EXISTS TBADV (ID integer primary key AUTOINCREMENT, '+
                                                                             ' EMAIL text, '+
                                                                             ' SENHA text)', []).then(data => {
      });
    });
  }

  getAdvSQlite(key){
    return this.db.openDatabase({name: "99JUS.db", location: "default"}).then(() => {
      return this.db.executeSql("SELECT ID, EMAIL, SENHA FROM TBADV", []).then((data) => {
          if(data.rows.length > 0) {
              if (key === 'ID') {
                return data.rows.item(0).ID;
              } else if (key === 'EMAIL') {
                return data.rows.item(0).EMAIL;
              } else if (key === 'SENHA') {
                return data.rows.item(0).SENHA;
              }
          } else {
            //
          }
      }, (error) => {
          //
      });
    }, (error) => {
        //
    });
  }

  setAdvSQLite(email, senha) {
    this.db = new SQLite();
    this.db.openDatabase({name: "99JUS.db", location: "default"}).then(() => {
      this.db.executeSql('INSERT INTO TBADV (EMAIL, SENHA) '+
                           ' VALUES (?, ?)',
                        [email, senha])
              .then(data => {
                  //
              }, (error) => {
                  //
              });
      }, (error) => {
          //
    });

  };
}
