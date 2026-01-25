// src/components/features/AccountabilityPartners.jsx
import { useState } from 'react';
import { Users, Plus, X, Mail, Phone, MessageCircle, TrendingUp, Target, Calendar, Send } from 'lucide-react';
import { useAccountability } from '../hooks/useAccountability';

export default function AccountabilityPartners({ habits, isDark }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [checkInMessage, setCheckInMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    checkInFrequency: 'weekly',
    preferredMethod: 'email'
  });

  const {
    partners,
    addPartner,
    removePartner,
    logCheckIn,
    getPartnerCheckIns,
    getCheckInStreak,
    needsCheckIn,
    generateCheckInMessage,
    getAccountabilityStats
  } = useAccountability();

  const stats = getAccountabilityStats();

  const handleAddPartner = () => {
    if (!formData.name.trim()) return;
    
    addPartner(formData);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      checkInFrequency: 'weekly',
      preferredMethod: 'email'
    });
    setShowAddForm(false);
  };

  const handleSendCheckIn = (partner) => {
    const message = generateCheckInMessage(habits);
    
    logCheckIn(partner.id, {
      type: 'sent',
      content: checkInMessage || message.summary,
      habitProgress: message.details,
      mood: 'good',
      notes: checkInMessage
    });

    // In a real app, this would send an actual email/SMS
    alert(`Check-in sent to ${partner.name}!\n\n${message.summary}`);
    setCheckInMessage('');
    setSelectedPartner(null);
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-purple-500" size={24} />
          <div>
            <h2 className="text-xl font-bold">Accountability Partners</h2>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Stay accountable together
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white hover:scale-110 transition-all"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-6 ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-2xl font-black text-purple-500">{stats.totalPartners}</div>
          <div className="text-xs text-gray-500">Partners</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-blue-500">{stats.totalCheckIns}</div>
          <div className="text-xs text-gray-500">Check-ins</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-green-500">{stats.averageStreak}</div>
          <div className="text-xs text-gray-500">Avg Streak</div>
        </div>
      </div>

      {/* Add Partner Form */}
      {showAddForm && (
        <div className={`p-4 rounded-xl border mb-4 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className="font-semibold mb-3">Add New Partner</h3>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />

            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.checkInFrequency}
                onChange={(e) => setFormData({ ...formData, checkInFrequency: e.target.value })}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                }`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </select>

              <select
                value={formData.preferredMethod}
                onChange={(e) => setFormData({ ...formData, preferredMethod: e.target.value })}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                }`}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="app">In-App</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddPartner}
                className="flex-1 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all"
              >
                Add Partner
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partners List */}
      {partners.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-3 text-gray-400 opacity-50" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No accountability partners yet. Add someone to stay motivated!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {partners.map(partner => {
            const streak = getCheckInStreak(partner.id);
            const needsUpdate = needsCheckIn(partner.id);
            const recentCheckIns = getPartnerCheckIns(partner.id, 3);

            return (
              <div
                key={partner.id}
                className={`p-4 rounded-xl border transition-all hover:scale-102 ${
                  needsUpdate
                    ? isDark
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-orange-50 border-orange-200'
                    : isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full ${getAvatarColor(partner.name)} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {partner.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{partner.name}</h4>
                      <button
                        onClick={() => removePartner(partner.id)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      {partner.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {partner.email}
                        </span>
                      )}
                      {partner.phoneNumber && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          {partner.phoneNumber}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp size={14} className="text-green-500" />
                        <span className="font-semibold">{streak}</span>
                        <span className="text-xs text-gray-500">streak</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MessageCircle size={14} className="text-blue-500" />
                        <span className="font-semibold">{recentCheckIns.length}</span>
                        <span className="text-xs text-gray-500">recent</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar size={14} className="text-purple-500" />
                        <span className="text-xs text-gray-500">{partner.checkInFrequency}</span>
                      </div>
                    </div>

                    {/* Check-in Button */}
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className={`w-full py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 ${
                        needsUpdate
                          ? 'bg-orange-500 text-white'
                          : 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      <Send size={14} />
                      {needsUpdate ? 'Send Update' : 'Check In'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Check-in Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl ${
            isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
          } p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Check in with {selectedPartner.name}</h3>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <p className="text-sm font-semibold mb-2">Today's Progress</p>
              <p className="text-xs text-gray-500">
                {generateCheckInMessage(habits).summary}
              </p>
            </div>

            <textarea
              value={checkInMessage}
              onChange={(e) => setCheckInMessage(e.target.value)}
              placeholder="Add a personal message (optional)"
              className={`w-full px-4 py-3 rounded-lg mb-4 resize-none ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
              rows={4}
            />

            <button
              onClick={() => handleSendCheckIn(selectedPartner)}
              className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Send Check-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}