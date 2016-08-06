import { Component } from '@angular/core';
import {NavController, NavParams, Alert} from 'ionic-angular';

import {Person} from '../../models/person';
import {Group}  from '../../models/group';
import {Purchase}  from '../../models/purchase';
import {PaymentItem}  from '../../embeds/payment-item';

import {PurchasesProvider} from '../../providers/purchases';
import {Utils} from '../../utils/utils';


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
          placeholder: 'Quantidade',
          value: '1'
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
            if (data.value === '' || data.value === undefined) {
              data.value = 0;
            }

            if (data.number === '' || data.number === undefined) {
              data.number = 1;
            }

            payment.paymentItems.push(new PaymentItem(data.name, parseFloat(data.value), parseInt(data.number)));
          }
        }
      ]
    });

    this.navCtrl.present(prompt);
  }

  editPaymentItem(event, item: PaymentItem) {
    let prompt = Alert.create({
      title: 'Item',
      message: "Adicione os dados do item que você deseja inserir",
      inputs: [
        {
          name: 'name',
          placeholder: 'Nome',
          value: item.name
        },
        {
          name: 'number',
          type: 'number',
          placeholder: 'Quantidade',
          value: item.number.toString()
        },
        {
          name: 'value',
          type: 'number',
          placeholder: 'Valor',
          value: item.value.toString()
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
            item.name = data.name;
            item.value = parseFloat(data.value);
            item.number = parseInt(data.number);
          }
        }
      ]
    });

    this.navCtrl.present(prompt);
  }

  deletePaymentItem(event, person: Person, item: PaymentItem) {
    let payment = this.purchase.paymentFor(person);
    payment.paymentItems.splice(payment.paymentItems.indexOf(item), 1);
  }

  savePurchase() {
    this.purchasesProvider.save(this.purchase).then((data) => {
      this.navCtrl.pop();
    }, (error) => {
      console.log(error);
    });
  }
}
