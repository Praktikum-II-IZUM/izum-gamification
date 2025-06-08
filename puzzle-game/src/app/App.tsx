'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import Home from './page';

function App() {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <AuthProvider>
            <div className="app">
                <AuthContent
                    showSignUp={showSignUp}
                    setShowSignUp={setShowSignUp}
                />
            </div>
        </AuthProvider>
    );
}

function AuthContent({
    showSignUp,
    setShowSignUp
}: {
    showSignUp: boolean;
    setShowSignUp: (show: boolean) => void
}) {
    const { currentUser } = useAuth();

    if (currentUser) {
        return <Home />;
    }

    return showSignUp ? (
        <SignUp onSwitchToSignIn={() => setShowSignUp(false)} />
    ) : (
        <SignIn onSwitchToSignUp={() => setShowSignUp(true)} />
    );
}

export default App;