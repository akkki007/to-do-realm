import 'react-native-get-random-values';
import React from 'react';
import { Stack } from 'expo-router';
import { RealmProvider } from '@realm/react';
import { Task } from './Task';

const AppLayout = () => {
  return (
    <RealmProvider schema={[Task]}>
      <Stack />
    </RealmProvider>
  );
};

export default AppLayout;


