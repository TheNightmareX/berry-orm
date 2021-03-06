import { BaseEntity } from "../../entity/base-entity.class";
import { Entity } from "../../meta/meta-decorators/entity.decorator";
import { Field } from "../../meta/meta-decorators/field.decorator";
import { Primary } from "../../meta/meta-decorators/primary.decorator";
import { BerryOrm } from "../berry-orm.class";

describe("EntityEventManager", () => {
  @Entity()
  class TestingEntity extends BaseEntity<TestingEntity, "id"> {
    @Primary()
    @Field()
    id!: number;

    @Field()
    value!: string;
  }

  let orm: BerryOrm;
  let entity: TestingEntity;

  beforeEach(() => {
    orm = new BerryOrm({ entities: [TestingEntity] });
    entity = orm.map.get(TestingEntity, 1);
  });

  describe(".on()", () => {
    it("should invoke the resolve callback when the entity is resolved for the first time", () => {
      const spy = jest.fn();
      orm.eem.on(entity, "resolve", spy);
      expect(spy).not.toHaveBeenCalled();
      entity = orm.em.resolve(TestingEntity, { id: 1, value: "" });
      expect(spy).toHaveBeenCalledWith(entity);
    });

    it("should not invoke the update callback when the entity is resolved for the first time", () => {
      const spy = jest.fn();
      orm.eem.on(entity, "update", spy);
      entity = orm.em.resolve(TestingEntity, { id: 1, value: "" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("should not invoke the callback when a field of an unresolved entity is assigned a new value", () => {
      const spy = jest.fn();
      orm.eem.on(entity, "update", spy);
      entity.value = "new";
      expect(spy).not.toHaveBeenCalled();
    });

    it("should invoke the update callback when a field of a resolved entity is assigned a new value", () => {
      const spy = jest.fn();
      orm.eem.on(entity, "update", spy);
      entity = orm.em.resolve(TestingEntity, { id: 1, value: "" });
      entity.value = "new";
      expect(spy).toHaveBeenCalledWith(entity);
    });
  });

  describe(".off()", () => {
    it.each`
      index | exec
      ${1}  | ${(cb: any) => orm.eem.off(entity, "update", cb)}
      ${2}  | ${() => orm.eem.off(entity, "update")}
      ${3}  | ${() => orm.eem.off(entity)}
      ${4}  | ${() => orm.eem.off()}
    `("should not invoke the removed callback: $index", () => {
      const callback = jest.fn();
      orm.eem.on(entity, "update", callback);
      orm.eem.off(entity, "update", callback);
      orm.eem.emit(entity, "update");
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe(".emit()", () => {
    it("should work for all the callbacks", () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      const cb3 = jest.fn();
      orm.eem.on(entity, "update", cb1);
      orm.eem.on(TestingEntity, "update", cb2);
      orm.eem.on("any", "update", cb3);
      orm.eem.emit(entity, "update");
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);
      expect(cb3).toHaveBeenCalledTimes(1);
    });
  });
});
