// src/components/hooks/useAccountability.js
import { useLocalStorage } from './useLocalStorage';

export const useAccountability = () => {
  const [partners, setPartners] = useLocalStorage('accountability-partners', []);
  const [checkIns, setCheckIns] = useLocalStorage('accountability-checkins', {});
  const [sharedGoals, setSharedGoals] = useLocalStorage('shared-goals', {});

  const addPartner = (partnerData) => {
    const newPartner = {
      id: Date.now().toString(),
      name: partnerData.name,
      email: partnerData.email,
      phoneNumber: partnerData.phoneNumber || null,
      avatar: partnerData.avatar || null,
      createdAt: new Date().toISOString(),
      status: 'active',
      checkInFrequency: partnerData.checkInFrequency || 'weekly', // daily, weekly, biweekly
      preferredMethod: partnerData.preferredMethod || 'email', // email, sms, app
      reminderEnabled: true,
      lastCheckIn: null
    };

    setPartners(prev => [...prev, newPartner]);
    return newPartner;
  };

  const removePartner = (partnerId) => {
    setPartners(prev => prev.filter(p => p.id !== partnerId));
    
    // Clean up associated data
    setCheckIns(prev => {
      const updated = { ...prev };
      delete updated[partnerId];
      return updated;
    });
  };

  const updatePartner = (partnerId, updates) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, ...updates } : p
    ));
  };

  const logCheckIn = (partnerId, data) => {
    const checkIn = {
      id: Date.now().toString(),
      partnerId,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      type: data.type, // 'sent', 'received'
      content: data.content,
      habitProgress: data.habitProgress || null,
      mood: data.mood || null,
      notes: data.notes || null
    };

    setCheckIns(prev => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), checkIn]
    }));

    // Update partner's last check-in
    updatePartner(partnerId, { lastCheckIn: Date.now() });

    return checkIn;
  };

  const getPartnerCheckIns = (partnerId, limit = 10) => {
    const partnerCheckIns = checkIns[partnerId] || [];
    return partnerCheckIns
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  };

  const getCheckInStreak = (partnerId) => {
    const partnerCheckIns = checkIns[partnerId] || [];
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return 0;

    const frequency = partner.checkInFrequency;
    const daysBetween = frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 14;

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < 100; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - (i * daysBetween));
      const dateStr = checkDate.toISOString().split('T')[0];

      const hasCheckIn = partnerCheckIns.some(ci => {
        const ciDate = new Date(ci.date).toISOString().split('T')[0];
        return ciDate === dateStr;
      });

      if (hasCheckIn) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const needsCheckIn = (partnerId) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner || !partner.lastCheckIn) return true;

    const daysSinceLastCheckIn = Math.floor(
      (Date.now() - partner.lastCheckIn) / (1000 * 60 * 60 * 24)
    );

    const threshold = partner.checkInFrequency === 'daily' ? 1 
      : partner.checkInFrequency === 'weekly' ? 7 : 14;

    return daysSinceLastCheckIn >= threshold;
  };

  const createSharedGoal = (partnerId, goalData) => {
    const sharedGoal = {
      id: Date.now().toString(),
      partnerId,
      title: goalData.title,
      description: goalData.description,
      targetDate: goalData.targetDate,
      createdAt: new Date().toISOString(),
      progress: 0,
      completed: false,
      milestones: goalData.milestones || []
    };

    setSharedGoals(prev => ({
      ...prev,
      [sharedGoal.id]: sharedGoal
    }));

    return sharedGoal;
  };

  const updateSharedGoalProgress = (goalId, progress) => {
    setSharedGoals(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        progress: Math.min(100, Math.max(0, progress)),
        completed: progress >= 100,
        lastUpdated: Date.now()
      }
    }));
  };

  const getPartnerSharedGoals = (partnerId) => {
    return Object.values(sharedGoals).filter(g => g.partnerId === partnerId);
  };

  const generateCheckInMessage = (habits) => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completions && h.completions[today]).length;
    const totalHabits = habits.length;
    const rate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    return {
      summary: `Today's Progress: ${completedToday}/${totalHabits} habits (${rate}%)`,
      details: habits.map(h => ({
        name: h.name,
        completed: h.completions && h.completions[today] ? true : false
      }))
    };
  };

  const getAccountabilityStats = () => {
    const totalPartners = partners.filter(p => p.status === 'active').length;
    const totalCheckIns = Object.values(checkIns).reduce((sum, arr) => sum + arr.length, 0);
    const averageStreak = partners.length > 0
      ? Math.round(partners.reduce((sum, p) => sum + getCheckInStreak(p.id), 0) / partners.length)
      : 0;

    return {
      totalPartners,
      totalCheckIns,
      averageStreak,
      activeGoals: Object.values(sharedGoals).filter(g => !g.completed).length
    };
  };

  return {
    partners,
    addPartner,
    removePartner,
    updatePartner,
    logCheckIn,
    getPartnerCheckIns,
    getCheckInStreak,
    needsCheckIn,
    createSharedGoal,
    updateSharedGoalProgress,
    getPartnerSharedGoals,
    generateCheckInMessage,
    getAccountabilityStats
  };
};