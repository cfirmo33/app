import { Injectable } from '@angular/core';
import {Facebook} from 'ionic-native';

@Injectable()
export class FacebookService {

  static login(successCallback, errorCallback) {
		Facebook.login(['user_friends']).then(response => {
      successCallback(response.authResponse);
    }, error => {
      errorCallback(error);
    })
	}

}
