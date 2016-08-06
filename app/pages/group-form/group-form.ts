import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Group} from '../../models/group';
import {GroupsProvider} from '../../providers/groups';
import {GroupForm} from '../../formObjects/group-form';

import {FormBuilder} from '@angular/common';

@Component({
  templateUrl: 'build/pages/group-form/group-form.html'
})
export class GroupFormPage {
  form: GroupForm;
  group: Group;

  constructor(private navCtrl: NavController,
                      navParams: NavParams,
                      private groupProvider: GroupsProvider,
                      builder: FormBuilder) {

    let selectedGroup = navParams.get('group');
    this.group = (selectedGroup === undefined) ? new Group(null, null, "") : selectedGroup;
    this.form = new GroupForm(this.group, builder);
  }

  saveGroup() {
    if (this.form.isValid()) {
      this.groupProvider.save(this.form.getObject()).then((data) => {
        this.navCtrl.pop();
      }, (error) => {
        console.log(error);
      });
    }
  }
}
