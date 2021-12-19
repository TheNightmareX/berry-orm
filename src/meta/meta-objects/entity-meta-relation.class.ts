import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { RelationField } from "../../field/field-names/relation-field.type";

export class EntityMetaRelation<
  TargetEntity extends AnyEntity<TargetEntity> = AnyEntity,
> {
  constructor(
    readonly target: () => EntityType<TargetEntity>,
    readonly inverse: RelationField<TargetEntity>,
    readonly multi = false,
  ) {}
}
