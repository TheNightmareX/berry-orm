import { BaseEntity } from "..";
import { EntityData } from "../entity-data.type";
import { EntityManager } from "../entity-manager.class";
import { FIELDS, PRIMARY } from "../symbols";

describe("EntityManager", () => {
  describe(".commit()", () => {
    describe("Primitives", () => {
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;
        field1!: string;
        field2!: Date;
      }
      TestingEntity.prototype[PRIMARY] = "id";
      TestingEntity.prototype[FIELDS] = {
        id: { name: "id" },
        field1: { name: "field1" },
        field2: { name: "field2" },
      };

      let data: EntityData<TestingEntity>;
      let entity: TestingEntity;

      beforeEach(() => {
        const em = new EntityManager({ entities: [TestingEntity] });
        data = { id: 1, field1: "", field2: new Date() };
        jest
          .spyOn(EntityManager.prototype, "retrieve")
          .mockImplementation(() => {
            const entity: TestingEntity = Object.create(
              TestingEntity.prototype,
            );
            entity.id = data.id;
            return entity;
          });

        entity = em.commit(TestingEntity, data);
      });

      it("should return an instance", () => {
        expect(entity).toBeInstanceOf(TestingEntity);
      });

      it("should assign the values to the instance", () => {
        for (const k in data) {
          const key = k as keyof typeof data;
          expect(entity[key]).toBe(data[key]);
        }
      });

      it("should call .retrieve() for only once", () => {
        expect(EntityManager.prototype.retrieve).toHaveBeenCalledTimes(1);
      });
    });

    describe("Relations", () => {
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;
        field1!: TestingEntity;
        field2!: TestingEntity[];
      }
      TestingEntity.prototype[PRIMARY] = "id";
      TestingEntity.prototype[FIELDS] = {
        id: { name: "id" },
        field1: {
          name: "field1",
          relation: { target: () => TestingEntity },
        },
        field2: {
          name: "field2",
          relation: { target: () => TestingEntity, multi: true },
        },
      };

      const mockRelationEntity = {};
      let data: EntityData<TestingEntity>;
      let entity: TestingEntity;

      beforeEach(() => {
        const em = new EntityManager({ entities: [TestingEntity] });
        data = { id: 1, field1: 1, field2: [1] };
        jest
          .spyOn(EntityManager.prototype, "retrieve")
          .mockImplementationOnce(() => {
            const entity: TestingEntity = Object.create(
              TestingEntity.prototype,
            );
            entity.id = data.id;
            return entity;
          })
          .mockReturnValue(mockRelationEntity);
        entity = em.commit(TestingEntity, data);
      });

      it("should make the entity field return the entity", () => {
        expect(entity.field1).toBe(mockRelationEntity);
      });

      it("should make the entities field return an array of entities", () => {
        expect(entity.field2).toBeInstanceOf(Array);
        expect(entity.field2[0]).toBe(mockRelationEntity);
      });
    });
  });
});