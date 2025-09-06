import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useContext(AuthContext);

  useEffect(() => {
    const loadLastEmail = async () => {
      const lastEmail = await AsyncStorage.getItem('lastUserEmail');
      if (lastEmail) {
        setEmail(lastEmail);
      }
    };
    loadLastEmail();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Error', 'Please enter both email and password.');
      return;
    }
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="email-outline" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>
              New to our app? <Text style={styles.linkTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
