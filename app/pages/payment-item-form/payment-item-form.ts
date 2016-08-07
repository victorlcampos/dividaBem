import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Person} from '../../models/person';
import {Purchase}  from '../../models/purchase';
import {PaymentItem}  from '../../embeds/payment-item';
import {PaymentItemForm} from '../../formObjects/payment-item-form';

import {FormBuilder} from '@angular/common';
/*
  Generated class for the PaymentItemFormPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/payment-item-form/payment-item-form.html',
})
export class PaymentItemFormPage {
  purchase: Purchase;
  people: Array<Person>;
  paymentItem: PaymentItem;
  form: PaymentItemForm;
  oldPerson: Person;

  constructor(private navCtrl: NavController,
    navParams: NavParams,
    builder: FormBuilder) {

    this.purchase = navParams.get('purchase');
    this.people = navParams.get('people');
    this.oldPerson = navParams.get('person');

    let selectedPaymentItem = navParams.get('payment-item');

    this.paymentItem = (selectedPaymentItem === undefined) ? new PaymentItem("", 0, 1) : selectedPaymentItem;
    this.form = new PaymentItemForm(this.paymentItem, builder);
  }

  savePaymentItem() {
    if (this.form.isValid()) {
      let paymentItem = this.form.getObject();
      let payment     = this.purchase.paymentFor(paymentItem.person_id);

      if (this.oldPerson !== undefined) {
        let oldPayment = this.purchase.paymentFor(this.oldPerson._id);
        oldPayment.paymentItems.splice(oldPayment.paymentItems.indexOf(paymentItem), 1);
      }

      payment.paymentItems.push(paymentItem);

      this.navCtrl.pop();
    }
  }
}
