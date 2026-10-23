import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ForgotPasswordView: React.FC = () => {
  const { setCurrentView, setFigmaOverlayAsset } = useERP();
  const [email, setEmail] = useState('alexander.wright@aavil.inc');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F8F9FA',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <button
          onClick={() => setCurrentView('login')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#5B616E',
            background: 'none',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to sign in</span>
        </button>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#E5EDFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0052FF',
          marginBottom: '20px'
        }}>
          <ShieldAlert size={24} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0A0B0D', letterSpacing: '-0.02em', margin: 0 }}>
          Reset your password
        </h2>
        <p style={{ fontSize: '13.5px', color: '#5B616E', marginTop: '8px', lineHeight: '1.5' }}>
          Enter the corporate email address associated with your AAVIL account and we’ll send a secure one-time verification link.
        </p>

        {submitted ? (
          <div style={{
            marginTop: '28px',
            padding: '20px',
            backgroundColor: '#E3F6EC',
            borderRadius: '12px',
            border: '1px solid #A3E6C5',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={32} color="#05B169" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontWeight: '700', color: '#0A0B0D', fontSize: '15px' }}>Reset link sent!</div>
            <p style={{ fontSize: '13px', color: '#5B616E', marginTop: '6px' }}>
              We have dispatched instructions to <strong>{email}</strong>. Check your inbox and spam folders.
            </p>
            <button
              onClick={() => setCurrentView('login')}
              className="btn btn-primary"
              style={{ marginTop: '16px', width: '100%' }}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: '28px' }}>
            <div className="form-group">
              <label className="form-label">Corporate Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8A8F98' }} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@aavil.inc"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => setFigmaOverlayAsset('/design-assets/Forgot Password.svg')}
            style={{ color: '#0052FF', background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
          >
            Inspect Figma Spec ↗
          </button>
        </div>
      </div>
    </div>
  );
};
