import { AWS } from "../shared/aws-sdk-wrapped";
import * as AWSTypes from "aws-sdk";
import * as uuid from "uuid/v4";
import { getKey } from "./decorators/key-decorator";
import { getTable } from "./decorators/table-decorator";
import { Mapper } from "./mapper";

function configure() {
  const { REGION, DYNAMO_ENDPOINT } = process.env;
  return {
    endpoint: DYNAMO_ENDPOINT,
    region: REGION,
  };
}

function getTableSuffix(): string {
  const { ENV, ENV_REPOSITORY } = process.env;
  if (ENV_REPOSITORY && (ENV_REPOSITORY === "true") && ENV) {
    return "-" + ENV;
  }
  return "";
}

export abstract class CrudRepository<T extends { id: string }> {

  protected mapper: Mapper<T>;
  protected key: string;
  protected table: string;
  protected db: AWSTypes.DynamoDB.DocumentClient;

  constructor(
    private entity: new () => T,
  ) {
    const sample = new entity();
    this.mapper = new Mapper<T>();
    this.key = getKey(sample);
    this.table = `${getTable(sample)}${getTableSuffix()}`;
    this.db = new AWS.DynamoDB.DocumentClient(configure());
  }

  public async findOneById(id: string): Promise<T> {
    const Key = {};
    Key[this.key] = id;

    try {
      const request = await this.db.get({
        Key,
        TableName: this.table,
      }).promise();

      if (!request.Item) {
        process.stdout.write(`db:get(${this.table}) => id=${id} - Item não encontrado\n`);
        return null;
      }

      return this.mapper.fromItem(request.Item, this.entity);
    } catch (err) {
      process.stderr.write(`db:get(${this.table}) => id=${id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
      throw err;
    }
  }

  public async update(Item: T): Promise<T> {
    if (!Item || !Item.id) {
      process.stderr.write(`db:update(${this.table}) => Item ou id nulo\n`);
      return null;
    }

    try {
      await this.db.put({
        Item: this.mapper.toItem(Item),
        TableName: this.table,
      }).promise();

      process.stdout.write(`db:update(${this.table}) => id=${Item.id} - OK\n`);
      return Item;
    } catch (err) {
      process.stderr.write(`db:update(${this.table}) => id=${Item.id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
      throw err;
    }
  }

  public async insert(Item: T): Promise<T> {
    if (!Item.id) {
      Item.id = uuid();
    }
    try {
      await this.db.put({
        Item: this.mapper.toItem(Item),
        TableName: this.table,
      }).promise();

      process.stdout.write(`db:insert(${this.table}) => id=${Item.id} - OK\n`);
      return Item;
    } catch (err) {
      process.stderr.write(`db:insert(${this.table}) => id=${Item.id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
      throw err;
    }
  }

  public async delete(Item: T): Promise<void> {
    if (!Item || !Item.id) {
      process.stderr.write(`db:delete(${this.table}) => Item ou id nulo\n`);
      return null;
    }

    const Key = {};
    Key[this.key] = Item.id;

    try {
      await this.db.delete({
        Key,
        TableName: this.table,
      }).promise();

      process.stdout.write(`db:delete(${this.table}) => id=${Item.id} - OK\n`);
      // return ????
    } catch (err) {
      process.stderr.write(`db:delete(${this.table}) => id=${Item.id} - Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
      throw err;
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const request = await this.db.scan({
        TableName: this.table,
      }).promise();

      const resultCount: number = request.Count;
      const scannedCount: number = request.ScannedCount;
      const capacityUsed: number = request.ConsumedCapacity?.ReadCapacityUnits;
      const message = `retornou ${resultCount} item(s) de ${scannedCount} escaneado(s), e consumiu ${capacityUsed} capacity unit(s)`;
      process.stdout.write(`db:scan(${this.table}) => ${message}\n`);
      if (request.LastEvaluatedKey) {
        process.stdout.write(`db:scan(${this.table}) => retornou mais de 1 página de resultados\n`);
      }

      return request.Count
        ? request.Items.map((Item) => this.mapper.fromItem(Item, this.entity))
        : [];
    } catch (err) {
      process.stderr.write(`db:scan(${this.table}) => Erro DynamoDB: ${JSON.stringify(err, null, 2)}\n`);
      throw err;
    }
  }

}
