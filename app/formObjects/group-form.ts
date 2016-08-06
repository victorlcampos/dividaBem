import {FormBuilder, Control, ControlGroup, Validators} from '@angular/common';
import {Group} from '../models/group';
import {FormObject} from './form-object';

export class GroupForm extends FormObject<Group> {
  public controlGroup: ControlGroup;

  constructor(private group: Group, builder: FormBuilder)  {
    super(group, builder);
  }

  protected getValidations(group) {
    return {
      'name': new Control(group.name, Validators.required)
    }
  }

  protected fillObject(resource: Group) {
    this.group.name = this.controlGroup.controls['name'].value
  };
}
