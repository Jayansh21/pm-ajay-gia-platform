import React, { useEffect, useState } from 'react';
import { FileText, Filter, Clock, User, Activity } from 'lucide-react';
import { getAuditLogs } from '../api/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filterType]);

  const fetchLogs = async () => {
    try {
      const params = filterType ? { entity_type: filterType } : {};
      const response = await getAuditLogs(params);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const styles = {
      created: 'bg-green-100 text-green-700',
      updated: 'bg-blue-100 text-blue-700',
      deleted: 'bg-red-100 text-red-700',
      verification_updated: 'bg-purple-100 text-purple-700',
      status_updated: 'bg-yellow-100 text-yellow-700',
    };
    return styles[action] || 'bg-gray-100 text-gray-700';
  };

  const getEntityIcon = (entityType) => {
    switch (entityType) {
      case 'beneficiary':
        return '👤';
      case 'project':
        return '📁';
      case 'enrollment':
        return '🎓';
      default:
        return '📝';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-600 mt-1">Complete transparency with detailed activity logs</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Activity className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-900">Transparency & Accountability</h3>
            <p className="text-sm text-blue-800 mt-1">
              All actions in the system are automatically logged with timestamp, user, and details. 
              This ensures complete accountability and helps prevent leakages in the PM-AJAY GIA program.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Activities</p>
              <p className="text-2xl font-bold text-purple-700">{logs.length}</p>
            </div>
            <Activity size={28} className="text-purple-600" />
          </div>
        </div>
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Beneficiaries</p>
              <p className="text-2xl font-bold text-green-700">
                {logs.filter(l => l.entity_type === 'beneficiary').length}
              </p>
            </div>
            <span className="text-2xl">👤</span>
          </div>
        </div>
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Projects</p>
              <p className="text-2xl font-bold text-blue-700">
                {logs.filter(l => l.entity_type === 'project').length}
              </p>
            </div>
            <span className="text-2xl">📁</span>
          </div>
        </div>
        <div className="card bg-orange-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Enrollments</p>
              <p className="text-2xl font-bold text-orange-700">
                {logs.filter(l => l.entity_type === 'enrollment').length}
              </p>
            </div>
            <span className="text-2xl">🎓</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <Filter className="text-gray-400" size={20} />
          <select
            className="input-field flex-1"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Entity Types</option>
            <option value="beneficiary">Beneficiaries</option>
            <option value="project">Projects</option>
            <option value="enrollment">Enrollments</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Timeline */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={log.id}
              className="relative flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl">
                  {getEntityIcon(log.entity_type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${getActionBadge(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-gray-900">
                        {log.entity_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Entity ID: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{log.entity_id}</code>
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User size={12} className="mr-1" />
                        {log.performed_by}
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-primary-600 cursor-pointer hover:text-primary-700">
                          View details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(JSON.parse(log.details), null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No audit logs found.</p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Audit Trail Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">🔒 Enhanced Security</h3>
            <p className="text-sm text-green-100">
              Every action is tracked and attributed to a user, preventing unauthorized changes and fraud.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📊 Compliance</h3>
            <p className="text-sm text-green-100">
              Meet regulatory requirements with comprehensive activity logs for all beneficiary and project operations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎯 Accountability</h3>
            <p className="text-sm text-green-100">
              Clear audit trail ensures accountability at every level, reducing leakages and improving program effectiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;

