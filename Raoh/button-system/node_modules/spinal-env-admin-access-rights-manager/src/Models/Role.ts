import { Model, spinalCore } from 'spinal-core-connectorjs_type';

export class Role extends Model {
  public id: spinal.Str;
  public name: spinal.Str;
  public description: spinal.Str;

  constructor(id: number, name: string, description: string) {
    super();
    this.add_attr({
      id: id,
      name: name,
      description: description
    })
  }

}

spinalCore.register_models(Role);