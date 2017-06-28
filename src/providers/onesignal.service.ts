declare var window: any;

export class OneSignal {
  static init() {
      window["plugins"].OneSignal
        .startInit("", "")
      	.handleNotificationOpened((jsonData) => {
          //
        })
        .endInit();
  }

  static getPushId(successCallback) {
    window.plugins.OneSignal.getIds(ids => {
      successCallback(ids.userId);
    });
  }

}
