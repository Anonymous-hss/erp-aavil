import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const LoginView: React.FC = () => {
  const { login, setCurrentView, setFigmaOverlayAsset } = useERP();
  
  const [email, setEmail] = useState('alexander.wright@aavil.inc');
  const [password, setPassword] = useState('securePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoState, setDemoState] = useState<'default' | 'error'>('default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (demoState === 'error') {
      setErrorMessage('Invalid email or password. Please verify your credentials and try again.');
      return;
    }

    const res = login(email, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Left Branded Panel (matching #0A0B0D in Figma Login — Default.svg) */}
      <div style={{
        width: '45%',
        minWidth: '480px',
        backgroundColor: '#0A0B0D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Glow & Pattern */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          left: '-150px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 82, 255, 0.25) 0%, rgba(10, 11, 13, 0) 70%)',
          pointerEvents: 'none'
        }} />

        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#0052FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '800',
            fontSize: '20px',
            boxShadow: '0 8px 24px rgba(0, 82, 255, 0.4)'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>AAVIL Inc</div>
            <div style={{ fontSize: '12px', color: '#8A8F98' }}>Enterprise Operations</div>
          </div>
        </div>

        {/* Hero Narrative */}
        <div style={{ zIndex: 2, maxWidth: '420px', margin: '40px 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            backgroundColor: 'rgba(0, 82, 255, 0.15)',
            border: '1px solid rgba(0, 82, 255, 0.3)',
            borderRadius: '999px',
            color: '#3880FF',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            <ShieldCheck size={14} />
            <span>SOC2 Type II & ISO 27001 Certified</span>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Streamline your workforce operations.
          </h2>
          <p style={{ fontSize: '15px', color: '#8A8F98', lineHeight: '1.6' }}>
            Unified human resources, automated payroll disbursements, real-time weekly timesheets, and continuous performance appraisal workflows.
          </p>

          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DDE2E8', fontSize: '13.5px' }}>
              <CheckCircle2 size={16} color="#05B169" />
              <span>Multi-role access for Executives, HR, and Staff</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DDE2E8', fontSize: '13.5px' }}>
              <CheckCircle2 size={16} color="#05B169" />
              <span>Automated tax deductions & payslip generator</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DDE2E8', fontSize: '13.5px' }}>
              <CheckCircle2 size={16} color="#05B169" />
              <span>Granular leave quotas and team scheduling</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#5B616E' }}>
          <span>© 2026 AAVIL Inc. All rights reserved.</span>
          <button 
            onClick={() => setFigmaOverlayAsset('/design-assets/Login — Default.svg')}
            style={{ color: '#0052FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
          >
            Inspect Figma Spec ↗
          </button>
        </div>
      </div>

      {/* Right Login Container (White canvas) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        backgroundColor: '#FFFFFF'
      }}>
        {/* State Toggle Bar (Test Default vs Error state) */}
        <div style={{
          marginBottom: '32px',
          background: '#F1F3F5',
          padding: '4px',
          borderRadius: '8px',
          display: 'flex',
          gap: '4px',
          fontSize: '12px'
        }}>
          <button
            type="button"
            onClick={() => {
              setDemoState('default');
              setErrorMessage(null);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              backgroundColor: demoState === 'default' ? '#FFFFFF' : 'transparent',
              color: demoState === 'default' ? '#0A0B0D' : '#5B616E',
              boxShadow: demoState === 'default' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Figma State: Default
          </button>
          <button
            type="button"
            onClick={() => {
              setDemoState('error');
              setErrorMessage('Invalid email or password. Please verify your credentials and try again.');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              backgroundColor: demoState === 'error' ? '#CF202F' : 'transparent',
              color: demoState === 'error' ? '#FFFFFF' : '#5B616E'
            }}
          >
            Figma State: Error ⚠️
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0A0B0D', letterSpacing: '-0.02em', margin: 0 }}>
              Sign in to your account
            </h2>
            <p style={{ fontSize: '14px', color: '#5B616E', marginTop: '6px' }}>
              Enter your corporate email credentials to continue.
            </p>
          </div>

          {/* Error Banner (matching Figma Login — Error.svg) */}
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: '#FEECEE',
              border: '1px solid #F7BAC0',
              borderRadius: '8px',
              color: '#CF202F',
              fontSize: '13px',
              marginBottom: '20px',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
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
                  style={{
                    paddingLeft: '38px',
                    borderColor: errorMessage ? '#CF202F' : undefined
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentView('forgot-password')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0052FF',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8A8F98' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="form-control"
                  style={{
                    paddingLeft: '38px',
                    paddingRight: '38px',
                    borderColor: errorMessage ? '#CF202F' : undefined
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#8A8F98',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <input 
                type="checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#0052FF', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#5B616E', cursor: 'pointer', userSelect: 'none' }}>
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14.5px',
                fontWeight: '600'
              }}
            >
              <span>Sign In to AAVIL ERP</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: '#F8F9FA',
            borderRadius: '8px',
            border: '1px solid #EEF0F3',
            fontSize: '12px',
            color: '#5B616E'
          }}>
            <div style={{ fontWeight: '600', color: '#0A0B0D', marginBottom: '6px' }}>Demo Credentials:</div>
            <div>👑 <strong>Admin Login:</strong> alexander.wright@aavil.inc (triggers 2FA flow)</div>
            <div style={{ marginTop: '4px' }}>👤 <strong>Employee Login:</strong> marcus.vance@aavil.inc</div>
          </div>
        </div>
      </div>
    </div>
  );
};
