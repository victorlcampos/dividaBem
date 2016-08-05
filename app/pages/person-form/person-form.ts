import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Person} from '../../models/person';
import {Group} from '../../models/group';

import {PeopleProvider} from '../../providers/people';
import {Utils} from '../../utils/utils';

/*
  Generated class for the PersonFormPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/person-form/person-form.html',
})
export class PersonFormPage {
  person: Person;
  group: Group;

  constructor(private navCtrl: NavController, navParams: NavParams, private personProvider: PeopleProvider) {
    this.group = navParams.get('group');

    let selectedGroup = navParams.get('person');
    this.person = Utils.deepCopy((selectedGroup === undefined) ? new Person(null, null, "", this.group._id) : selectedGroup);
  }

  savePerson(event) {
    this.personProvider.save(this.person).then((data) => {
      this.navCtrl.pop();
    }, (error) => {
      console.log(error);
    });
  }
}
