import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from '../firebase/config';
import axios from 'axios';
import { api_url } from '../helper/Helper';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // console.log('🔄 Firebase user state changed:', firebaseUser.email);
          
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Sync user with MongoDB
          try {
            const response = await axios.post(`${api_url}/api/sync-firebase-user`, {
              firebaseUser: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
              },
              idToken: idToken
            });
            // console.log('✅ User synced successfully with MongoDB');
          } catch (syncError) {
            console.error('❌ Failed to sync user with MongoDB:', syncError);
            
            // Don't prevent login if sync fails - user can still use the app
            if (syncError.response?.status === 401) {
              console.log('⚠️ Firebase token verification failed on server - this may be due to missing service account credentials');
            } else if (syncError.response?.status === 503) {
              console.log('⚠️ Firebase authentication service not available on server');
            }
          }
          
          // Set user data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
          
          // Store token for API calls
          setToken(idToken);
          localStorage.setItem('token', idToken);
          
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
          
        } catch (error) {
          console.error('❌ Error getting user token:', error);
          
          // Still set user data even if token operations fail
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
        }
      } else {
        console.log('🔄 User signed out');
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    // Set token from localStorage if available
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      // console.log('🔄 Attempting login with email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful');
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      // console.log('🔄 Attempting signup with email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Signup successful');
      return result;
    } catch (error) {
      console.error('❌ Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Logging out user');
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = () => {
    try {
      console.log('🔄 Attempting Google login');
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    } catch (error) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}