import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignUpProps {
  onSwitchToSignIn: () => void;
}

export default function SignUp({ onSwitchToSignIn }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Gesli se ne ujemata');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Prišlo je do neznane napake');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setCurrentUser(user);
    } catch (error) {
      // ne prikazi napake, ce je uporabnik zaprl pop-up okno
      const firebaseError = error as { code?: string; message: string };
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return;
      }
      setError(firebaseError.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        <div className="w-full max-w-md">
          <Card className="border-2 border-gray-700 bg-gray-800">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-100">Ustvarjanje računa</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full mb-6 bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="#EA4335" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
                Ustvari račun z Google računom
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">ali se registriraj z e-pošto</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    E-poštni naslov
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Geslo
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                    Potrdite geslo
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm mt-4"
                >
                  Ustvari račun
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-400">
                Že imate račun?{' '}
                <button 
                  onClick={onSwitchToSignIn}
                  className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Prijavite se
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}