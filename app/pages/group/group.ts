import { Component } from '@angular/core';

import {NavController, NavParams, Alert} from 'ionic-angular';

import {Person} from '../../models/person';
import {Group} from '../../models/group';
import {Purchase} from '../../models/purchase';

import {PersonFormPage} from '../person-form/person-form';
import {PurchaseFormPage} from '../purchase-form/purchase-form';

import {PeopleProvider} from '../../providers/people';
import {PurchasesProvider} from '../../providers/purchases';


@Component({
  templateUrl: 'build/pages/group/group.html',
})
export class GroupPage {
  group: Group;
  people: Array<Person>;
  purchases: Array<Purchase>;

  constructor(private navCtrl: NavController, navParams: NavParams, public peopleProvider: PeopleProvider, public purchasesProvider: PurchasesProvider) {
    this.group = navParams.get('group');
    this.people = [];
    this.purchases = [];
  }

  private onPageDidEnter() {
    this.load();
  }

  private load() {
    this.peopleProvider.list(this.group).then((data: Array<Person>)  => {
      this.people = data;
    }, (error) => {
      console.log(error);
    });

    this.purchasesProvider.list(this.group).then((data: Array<Purchase>)  => {
      this.purchases = data;
    }, (error) => {
      console.log(error);
    });
  }

  addPerson(event) {
    this.navCtrl.push(PersonFormPage, {
      group: this.group
    });
  }

  editPerson(event, person: Person) {
    this.navCtrl.push(PersonFormPage, {
      person: person,
      group: this.group
    });
  }

  deletePerson(event, person: Person) {
    let confirm = Alert.create({
      title: 'Você deseja deletar o membro?',
      message: 'Ao concordar todo o histórico do membro será deletado',
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
            this.peopleProvider.delete(person).then(() => {
              this.people.splice(this.people.indexOf(person), 1);
            }, (error) => {
              console.log(error);
            });
          }
        }
      ]
    });

    this.navCtrl.present(confirm);
  }

  addPurchase(event) {
    this.navCtrl.push(PurchaseFormPage, {
      group: this.group,
      people: this.people
    });
  }

  editPurchase(event, purchase: Purchase) {
    this.navCtrl.push(PurchaseFormPage, {
      purchase: purchase,
      group: this.group,
      people: this.people
    });
  }

  totalSpend() {
    return this.people.reduce((acc, person) => {
      return acc + person.totalSpend(this.purchases);
    }, 0);
  }

  totalSpendBy(person:Person) {
    return person.totalSpend(this.purchases);
  }

  totalPaidBy(person: Person) {
    return person.totalPaid(this.purchases);
  }
}
