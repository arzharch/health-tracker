import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TodoListScreen } from './src/screens/TodoListScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
        }}
      >
        {session && session.user ? (
          // Authenticated Stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TodoList" component={TodoListScreen} options={{ title: 'To-Do List' }} />
            <Stack.Screen name="Journal" component={JournalScreen} options={{ title: 'Journal' }} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Statistics' }} />
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
