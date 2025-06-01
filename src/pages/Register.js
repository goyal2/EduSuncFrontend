import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    passwordHash: ''
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userId = crypto.randomUUID();
      const userData = {
        userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        passwordHash: formData.passwordHash
      };

      await registerUser(userData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.status === 409) {
        setError('Email already exists. Please use a different email.');
      } else if (err.response?.data) {
        setError(err.response.data);
      } else if (err.message.includes('Network Error')) {
        setError('Unable to connect to the server. Please try again later.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join EduSync today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.name}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <select
              name="role"
              onChange={handleChange}
              value={formData.role}
              required
              disabled={loading}
              style={styles.select}
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <input
              name="passwordHash"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.passwordHash}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div style={styles.footer}>
            <Link to="/login" style={styles.link}>Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#718096',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#4299e1',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginTop: '0.5rem',
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#fff5f5',
    borderRadius: '6px',
    textAlign: 'center',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  link: {
    color: '#4299e1',
    textDecoration: 'none',
    fontSize: '0.875rem',
  },
};

export default Register;
