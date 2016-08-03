import { Component } from '@angular/core';
import {NavController, NavParams, Alert} from 'ionic-angular';

import {Person} from '../../models/person';
import {Group}  from '../../models/group';
import {Purchase}  from '../../models/purchase';
import {PaymentItem}  from '../../models/payment-item';

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

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.group = navParams.get('group');
    this.people = navParams.get('people');

    let selectedPurchase = navParams.get('purchase');
    this.purchase = (selectedPurchase === undefined) ? new Purchase(null, "", this.group._id) : selectedPurchase;
  }

  addPaymentItem(event, person: Person) {
    let payment = this.purchase.paymentFor(person);

    let prompt = Alert.create({
      title: 'Item',
      message: "Adicione os dados do item que você deseja inserir",
      inputs: [
        {
          name: 'name',
          placeholder: 'Nome'
        },
        {
          name: 'number',
          type: 'number',
          placeholder: 'Quantidade'
        },
        {
          name: 'value',
          type: 'number',
          placeholder: 'Valor'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log(data);
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            payment.paymentItems.push(new PaymentItem(null, data.name, data.value, data.number, payment.id));
          }
        }
      ]
    });

    this.navCtrl.present(prompt);
  }
}
