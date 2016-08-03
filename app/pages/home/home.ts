import {Component} from '@angular/core';

import {NavController, NavParams, Alert} from 'ionic-angular';

import {GroupFormPage} from '../group-form/group-form';
import {GroupPage} from '../group/group';

import {Group} from '../../models/group';

import {GroupsProvider} from '../../providers/groups';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  groups: Array<Group>;

  constructor(private navCtrl: NavController, navParams: NavParams, public groupProvider: GroupsProvider) {}

  private onPageDidEnter() {
    this.load();
  }

  private load() {
    this.groupProvider.list().then((data: Array<Group>)  => {
      this.groups = data;
    }, (error) => {
      console.log(error);
    });
  }

  showGroup(event, group) {
    this.navCtrl.push(GroupPage, {
      group: group
    });
  }

  addGroup(event) {
    this.navCtrl.push(GroupFormPage, {});
  }

  editGroup(event, group) {
    this.navCtrl.push(GroupFormPage, {
      group: group
    });
  }

  deleteGroup(event, group) {
    let confirm = Alert.create({
      title: 'Você deseja deletar o grupo?',
      message: 'Ao concordar todo o histórico do grupo será deletado',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.groupProvider.delete(group).then(() => {
              this.groups.splice(this.groups.indexOf(group), 1);
            }, (error) => {
              console.log(error);
            });
          }
        }
      ]
    });

    this.navCtrl.present(confirm);
  }
}
