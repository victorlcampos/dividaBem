import {FormBuilder, Control, ControlGroup, Validators} from '@angular/common';
import {PaymentItem} from '../embeds/payment-item';
import {FormObject} from './form-object';

export class PaymentItemForm extends FormObject<PaymentItem> {
  public controlGroup: ControlGroup;

  constructor(paymentItem: PaymentItem, builder: FormBuilder)  {
    super(paymentItem, builder);
  }

  protected getValidations(resource) {
    return {
      'name': new Control(resource.name, Validators.required),
      'number': new Control(resource.number, Validators.required),
      'value': new Control(resource.value, Validators.required),
      'person': new Control(resource.person_id, Validators.required)
    }
  }

  protected fillObject(resource: PaymentItem) {
    resource.name = this.controlGroup.controls['name'].value;
    resource.number = this.controlGroup.controls['number'].value;
    resource.value = this.controlGroup.controls['value'].value;
    resource.person_id = this.controlGroup.controls['person'].value;
  };
}
