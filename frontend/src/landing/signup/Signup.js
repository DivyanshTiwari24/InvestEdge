import React, { useState } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL;

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? `${backendUrl}/login` : `${backendUrl}/signup`;
        
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token);
                    window.location.href = `${dashboardUrl}?token=${data.token}`; // Redirect to dashboard
                } else {
                    alert('Signup successful! Please login.');
                    setIsLogin(true);
                }
            } else {
                alert(data.error || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>{isLogin ? 'Login' : 'Signup'}</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ margin: '10px', padding: '10px' }} />
                <br />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ margin: '10px', padding: '10px' }} />
                <br />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#387ed1', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {isLogin ? 'Login' : 'Signup'}
                </button>
            </form>
            <p style={{ marginTop: '20px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Signup' : 'Already have an account? Login'}
            </p>
        </div>
    );
}

export default Signup;
