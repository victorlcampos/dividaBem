import {FormBuilder, Control, ControlGroup, Validators} from '@angular/common';
import {Person} from '../models/person';
import {FormObject} from './form-object';

export class PersonForm extends FormObject<Person> {
  public controlGroup: ControlGroup;

  constructor(private person: Person, builder: FormBuilder)  {
    super(person, builder);
  }

  protected getValidations(person) {
    return {
      'name': new Control(person.name, Validators.required)
    }
  }

  protected fillObject(resource: Person) {
    this.person.name = this.controlGroup.controls['name'].value
  };
}
