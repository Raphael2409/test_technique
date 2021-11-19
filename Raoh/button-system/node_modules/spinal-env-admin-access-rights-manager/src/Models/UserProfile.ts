import { Model, Lst, spinalCore } from 'spinal-core-connectorjs_type';


export class UserProfile extends Model {
  public appProfiles: spinal.Lst<spinal.Val>;

  constructor(appProfiles: number[] = []) {
    super();

    this.add_attr({
      appProfiles: appProfiles
    })
  }
}

spinalCore.register_models(UserProfile);