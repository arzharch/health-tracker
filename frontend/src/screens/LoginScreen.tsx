import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { CustomInput } from '../components/CustomInput';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

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
          <View style={styles.iconContainer}>
            <Ionicons name="leaf" size={64} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Let's keep that streak alive 🔥</Text>
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
            variant="solid"
          />
          
          <PrimaryButton 
            title="Create an Account" 
            onPress={() => navigation.navigate('Signup')} 
            variant="secondary"
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
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: colors.primaryShadow,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    color: colors.secondary,
    textAlign: 'right',
    marginVertical: 16,
    fontWeight: 'bold',
  },
});
