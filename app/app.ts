import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar, SQLite} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {GroupsProvider} from "./providers/groups";
import {PeopleProvider} from "./providers/people";
import {PurchasesProvider} from "./providers/purchases";


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    GroupsProvider,
    PeopleProvider,
    PurchasesProvider
  ]
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
