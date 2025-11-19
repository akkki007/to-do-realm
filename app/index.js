import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BSON } from 'realm';
import { useQuery, useRealm } from '@realm/react';
import { Task } from './Task';

const HomeScreen = () => {
  const realm = useRealm();
  const taskResults = useQuery(Task);
  const [descriptionInput, setDescriptionInput] = useState('');

  const sortedTasks = useMemo(
    () => taskResults.sorted('createdAt', true),
    [taskResults],
  );

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

  const handleToggleStatus = (task) => {
    if (!task || !task.isValid()) {
      return;
    }

    realm.write(() => {
      task.isComplete = !task.isComplete;
    });
  };

  const handleDeleteTask = (task) => {
    if (!task || !task.isValid()) {
      return;
    }

    realm.write(() => {
      realm.delete(task);
    });
  };

  const renderTaskItem = ({ item }) => {
    const handleTogglePress = () => handleToggleStatus(item);
    const handleDeletePress = () => handleDeleteTask(item);

    const containerStyle = [
      styles.taskItem,
      item.isComplete && styles.taskItemCompletedBackground,
    ];

    const statusCircleStyle = [
      styles.statusCircle,
      item.isComplete && styles.statusCircleComplete,
    ];

    const taskTextStyle = [
      styles.taskText,
      item.isComplete && styles.taskTextCompleted,
    ];

    return (
      <View style={containerStyle}>
        <Pressable
          style={statusCircleStyle}
          onPress={handleTogglePress}
          accessibilityRole="button"
          accessibilityLabel={
            item.isComplete ? 'Mark task as incomplete' : 'Mark task as complete'
          }
        >
          <Text style={styles.statusIcon}>{item.isComplete ? '✓' : '○'}</Text>
        </Pressable>

        <View style={styles.taskTextContainer}>
          <Text style={taskTextStyle}>{item.description}</Text>
        </View>

        <Pressable
          onPress={handleDeletePress}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel="Delete task"
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Realm To‑Do</Text>
        <Text style={styles.subtitle}>Fast, offline, and clean UI.</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={descriptionInput}
          onChangeText={setDescriptionInput}
          placeholder="Add a new task..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        <Pressable
          onPress={handleAddTask}
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Add task"
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#E5E7EB',
    fontSize: 15,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#22C55E',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#052E16',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 24,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#030712',
    marginBottom: 8,
  },
  taskItemCompletedBackground: {
    backgroundColor: '#022C22',
  },
  statusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusCircleComplete: {
    borderColor: '#22C55E',
    backgroundColor: '#16A34A33',
  },
  statusIcon: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '700',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    color: '#F9FAFB',
    fontSize: 16,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F97373',
  },
  deleteText: {
    color: '#FEF2F2',
    fontSize: 12,
    fontWeight: '600',
  },
});
