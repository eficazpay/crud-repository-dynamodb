"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudRepository = void 0;
const aws_sdk_wrapped_1 = require("../shared/aws-sdk-wrapped");
const uuid = require("uuid/v4");
const key_decorator_1 = require("./decorators/key-decorator");
const table_decorator_1 = require("./decorators/table-decorator");
const mapper_1 = require("./mapper");
function configure() {
    const { REGION, DYNAMO_ENDPOINT } = process.env;
    return {
        endpoint: DYNAMO_ENDPOINT,
        region: REGION,
    };
}
function getTableSuffix() {
    const { ENV, ENV_REPOSITORY } = process.env;
    if (ENV_REPOSITORY && (ENV_REPOSITORY === "true") && ENV) {
        return "-" + ENV;
    }
    return "";
}
class CrudRepository {
    constructor(entity) {
        this.entity = entity;
        const sample = new entity();
        this.mapper = new mapper_1.Mapper();
        this.key = key_decorator_1.getKey(sample);
        this.table = `${table_decorator_1.getTable(sample)}${getTableSuffix()}`;
        this.db = new aws_sdk_wrapped_1.AWS.DynamoDB.DocumentClient(configure());
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const Key = {};
            Key[this.key] = id;
            try {
                const request = yield this.db.get({
                    Key,
                    TableName: this.table,
                }).promise();
                if (!request.Item) {
                    process.stdout.write(`db:get(${this.table}) => id=${id} - Item não encontrado\n`);
                    return null;
                }
                return this.mapper.fromItem(request.Item, this.entity);
            }
            catch (err) {
                process.stderr.write(`db:get(${this.table}) => id=${id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
                throw err;
            }
        });
    }
    update(Item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Item || !Item.id) {
                process.stderr.write(`db:update(${this.table}) => Item ou id nulo\n`);
                return null;
            }
            try {
                yield this.db.put({
                    Item: this.mapper.toItem(Item),
                    TableName: this.table,
                }).promise();
                process.stdout.write(`db:update(${this.table}) => id=${Item.id} - OK\n`);
                return Item;
            }
            catch (err) {
                process.stderr.write(`db:update(${this.table}) => id=${Item.id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
                throw err;
            }
        });
    }
    insert(Item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Item.id) {
                Item.id = uuid();
            }
            try {
                yield this.db.put({
                    Item: this.mapper.toItem(Item),
                    TableName: this.table,
                }).promise();
                process.stdout.write(`db:insert(${this.table}) => id=${Item.id} - OK\n`);
                return Item;
            }
            catch (err) {
                process.stderr.write(`db:insert(${this.table}) => id=${Item.id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
                throw err;
            }
        });
    }
    delete(Item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Item || !Item.id) {
                process.stderr.write(`db:delete(${this.table}) => Item ou id nulo\n`);
                return null;
            }
            const Key = {};
            Key[this.key] = Item.id;
            try {
                yield this.db.delete({
                    Key,
                    TableName: this.table,
                }).promise();
                process.stdout.write(`db:delete(${this.table}) => id=${Item.id} - OK\n`);
                // return ????
            }
            catch (err) {
                process.stderr.write(`db:delete(${this.table}) => id=${Item.id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
                throw err;
            }
        });
    }
    findAll() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield this.db.scan({
                    TableName: this.table,
                }).promise();
                const resultCount = request.Count;
                const scannedCount = request.ScannedCount;
                const capacityUsed = (_a = request.ConsumedCapacity) === null || _a === void 0 ? void 0 : _a.ReadCapacityUnits;
                const message = `retornou ${resultCount} item(s) de ${scannedCount} escaneado(s), e consumiu ${capacityUsed} capacity unit(s)`;
                process.stdout.write(`db:scan(${this.table}) => ${message}\n`);
                if (request.LastEvaluatedKey) {
                    process.stdout.write(`db:scan(${this.table}) => retornou mais de 1 página de resultados\n`);
                }
                return request.Count
                    ? request.Items.map((Item) => this.mapper.fromItem(Item, this.entity))
                    : [];
            }
            catch (err) {
                process.stderr.write(`db:scan(${this.table}) => Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
                throw err;
            }
        });
    }
}
exports.CrudRepository = CrudRepository;
//# sourceMappingURL=crud-repository.js.map