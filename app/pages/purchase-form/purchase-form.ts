import { Component } from '@angular/core';
import {NavController, NavParams, Alert, Modal} from 'ionic-angular';

import {Person} from '../../models/person';
import {Purchase}  from '../../models/purchase';
import {Group}  from '../../models/group';
import {PaymentItem}  from '../../embeds/payment-item';

import {PurchasesProvider} from '../../providers/purchases';
import {Utils} from '../../utils/utils';

import {PaymentItemFormPage} from '../payment-item-form/payment-item-form';

/*
  Generated class for the PurchaseFormPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/purchase-form/purchase-form.html',
})
export class PurchaseFormPage {
  group: Group;
  purchase: Purchase;

  people: Array<Person>;

  constructor(private navCtrl: NavController, navParams: NavParams, private purchasesProvider: PurchasesProvider) {
    this.group = navParams.get('group');
    this.people = navParams.get('people');

    let selectedPurchase = navParams.get('purchase');

    this.purchase = Utils.deepCopy((selectedPurchase === undefined) ? new Purchase(null, null, "", this.group._id) : selectedPurchase);
  }

  addPaymentItem(event) {
    this.navCtrl.present(Modal.create(PaymentItemFormPage, {
      purchase: this.purchase,
      people: this.people
    }));
  }

  editPaymentItem(event, person: Person, item: PaymentItem) {
    this.navCtrl.present(Modal.create(PaymentItemFormPage, {
      purchase: this.purchase,
      people: this.people,
      person: person,
      'payment-item': item
    }));
  }

  deletePaymentItem(event, person: Person, item: PaymentItem) {
    let payment = this.purchase.paymentFor(person._id);
    payment.paymentItems.splice(payment.paymentItems.indexOf(item), 1);
  }

  savePurchase() {
    this.purchasesProvider.save(this.purchase).then((data) => {
      this.navCtrl.pop();
    }, (error) => {
      console.log(error);
    });
  }

  payRight(event) {
    this.purchase.payments.forEach((payment) => {
      payment.value = payment.totalWithTip();
    });
  }

  payEquals(event) {
    let total = this.purchase.total();
    let numOfPeople = this.people.length;

    let paymentValue = Math.round((total/numOfPeople)*100)/100;

    this.purchase.payments.forEach((payment) => {
      payment.value = paymentValue;
    });
  }
}
