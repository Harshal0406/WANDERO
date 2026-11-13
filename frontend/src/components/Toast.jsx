import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = AlertCircle;

        return (
          <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
            <Icon size={20} color={toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#10b981' : '#2563eb'} />
            <div style={{ flex: 1 }}>
              {toast.title && <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{toast.title}</div>}
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
