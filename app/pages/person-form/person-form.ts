import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Person} from '../../models/person';
import {Group} from '../../models/group';

import {PeopleProvider} from '../../providers/people';
import {Utils} from '../../utils/utils';
import {PersonForm} from '../../formObjects/person-form';

import {FormBuilder} from '@angular/common';
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
  form: PersonForm;

  constructor(private navCtrl: NavController,
              navParams: NavParams,
              private peopleProvider: PeopleProvider,
              builder: FormBuilder) {

    let group = navParams.get('group');
    let selectedGroup = navParams.get('person');
    this.person = Utils.deepCopy((selectedGroup === undefined) ? new Person(null, null, "", group._id) : selectedGroup);

    this.form = new PersonForm(this.person, builder);
  }

  savePerson(event) {
    if (this.form.isValid()) {
      this.peopleProvider.save(this.form.getObject()).then((data) => {
        this.navCtrl.pop();
      }, (error) => {
        console.log(error);
      });
    }
  }
}
