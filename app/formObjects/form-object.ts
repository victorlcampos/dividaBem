import {FormBuilder, Control, ControlGroup, Validators} from '@angular/common';

export abstract class FormObject<T> {
  public controlGroup: ControlGroup;

  constructor(private resource: T, private builder: FormBuilder)  {
    this.controlGroup = builder.group(this.getValidations(this.resource));
  }

  protected abstract fillObject(resource: T);
  protected abstract getValidations(resource: T);

  public getObject() : T {
    this.fillObject(this.resource)
    return this.resource;
  }

  public isValid(): boolean {
    return this.controlGroup.valid;
  }
}
