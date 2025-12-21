import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import './OrganizationDashboard.css';

const OrganizationDashboard = () => {
    const navigate = useNavigate();
    const { user, organization } = useApp();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/organizations/dashboard-stats');
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to load dashboard stats:', err);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `R ${parseFloat(amount || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'verified': return '#10b981';
            case 'draft': return '#f59e0b';
            case 'pending': return '#f59e0b';
            default: return '#64748b';
        }
    };

    if (loading) {
        return (
            <div className="org-dashboard loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="org-dashboard error">
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchDashboardStats}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="org-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Organization Dashboard</h1>
                    <p className="org-name">{organization?.name || 'Your Organization'}</p>
                </div>
                <button className="refresh-btn" onClick={fetchDashboardStats}>
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card quotes">
                    <div className="stat-icon">📄</div>
                    <div className="stat-content">
                        <h3>Total Quotes</h3>
                        <div className="stat-value">{stats?.quotes?.total || 0}</div>
                        <div className="stat-details">
                            <span className="completed">{stats?.quotes?.completed || 0} completed</span>
                            <span className="draft">{stats?.quotes?.draft || 0} drafts</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>Revenue</h3>
                        <div className="stat-value">{formatCurrency(stats?.revenue?.thisMonth)}</div>
                        <div className="stat-details">
                            <span>This month</span>
                            <span className="total">Total: {formatCurrency(stats?.revenue?.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card clients">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Clients</h3>
                        <div className="stat-value">{stats?.clients?.total || 0}</div>
                        <div className="stat-details">
                            <span className="verified">{stats?.clients?.verified || 0} verified</span>
                            <span className="pending">{stats?.clients?.pending || 0} pending</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card team">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-content">
                        <h3>Team Members</h3>
                        <div className="stat-value">{stats?.team?.members || 0}</div>
                        <div className="stat-details">
                            <span>Active users</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <button className="action-btn primary" onClick={() => navigate('/quote/new')}>
                        ➕ New Quote
                    </button>
                    <button className="action-btn" onClick={() => navigate('/clients')}>
                        👤 Manage Clients
                    </button>
                    <button className="action-btn" onClick={() => navigate('/admin')}>
                        ⚙️ Admin Settings
                    </button>
                    <button className="action-btn" onClick={() => navigate('/dashboard')}>
                        📊 View All Quotes
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h2>Recent Activity</h2>
                {stats?.recentActivity?.length > 0 ? (
                    <div className="activity-list">
                        {stats.recentActivity.map((item, index) => (
                            <div key={`${item.type}-${item.id}-${index}`} className="activity-item">
                                <div className="activity-icon">
                                    {item.type === 'quote' ? '📄' : '👤'}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">{item.title}</div>
                                    <div className="activity-subtitle">{item.subtitle}</div>
                                </div>
                                <div className="activity-meta">
                                    <span
                                        className="activity-status"
                                        style={{ color: getStatusColor(item.status) }}
                                    >
                                        {item.status}
                                    </span>
                                    <span className="activity-date">{formatDate(item.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-activity">
                        <p>No recent activity to show.</p>
                        <p>Start by creating a quote or adding a client!</p>
                    </div>
                )}
            </div>

            {/* Monthly Summary */}
            {stats?.monthlyTrend?.length > 0 && (
                <div className="monthly-summary">
                    <h2>Monthly Overview</h2>
                    <div className="trend-grid">
                        {stats.monthlyTrend.map((month, index) => (
                            <div key={index} className="trend-item">
                                <div className="trend-month">
                                    {new Date(month.month).toLocaleDateString('en-ZA', { month: 'short', year: '2-digit' })}
                                </div>
                                <div className="trend-stats">
                                    <span className="trend-quotes">{month.quoteCount} quotes</span>
                                    <span className="trend-revenue">{formatCurrency(month.revenue)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationDashboard;
