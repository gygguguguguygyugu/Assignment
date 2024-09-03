import React from 'react';//Imports the React object from the react package.
import { createNativeStackNavigator } from '@react-navigation/native-stack';//This sets up a stack navigator for navigating screens.
import { NavigationContainer } from '@react-navigation/native';//this provides a container for navigation in React Native apps.
import LoginScreen from '../screens/LoginScreen'; // Adjust path as needed
import AddProductScreen from '../screens/AddProductScreen'; // Adjust path as needed
import ShowTasksScreen from '../screens/ShowTasksScreen'; // Adjust path as needed
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; // Adjust path as needed

const Stack = createNativeStackNavigator();//This creates a stack navigator for app navigationSets "Login" as the first screen in the stack navigator.

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} />
        <Stack.Screen name="ShowTasks" component={ShowTasksScreen} options={{ title: 'Tasks List' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;//Exports StackNavigator for use in other files or modules.









