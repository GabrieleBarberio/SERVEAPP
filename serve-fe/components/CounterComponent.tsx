import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { increment, decrement, reset } from '../store/slices/counterSlice';

interface CounterComponentProps {
  title?: string;
  showReset?: boolean;
}

export default function CounterComponent({ 
  title = "Counter", 
  showReset = true 
}: CounterComponentProps) {
  const dispatch = useAppDispatch();
  const counter = useAppSelector(state => state.counter.value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.counterValue}>{counter}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => dispatch(decrement())}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => dispatch(increment())}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {showReset && (
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={() => dispatch(reset())}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  counterValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});