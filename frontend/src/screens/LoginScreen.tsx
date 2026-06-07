import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { CustomInput } from '../components/CustomInput';
import { colors } from '../theme/colors';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  async function signInWithEmail() {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.access_token);
    } catch (error: any) {
      Alert.alert('Sign in failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your habit journey</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Email"
            placeholder="email@example.com"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CustomInput
            label="Password"
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <Text style={styles.forgotPassword}>Forgot password?</Text>
          
          <PrimaryButton 
            title="Log In" 
            onPress={signInWithEmail} 
            loading={loading}
            disabled={!email || !password}
          />
          
          <PrimaryButton 
            title="Create an Account" 
            onPress={() => navigation.navigate('Signup')} 
            variant="outline"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    marginVertical: 16,
    fontWeight: '500',
  },
});
