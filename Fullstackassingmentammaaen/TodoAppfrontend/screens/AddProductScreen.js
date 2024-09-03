import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';// A promise-based HTTP client for making network requests in JavaScript.
import * as ImagePicker from 'expo-image-picker';//Module for selecting images or videos from the device's library in React Native.

const apiUrl = 'http://192.168.1.3:4001/api/tasks';// Variable holding the base URL for API requests related to tasks.

const AddProductScreen = ({ navigation, route }) => {
  const { taskId } = route.params || {};
  const [currentTask, setCurrentTask] = useState({ name: '', price: '', quantity: '', imageUri: '' });
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);//Managing List of Products or Tasks
  const [isFetching, setIsFetching] = useState(false);//isFetching tracks loading state; setIsFetching updates it.
  const isEditing = !!taskId;// Determines if the component is in "editing" mode
//When the screen loads or taskId or isEditing changes, it fetches the task details if we're editing, and always gets the list of tasks.
  useEffect(() => {
    if (isEditing && taskId) {
      fetchTask();
    }
    getTasks();
  }, [taskId, isEditing]);

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl);
      setTasks(res.data.data);
    } catch (err) {
      console.error('Get tasks error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
//A function that gets task details from the server using `taskId`.
// It updates the state with the task data or shows an error if something goes wrong.
  const fetchTask = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${apiUrl}/${taskId}`);
      const task = response.data.data;
      setCurrentTask({
        name: task.name || '',
        price: task.price !== undefined ? task.price.toString() : '',
        quantity: task.quantity !== undefined ? task.quantity.toString() : '1',
        imageUri: task.image || '',
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load task details.");
      console.error("Fetch task error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const formatToLKR = (value) => {
    if (!value || isNaN(value)) return '';
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
  };

  const handleSubmit = async () => {
    const { name, price, quantity, imageUri } = currentTask;

    if (name.trim() === '' || price.trim() === '' || quantity.trim() === '') {
      Alert.alert("Error", "Name, price, and quantity cannot be empty.");
      return;
    }

    if (!imageUri) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        price: Number(price.replace(/[^0-9.-]+/g, "")),//This line converts the `price` string to a number, removing non-numeric characters.
        quantity: Number(quantity),
        image: imageUri,
      };

      if (isEditing) {
        await axios.patch(`${apiUrl}/${taskId}`, payload);
        Alert.alert("Success", "Product updated successfully!");
      } else {
        await axios.post(apiUrl, payload);
        Alert.alert("Success", "Product added successfully!");
      }

      // Clear the input fields
      setCurrentTask({ name: '', price: '', quantity: '', imageUri: '' });
      getTasks();
      navigation.navigate('ShowTasks');
    } catch (error) {
      Alert.alert("Error", "Network error occurred.");
      console.error("Product error:", error.response || error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          setLoading(true);
          try {
            await axios.delete(`${apiUrl}/${id}`);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
            Alert.alert("Success", "Task deleted successfully!");
          } catch (error) {
            Alert.alert("Error", "Network error occurred.");
            console.error("Delete task error:", error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const chooseImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,  //This code opens the image library to pick an image, allowing full resolution.
        allowsEditing: false,
        quality: 1,
      });
//This code checks if an image was selected; if so, it updates the task with the image URI. If not, it shows an alert. If an error occurs, it displays an error message.
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCurrentTask({ ...currentTask, imageUri: result.assets[0].uri });
      } else {
        Alert.alert('No image selected', 'Please select an image to proceed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while selecting the image.');
      console.error('ImagePicker error:', error);
    }
  };
//renderTask is a function that defines how each item in the list should be displayed.
  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.taskTitle}>{item.name}</Text>
      <Text>{formatToLKR(item.price)}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text></Text>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct', { taskId: item._id })} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isEditing && isFetching) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTask}
      keyExtractor={item => item._id}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
          <TextInput
            value={currentTask.name}
            onChangeText={name => setCurrentTask({ ...currentTask, name })}
            placeholder="Product Name"
            style={styles.input}
          />
          <TextInput
            value={currentTask.price}
            onChangeText={price => setCurrentTask({ ...currentTask, price })}
            placeholder="Product Price"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            value={currentTask.quantity}
            onChangeText={quantity => setCurrentTask({ ...currentTask, quantity })}
            placeholder="Product Quantity"
            keyboardType="numeric"
            style={styles.input}
          />
           <Text></Text>
          <TouchableOpacity onPress={chooseImage} style={styles.imageButton}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          <Text></Text>

          {currentTask.imageUri ? <Image source={{ uri: currentTask.imageUri }} style={styles.image} /> : null}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.buttonText}>{isEditing ? 'Update Product' : 'Add Product'}</Text>
          </TouchableOpacity>
          <Text></Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => navigation.navigate('ShowTasks')} style={styles.viewProductsButton}>
              <Text style={styles.buttonText}>View Products</Text>
            </TouchableOpacity>
          )}
        </View>
      }
      ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: { padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  imageButton: { backgroundColor: '#007bff', padding: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  image: { width: '100%', height: 300, resizeMode: 'contain', borderRadius: 10, marginTop: 10 },
  submitButton: { backgroundColor: '#28a745', padding: 10, alignItems: 'center' },
  taskContainer: { padding: 16, borderBottomWidth: 1, borderColor: '#ddd' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  taskActions: { flexDirection: 'row', justifyContent: 'space-between' },
  viewProductsButton: { backgroundColor: '#6f42c1', padding: 10, alignItems: 'center', marginTop: 10 },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 5,
  },
});

export default AddProductScreen;

//It makes asynchronous code easier to read and write, resembling synchronous code
//It is often used in a finally block to ensure that the fetching status is updated regardless of 
//whether the operation succeeded or failed.


/*The `formatToLKR` function formats a numeric value as Sri Lankan Rupee currency. Here's a breakdown:

1. **Checks if `value` is valid**:
   - `!value` checks if the value is `null`, `undefined`, or an empty string.
   - `isNaN(value)` checks if the value is not a number.

2. **Returns an empty string if the value is invalid**.

3. **Formats the value as LKR currency**:
   - Uses `Intl.NumberFormat` to format the number according to Sri Lankan Rupee currency style.*/




/*- `setLoading(true);` starts a loading state to show progress.
- `try { ... }` runs code that might fail.
- `const payload = { ... };` prepares data to be sent, converting and cleaning values.
`payload` is data to be sent or processed by an API.*/ 
/*This code snippet defines a function to render each task in the list. It includes:

- **`<View>`**: Container for the task details.
- **`<Image>`**: Displays the task's image.
- **`<Text>`**: Shows the task's name, price (formatted to LKR), and quantity.
- **`<TouchableOpacity>`**: Buttons for editing and deleting the task, with actions linked to `navigation` and `handleDelete` functions.

This function is used with a `FlatList` to display a list of tasks, making each task clickable and providing options to edit or delete. */


/*In this context, item refers to an individual object from the array of tasks that you are displaying with FlatList.

item is a variable name used in the renderTask function.
Each item represents one task from the tasks array.
It contains the properties of a task, like name, price, quantity, and image.
In summary, item is a placeholder name for each task object in the list you are rendering. */
/*The line if (isEditing && isFetching) checks two conditions:

isEditing: A boolean that indicates whether you are currently editing an item.
isFetching: A boolean that indicates whether data is currently being fetched. */


/*renderItem={renderTask}: This tells FlatList how to render each item in the list. renderTask is a function you’ve defined that takes an item from the tasks array and returns a component to display it.

keyExtractor={item => item._id}: This function provides a unique key for each item in the list. FlatList uses these keys to optimize rendering. The keyExtractor function 
extracts the unique identifier (_id) from each item, which is used as the key for that item.*/

/*import React: Brings in the React library for building user interfaces.

useState: Hook for managing state in functional components.Fetching data from an API

useEffect: Hook for handling side effects (e.g., fetching data) in components.

useCallback: Hook for optimizing performance by memoizing functions.*/