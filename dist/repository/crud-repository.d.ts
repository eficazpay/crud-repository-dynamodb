import * as AWSTypes from "aws-sdk";
import { Mapper } from "./mapper";
export declare abstract class CrudRepository<T extends {
    id: string;
}> {
    private entity;
    protected mapper: Mapper<T>;
    protected key: string;
    protected table: string;
    protected db: AWSTypes.DynamoDB.DocumentClient;
    constructor(entity: new () => T);
    findOneById(id: string): Promise<T>;
    update(Item: T): Promise<T>;
    insert(Item: T): Promise<T>;
    delete(Item: T): Promise<void>;
    findAll(): Promise<T[]>;
}
