import { BerryOrm } from "../../core/berry-orm.class";
import { AnyEntity } from "../../entity/any-entity.type";

export class Collection<Entity extends AnyEntity> extends Set<Entity> {
  constructor(
    readonly orm: BerryOrm,
    readonly owner: AnyEntity,
    readonly field: string,
  ) {
    super();
  }

  add(entity: Entity): this {
    // end up recursion
    if (!this.has(entity)) {
      super.add(entity);
      this.orm.erm.constructRelation(this.owner, this.field, entity);
    }
    return this;
  }

  delete(entity: Entity): boolean {
    // end up recursion
    if (this.has(entity)) {
      super.delete(entity);
      this.orm.erm.destructRelation(this.owner, this.field, entity);
      return true;
    }
    return false;
  }

  clear(): void {
    this.orm.erm.clearRelations(this.owner, this.field);
  }
}
