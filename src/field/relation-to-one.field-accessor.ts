import { AnyEntity } from "..";
import { CommonFieldAccessor } from "./common.field-accessor";
import { RelationField } from "./relation-field.type";

export class RelationToOneFieldAccessor<
  Entity extends AnyEntity,
  Field extends RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    const currentValue = this.value;
    // end up recurse
    if (newValue == currentValue) return;

    this.value = newValue;
    if (newValue)
      this.relationManager.constructRelation(this.entity, this.field, newValue);
    else
      this.relationManager.destructRelation(
        this.entity,
        this.field,
        currentValue,
      );
  }
}
