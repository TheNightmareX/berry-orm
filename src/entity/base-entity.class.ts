import { BerryOrm, PrimaryField, RelationField } from "..";
import { CommonFieldAccessor } from "../field/field-accessors/common-field.accessor";
import { PrimaryFieldAccessor } from "../field/field-accessors/primary-field.accessor";
import { RelationFieldToManyAccessor } from "../field/field-accessors/relation-field-to-many.accessor";
import { RelationFieldToOneAccessor } from "../field/field-accessors/relation-field-to-one.accessor";
import { CommonField } from "../field/field-names/common-field.type";
import { EntityField } from "../field/field-names/entity-field.type";
import { Collection } from "../field/field-values/collection.class";
import { EntityMeta } from "../meta/meta-objects/entity-meta.class";
import { META, POPULATED } from "../symbols";
import { AnyEntity } from "./any-entity.type";
import { EntityType } from "./entity-type.interface";

// It's not possible to use Active Record mode in Berry ORM because type
// circular reference will happen and cause compile error.

// It's also impossible to implement a `@Serializer()` decorator, because
// the serializer type should be accessible in other part of this lib to infer
// the data type properly, which is impossible in decorators.
// By the way, defining a static property `serializers` will not be implemented
// because this will make type inference much more difficult because the
// auto-inference supports only one level, and this will also make the style
// become messy because we used both static properties and decorators to define
// metadata for fields.

/**
 * The base class of every entity.
 *
 * It is recommended to create an own `BaseEntity`, which extends this one and
 * is defined getters so that the metadata can be accessed more conveniently.
 */
export abstract class BaseEntity<
  Entity extends AnyEntity<Entity, Primary>,
  Primary extends PrimaryField<Entity>,
> {
  private static init<
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(orm: BerryOrm, entity: Entity, primaryKey: Entity[Primary]) {
    for (const field of Object.keys(entity[META].fields))
      this.initField(orm, entity, field as EntityField<Entity>);
    entity[entity[META].primary] = primaryKey;
  }

  private static initField<
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(orm: BerryOrm, entity: Entity, field: EntityField<Entity>) {
    const isPrimaryField = entity[META].primary == field;
    const isCollectionField = !!entity[META].fields[field].relation?.multi;
    const isRelationEntityField =
      !!entity[META].fields[field].relation && !isCollectionField;

    const accessor = isPrimaryField
      ? new PrimaryFieldAccessor(orm, entity, field as Primary)
      : isCollectionField
      ? new RelationFieldToManyAccessor(
          orm,
          entity,
          field as RelationField<Entity>,
        )
      : isRelationEntityField
      ? new RelationFieldToOneAccessor(
          orm,
          entity,
          field as RelationField<Entity>,
        )
      : new CommonFieldAccessor(orm, entity, field as CommonField<Entity>);

    accessor.apply();

    if (isCollectionField)
      entity[field] = new Collection(
        orm,
        entity,
        field,
      ) as unknown as Entity[EntityField<Entity>];
  }

  /**
   * Definition metadata of this entity type.
   *
   * Potentially `undefined` because it only exists when there are at least one
   * decorator applied.
   */
  [META]: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [POPULATED] = false;

  constructor(...[orm, primaryKey]: ConstructorParameters<EntityType<Entity>>) {
    BaseEntity.init(orm, this as Entity, primaryKey);
  }
}
