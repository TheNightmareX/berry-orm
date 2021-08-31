import { CommonField } from "../field/common-field.type";
import { AbstractSerializer } from "../serializer/abstract.serializer";
import { SerializerMapEmpty } from "../serializer/serializer-map-empty.type";
import { SerializerMap } from "../serializer/serializer-map.type";
import { SerializerType } from "../serializer/serializer-type.type";
import { AnyEntity } from "./any-entity.type";

export type EntityDataCommon<
  Entity extends AnyEntity,
  Serializers extends SerializerMap<Entity> = SerializerMapEmpty<Entity>,
> = {
  [Field in CommonField<Entity>]: Serializers[Field] extends SerializerType<
    AbstractSerializer<Entity[Field], infer Alternative>
  >
    ? Entity[Field] | Alternative
    : Entity[Field];
};
