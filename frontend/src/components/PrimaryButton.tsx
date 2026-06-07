import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'solid' 
}) => {
  const isSolid = variant === 'solid';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSolid ? styles.solid : styles.outline,
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? colors.background : colors.primary} />
      ) : (
        <Text style={[
          styles.text,
          isSolid ? styles.textSolid : styles.textOutline
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textSolid: {
    color: colors.background,
  },
  textOutline: {
    color: colors.primary,
  },
});
