import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../lib/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { setToken, setUser } = useAuth();

  const handleAuth = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload: any = { email, password };
      if (!isLogin) {
        payload.full_name = email.split('@')[0];
      }

      const response = await fetch(`http://192.168.0.139:8001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        setUser(data.user);
        setToken(data.access_token);
      } else {
        Alert.alert('Error', data.detail || 'Authentication failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Make sure your backend is running.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <LinearGradient
              colors={['#1F8EFA', '#00C896']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.logoCircle}
            >
              <Ionicons name="heart" size={32} color={colors.surface} />
            </LinearGradient>
            <Text style={styles.appTitle}>Self Care Tracker</Text>
            <Text style={styles.appSubtitle}>Build healthy habits, stay productive</Text>
          </View>

          <View style={styles.authCard}>
            
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => setIsLogin(true)}
                activeOpacity={0.8}
              >
                {isLogin ? (
                  <LinearGradient
                    colors={['#1F8EFA', '#00C896']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.toggleActiveBg}
                  >
                    <Text style={styles.toggleTextActive}>Login</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.toggleTextInactive}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => setIsLogin(false)}
                activeOpacity={0.8}
              >
                {!isLogin ? (
                  <LinearGradient
                    colors={['#1F8EFA', '#00C896']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.toggleActiveBg}
                  >
                    <Text style={styles.toggleTextActive}>Sign Up</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.toggleTextInactive}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleAuth} activeOpacity={0.8}>
              <LinearGradient
                colors={['#1F8EFA', '#00C896']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.surface} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerLinkContainer}>
              <Text style={styles.footerText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.footerLinkText}>{isLogin ? 'Sign up' : 'Login'}</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Bottom Features Row */}
          <View style={styles.featuresRow}>
            <View style={styles.featureCard}>
              <Ionicons name="checkbox" size={24} color="#00C896" />
              <Text style={styles.featureText}>Track Habits</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="document-text" size={24} color="#FF6B6B" />
              <Text style={styles.featureText}>Manage Tasks</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="bar-chart" size={24} color="#1F8EFA" />
              <Text style={styles.featureText}>View Stats</Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B4D8',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  authCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
  },
  toggleActiveBg: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextActive: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleTextInactive: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: colors.surface,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F8EFA',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});
