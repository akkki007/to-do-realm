export const TodoSchema = {
  name: 'Todo',
  properties: {
    _id: 'int',
    text: 'string',
    done: { type: 'bool', default: false },
    createdAt: 'date',
  },
  primaryKey: '_id',
};


