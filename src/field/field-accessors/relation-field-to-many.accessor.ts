import { AnyEntity } from "../../entity/any-entity.type";
import { RelationFieldToMany } from "../field-names/relation-field-to-many.type";
import { Collection } from "../field-values/collection.class";
import { BaseFieldAccessor } from "./base-field.accessor";
import { FieldAccessDeniedError } from "./field-access-denied.error";

export class RelationFieldToManyAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends RelationFieldToMany<Entity> = RelationFieldToMany<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  apply(): void {
    this.entity[this.field] = new Collection(
      this.orm,
      this.entity,
      this.field,
    ) as Entity[Field];
    super.apply();
  }

  handleSet(): void {
    throw new FieldAccessDeniedError(
      this.entity,
      this.field,
      "readonly",
      "Collection fields are readonly",
    );
  }
}
