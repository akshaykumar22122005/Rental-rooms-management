import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import EmptyState from './EmptyState';

const NotificationsView = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            In-App Notifications
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Updates regarding rental inquiries, landlord responses, and system alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCheck size={16} /> Mark All As Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You will receive alerts here when booking requests or property statuses change."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.readStatus && markAsRead(n.id)}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: n.readStatus ? '4px solid var(--border)' : '4px solid var(--primary)',
                backgroundColor: n.readStatus ? '#ffffff' : '#f0fdf4',
                cursor: n.readStatus ? 'default' : 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {n.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
