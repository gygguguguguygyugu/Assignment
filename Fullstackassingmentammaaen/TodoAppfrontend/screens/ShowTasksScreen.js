import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import axios from 'axios';

const apiUrl = 'http://192.168.1.3:4001/api/tasks'; // Replace with your actual IP address

const ShowTasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl);
      console.log('Tasks fetched:', res.data);
      setTasks(res.data.data); // Adjusted based on the expected structure of the response
    } catch (err) {
      console.error('Get tasks error:', err);
      Alert.alert("Error", "Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const formatToLKR = (value) => {
    if (!value || isNaN(value)) return '';
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
      <Text style={styles.taskTitle}>{item.name}</Text>
      <Text>{formatToLKR(item.price)}</Text>
      <Text>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={tasks}
            keyExtractor={item => item._id.toString()}
            renderItem={renderTask}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No tasks available.</Text>}
            contentContainerStyle={styles.taskList}
          />
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskActions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between', // Ensure buttons are spaced out evenly
  },
  
  
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 10,
  },
  taskList: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShowTasksScreen;

/*The import statement you’ve provided is bringing in:

1. **`React`**: The core React library for building user interfaces.

2. **`useState`**: A React Hook for managing state in functional components.

3. **`useEffect`**: A React Hook for performing side effects in functional components, like fetching data or subscribing to events.

4. **`useCallback`**: A React Hook for memoizing functions to prevent unnecessary re-creations on every render.*/