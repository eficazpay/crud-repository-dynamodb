import "reflect-metadata";
export declare const ColumnDB: (name: string, serializer?: Function, deserializer?: Function) => PropertyDecorator;
export declare function getColumn(target: any, property: string): any;
