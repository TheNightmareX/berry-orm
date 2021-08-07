import { BaseEntity } from "./base-entity.class";
import { META } from "./symbols";
import { Type } from "./utils/type.type";

export class EntityMetaHelper {
  addField(prototype: BaseEntity, name: string, primary = false) {
    const meta = this.getMeta(prototype);
    meta.fields.items[name] = { name };
    if (primary) meta.fields.primary = name;
    return this;
  }

  inspect(prototype: BaseEntity) {
    const meta = this.getMeta(prototype);
    if (!meta.fields.primary)
      throw new Error(`The entity ${meta.type.name} must have a primary key`);
    if (!meta.fields.items[meta.fields.primary])
      throw new Error(
        `The field ${meta.fields.primary} of ${meta.type.name} must be firstly registered as a field before setting it as the primary key field`,
      );
    return this;
  }

  private getMeta(prototype: BaseEntity) {
    let meta = prototype[META];
    if (!meta)
      meta = prototype[META] = {
        type: prototype.constructor as Type<BaseEntity>,
        fields: { items: {}, primary: "" },
      };
    return meta;
  }
}
