import { Model, Lst, spinalCore } from 'spinal-core-connectorjs_type';
import { AppProfile } from "./AppProfile";

export class AppProfileLst extends Model {
  public apps: spinal.Lst<AppProfile>;

  constructor() {
    super();
    this.add_attr({
      apps: new Lst()
    })
  }
}

spinalCore.register_models(AppProfileLst);
