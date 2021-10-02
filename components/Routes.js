
import React, { useState, useEffect,useContext } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from "../context/AuthProvider";
import Onboardi from "../screen/Onboarding";
import Login from "../screen/Login";
import Home from "../screen/Home";
import Addmembers from "../screen/Addmembers";
import AddNewSplit from "../screen/AddNewSplit";
import {DrawerContent} from "../screen/DrawerContent";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AppStack = createStackNavigator();

const Drawer = createDrawerNavigator();
export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
   

    const [isFirstLaunch, setIsFirstLaunch] = React.useState(null)
    
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
      }
    React.useEffect(() => {
       
      AsyncStorage.getItem('alreadyLaunched').then(value => {
        if (value == null) {
          AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      })
        
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; 
    }, [])
    if (initializing) return null;

    
    if (isFirstLaunch === null) {
        return null
    } else if (isFirstLaunch) {
        return (
       
            <NavigationContainer>
                <AppStack.Navigator headerMode="none">
            
                    <AppStack.Screen name="Onboarding" component={Onboardi} />
                    <AppStack.Screen name="Login" component={Login} />
                </AppStack.Navigator>
            </NavigationContainer>
        
        )
    } else {
        return (
        <>
           
                        <NavigationContainer>
                   
                        {
                user ?
                 
                <Drawer.Navigator initialRouteName="Home" drawerType="front" backBehavior="history" drawerStyle={{
                  
                  width: 240,
                  }}
                    drawerContent={props => <DrawerContent {...props}/>}>
                    <Drawer.Screen name="Home" component={Home} />
                    <Drawer.Screen name="Add" component={AddNewSplit} />
             
              </Drawer.Navigator>
               
                  :  <AppStack.Navigator headerMode="none">
                            
                  <AppStack.Screen name="Login" component={Login} />
    </AppStack.Navigator>
                        }
                       
                        </NavigationContainer>
                    
                
                </>
          
      )
    }
}

const styles = StyleSheet.create({})
