import { Model, spinalCore } from 'spinal-core-connectorjs_type';

export class AppProfile extends Model {
  public id: spinal.Val;
  public description: spinal.Str;

  constructor(id: number, description: string) {
    super();
    this.add_attr({
      id: id,
      description: description,
    })
  }
}


spinalCore.register_models(AppProfile);
