### README.md

```markdown
## Realm To‑Do (Expo + React Native)

A simple offline‑first to‑do list app built with **Expo (SDK 54)**, **Expo Router**, and **MongoDB Realm** for persistent local storage.  
The app is designed to run in **development builds / production builds**, not the stock Expo Go, because Realm is a native module.

---

### Tech Stack

- **React Native** (via Expo)
- **Expo Router** for navigation
- **Realm** + **@realm/react** for local offline database
- **EAS Build** for dev client and production `.aab` / APK

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

> If you see peer‑dependency warnings, this project uses a root `.npmrc` with `legacy-peer-deps=true` so installs succeed locally and on EAS.

### 2. Configure dev client / native code

Realm requires native modules, so we use **prebuild + dev client**:

```bash
npx expo prebuild
```

- This generates the native `android` / `ios` folders and links the Realm SDK.

### 3. Development builds

#### Android (local USB / emulator)

```bash
npm run android
# then, once dev client is installed:
npx expo start
```

Open the app from the **custom dev client** that gets installed on the device.  
Do **not** use Expo Go, or Realm will fail to load.

#### iOS

On macOS you can use:

```bash
npm run ios
npx expo start
```

On Windows, use **EAS development builds** and install them on your iOS device.

---

## Realm Usage in This Project

### 1. Task model (`app/Task.js`)

We define a `Task` Realm object model with a UUID primary key, `description`, `isComplete` flag, and `createdAt` timestamp:

```js
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
```

Key points:

- `_id` is a Realm `uuid` and the **primary key**.
- `createdAt` and `isComplete` have defaults, so they’re automatically set when we create tasks.

---

### 2. RealmProvider + Expo Router layout (`app/_layout.js`)

We wrap the entire router stack in `RealmProvider`, passing our `Task` schema:

```js
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
```

This makes Realm hooks (`useRealm`, `useQuery`) available to all screens under `app/`.

---

### 3. Using Realm in the main screen (`app/index.js`)

We use the React bindings from `@realm/react` to read and write tasks.

#### Querying tasks

```js
import { useQuery, useRealm } from '@realm/react';
import { BSON } from 'realm';
import { Task } from './Task';

const realm = useRealm();
const taskResults = useQuery(Task);

const sortedTasks = useMemo(
  () => taskResults.sorted('createdAt', true), // newest first
  [taskResults],
);
```

- `useQuery(Task)` returns a live collection of all `Task` objects.
- `.sorted('createdAt', true)` sorts them descending by creation time.

#### Creating a task

```js
const handleAddTask = () => {
  const description = descriptionInput.trim();
  if (!description) {
    return;
  }

  realm.write(() => {
    realm.create(Task, {
      _id: new BSON.UUID(),
      description,
    });
  });

  setDescriptionInput('');
};
```

- We generate a new `BSON.UUID()` for each task to satisfy the primary key constraint.
- `realm.write()` wraps all write operations in a transaction.

#### Toggling completion

```js
const handleToggleStatus = (task) => {
  if (!task || !task.isValid()) {
    return;
  }

  realm.write(() => {
    task.isComplete = !task.isComplete;
  });
};
```

#### Deleting a task

```js
const handleDeleteTask = (task) => {
  if (!task || !task.isValid()) {
    return;
  }

  realm.write(() => {
    realm.delete(task);
  });
};
```

Because Realm collections are **live objects**, the UI updates automatically when tasks are added, toggled, or deleted.

---

## Building for Production

This project uses **EAS Build** (`eas.json` already configured).

### Android (AAB for Play Store)

```bash
eas build --platform android --profile production
```

Upload the generated `.aab` to **Google Play Console** (internal / closed / production track) to distribute the app without a dev server.

### Optional: APK profile

You can add an APK‑specific profile to `eas.json`:

```json
"production-apk": {
  "android": {
    "buildType": "apk"
  }
}
```

Then:

```bash
eas build --platform android --profile production-apk
```

to get an APK you can sideload directly.

---

## Notes

- Do **not** open this app in Expo Go when Realm is enabled; always use:
  - A **development build** (dev client), or
  - A **production build** (AAB/APK/IPA).
- Schema changes in Realm may require migrations; for this simple todo app the initial schema is enough.

```