import { createRealmContext } from '@realm/react';
import { TodoSchema } from './schemas';

export const RealmConfig = {
  schema: [TodoSchema],
  schemaVersion: 1,
};

export const { RealmProvider, useRealm, useQuery } =
  createRealmContext(RealmConfig);


