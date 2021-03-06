import { CommonField } from "../../field/field-names/common-field.type";
import { PrimaryField } from "../../field/field-names/primary-field.type";
import { AbstractSerializer } from "../../serializer/abstract.serializer";
import { SerializerMap } from "../../serializer/serializer-map/serializer-map.type";
import { SerializerMapEmpty } from "../../serializer/serializer-map/serializer-map-empty.type";
import { SerializerType } from "../../serializer/serializer-type.interface";
import { AnyEntity } from "../any-entity.type";

export type EntityDataCommon<
  Entity extends AnyEntity,
  Serializers extends SerializerMap<Entity> = SerializerMapEmpty<Entity>,
> = {
  [Field in
    | CommonField<Entity>
    | PrimaryField<Entity>]: Serializers[Field] extends SerializerType<
    AbstractSerializer<Entity[Field], infer Alternative>
  >
    ? Entity[Field] | Alternative
    : Entity[Field];
};
