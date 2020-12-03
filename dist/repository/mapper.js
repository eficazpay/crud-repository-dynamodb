"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapper = void 0;
const column_decorator_1 = require("./decorators/column-decorator");
class Mapper {
    fromItem(item, entity) {
        const result = new entity();
        for (const symbol of Reflect.getMetadataKeys(entity)) {
            if (symbol.toString() === `Symbol(columnDB)`) {
                const metadata = Reflect.getMetadata(symbol, entity);
                Object.keys(metadata)
                    .forEach((key) => {
                    const column = metadata[key];
                    const name = column.name;
                    const dsrl = column.deserializer;
                    const value = item[name];
                    result[key] = dsrl ? dsrl(value) : value;
                });
                return result;
            }
        }
    }
    toItem(entity) {
        const result = {};
        // tslint:disable-next-line: forin
        for (const property in entity) {
            const column = column_decorator_1.getColumn(entity, property);
            const value = entity[property];
            if (typeof column === "string") { // when item doesn't have decorators
                result[column] = value;
            }
            else {
                const name = column.name;
                const srlz = column.serializer;
                result[name] = srlz ? srlz(value) : value;
            }
        }
        return result;
    }
}
exports.Mapper = Mapper;
//# sourceMappingURL=mapper.js.map