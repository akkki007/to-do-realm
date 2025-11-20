import 'react-native-get-random-values';
import React from 'react';
import { Stack } from 'expo-router';
import { RealmProvider } from '../realm/realmContext';

const AppLayout = () => {
  return (
    <RealmProvider>
      <Stack />
    </RealmProvider>
  );
};

export default AppLayout;


