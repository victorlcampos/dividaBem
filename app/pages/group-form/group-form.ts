import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Group} from '../../models/group';
import {GroupsProvider} from '../../providers/groups';

@Component({
  templateUrl: 'build/pages/group-form/group-form.html'
})
export class GroupFormPage {
  group: Group;

  constructor(private navCtrl: NavController, navParams: NavParams, private groupProvider: GroupsProvider) {
    let selectedGroup = navParams.get('group');
    this.group = (selectedGroup === undefined) ? { name: null } : selectedGroup;
  }

  saveGroup(event) {
    this.groupProvider.save(this.group).then((data) => {
      this.navCtrl.pop();
    }, (error) => {
      console.log(error);
    });
  }
}
