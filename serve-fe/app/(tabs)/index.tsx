import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  increment, 
  decrement, 
  reset, 
  incrementByAmount 
} from '../../store/slices/counterSlice';

export default function HomeScreen() {

  const dispatch = useAppDispatch();
  const counter = useAppSelector(state => state.counter.value);
  const profile = useAppSelector(state => state.user.profile);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Redux + Expo Router App</Text>
        {/* User Section */}
        <View style={styles.section}>
          <View style={styles.userContainer}>
            {profile ? (
              <>
                <Text style={styles.userInfo}>Welcome, {profile.username}!</Text>
                <Text style={styles.userEmail}>{profile.email}</Text>
                <Text style={styles.username}>Username: {profile.username}</Text>
              </>
            ) : (
              <Text style={styles.errorText}>User not logged in</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={() => dispatch({ type: 'user/logout' })}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          </View>
        
        {/* Counter Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Counter: {counter}</Text>
          <View style={styles.buttonRow}>
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
            
            <TouchableOpacity 
              style={[styles.button, styles.specialButton]} 
              onPress={() => dispatch(incrementByAmount(5))}
            >
              <Text style={styles.buttonText}>+5</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={() => dispatch(reset())}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  specialButton: {
    backgroundColor: '#34C759',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  userContainer: {
    alignItems: 'center',
  },
  userInfo: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 15,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
});