import Realm, { BSON } from 'realm';

export class Task extends Realm.Object {
  _id;
  description;
  isComplete;
  createdAt;

  static primaryKey = '_id';

  static schema = {
    name: 'Task',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      description: 'string',
      createdAt: {
        type: 'date',
        default: new Date(),
      },
      isComplete: {
        type: 'bool',
        default: false,
        indexed: true,
      },
    },
  };
}


