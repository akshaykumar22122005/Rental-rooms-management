import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Search,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters.',
  action = null
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1.5rem',
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border)',
      maxWidth: '500px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        backgroundColor: '#f1f5f9',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        margin: '0 auto 1.25rem auto'
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: action ? '1.5rem' : 0 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
