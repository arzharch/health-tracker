import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'danger' | 'secondary';
  style?: any;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'solid',
  style
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getBackgroundColor = () => {
    switch (variant) {
      case 'outline': return colors.background;
      case 'danger': return colors.error;
      case 'secondary': return colors.secondary;
      case 'solid':
      default: return colors.primary;
    }
  };

  const getShadowColor = () => {
    switch (variant) {
      case 'outline': return colors.border;
      case 'danger': return colors.errorShadow;
      case 'secondary': return colors.secondaryShadow;
      case 'solid':
      default: return colors.primaryShadow;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return colors.textSecondary;
    return '#FFFFFF';
  };

  return (
    <Pressable
      onPressIn={() => !disabled && !loading && setIsPressed(true)}
      onPressOut={() => !disabled && !loading && setIsPressed(false)}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container, 
        disabled && styles.disabled,
        style
      ]}
    >
      <View style={[
        styles.buttonBase,
        { backgroundColor: getShadowColor() },
        isPressed && styles.buttonBasePressed
      ]}>
        <View style={[
          styles.buttonTop,
          { backgroundColor: getBackgroundColor() },
          variant === 'outline' && { borderWidth: 2, borderColor: colors.border },
          isPressed ? styles.buttonTopPressed : styles.buttonTopUnpressed
        ]}>
          {loading ? (
            <ActivityIndicator color={getTextColor()} />
          ) : (
            <Text style={[styles.text, { color: getTextColor() }]}>
              {title}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonBase: {
    borderRadius: 16,
    width: '100%',
    paddingBottom: 4, // This creates the 3D shadow effect
  },
  buttonBasePressed: {
    paddingBottom: 0, // Compresses the shadow
    marginTop: 4, // Moves the whole button down slightly
  },
  buttonTop: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonTopUnpressed: {
    transform: [{ translateY: 0 }],
  },
  buttonTopPressed: {
    transform: [{ translateY: 0 }],
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
