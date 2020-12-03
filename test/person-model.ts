import { ColumnDB } from "../src/repository/decorators/column-decorator";
import { KeyDB } from "../src/repository/decorators/key-decorator";
import { TableDB } from "../src/repository/decorators/table-decorator";

@TableDB('person')
export class Person {
  @KeyDB()
  @ColumnDB('cd_id')
  id: string;

  @ColumnDB('ds_name')
  name: string;

  @ColumnDB('dt_birthday')
  birthday: string;

  @ColumnDB('bo_active',
    (data) => data ? 'S' : 'N',
    (data) => !!(data && data.toUpperCase() === 'S')
  )
  active: boolean;
}