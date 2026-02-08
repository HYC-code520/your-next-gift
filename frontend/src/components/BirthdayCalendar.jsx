import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon, Plus, Edit2, Trash2, Gift, Cake, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import '../styles/BirthdayCalendar.css';

function BirthdayCalendar() {
  const { user } = useAuth();
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // Check if current user can edit a birthday
  const canEditBirthday = (birthday) => {
    if (!user) return false;

    // Admin-seeded birthdays (no user_id) - only admin can edit
    if (!birthday.user_id) {
      return user.email === ADMIN_EMAIL;
    }

    // User-added birthdays - only the owner can edit
    return birthday.user_id === user.id;
  };

  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      // Fetch all birthdays - no auth required for viewing
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setBirthdays(data || []);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing birthday
        const { error } = await supabase
          .from('birthdays')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Add new birthday
        const { error } = await supabase
          .from('birthdays')
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
      }

      setFormData({ name: '', date: '', notes: '' });
      setShowForm(false);
      setEditingId(null);
      fetchBirthdays();
    } catch (error) {
      console.error('Error saving birthday:', error);
      alert('Error saving birthday. Please try again.');
    }
  };

  const handleEdit = (birthday) => {
    setFormData({
      name: birthday.name,
      date: birthday.date,
      notes: birthday.notes || ''
    });
    setEditingId(birthday.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this birthday?')) return;

    try {
      const { error } = await supabase
        .from('birthdays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBirthdays();
    } catch (error) {
      console.error('Error deleting birthday:', error);
      alert('Error deleting birthday. Please try again.');
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getBirthdaysForDate = (day) => {
    const month = currentDate.getMonth() + 1;
    return birthdays.filter(b => {
      const [year, bMonth, bDay] = b.date.split('-').map(Number);
      return bMonth === month && bDay === day;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                          today.getFullYear() === currentDate.getFullYear();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBirthdays = getBirthdaysForDate(day);
      const isToday = isCurrentMonth && today.getDate() === day;

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${dayBirthdays.length > 0 ? 'has-birthday' : ''}`}
        >
          <div className="day-number">{day}</div>
          {dayBirthdays.length > 0 && (
            <div className="birthday-indicators">
              {dayBirthdays.map((birthday, idx) => (
                <div
                  key={birthday.id}
                  className={`birthday-marker group ${canEditBirthday(birthday) ? 'cursor-pointer' : ''}`}
                  title={birthday.name}
                  onClick={canEditBirthday(birthday) ? () => handleEdit(birthday) : undefined}
                >
                  <Cake className="w-4 h-4" />
                  <span className="birthday-name">{birthday.name}</span>
                  {canEditBirthday(birthday) && <Edit2 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-60" />}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return birthdays
      .map(b => {
        const [year, month, day] = b.date.split('-').map(Number);
        const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
        const daysUntil = Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24));

        return { ...b, daysUntil, month, day };
      })
      .filter(b => b.daysUntil >= 0 && b.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className="flex-1 pt-8">
      
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Upcoming Birthdays Section */}
        {upcomingBirthdays.length > 0 && (
          <div className="mb-8 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Coming up</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {upcomingBirthdays.map(birthday => (
                <div
                  key={birthday.id}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                    birthday.daysUntil === 0
                      ? 'bg-primary text-primary-foreground'
                      : birthday.daysUntil <= 7
                        ? 'bg-primary/10 text-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="font-medium">{birthday.name}</span>
                  <span className="opacity-70">
                    {birthday.daysUntil === 0 ? '🎂' : `${birthday.daysUntil}d`}
                  </span>
                  {/* Edit/Delete on hover - only for owner */}
                  {canEditBirthday(birthday) && (
                    <div className="hidden group-hover:flex items-center gap-1 ml-1">
                      <button
                        onClick={() => handleEdit(birthday)}
                        className="opacity-60 hover:opacity-100"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(birthday.id)}
                        className="opacity-60 hover:opacity-100 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Calendar View</h2>
        </div>

        {/* Add/Edit Form - Only for logged in users */}
        {user && showForm && (
          <Card className="mb-8">
            <CardHeader className="relative">
              <CardTitle>{editingId ? 'Edit Birthday' : 'Add New Birthday'}</CardTitle>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', date: '', notes: '' }); }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Birthday *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border rounded-md"
                    rows="3"
                    placeholder="Gift ideas, preferences, etc."
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="default">
                    {editingId ? 'Update' : 'Add'} Birthday
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', date: '', notes: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Calendar */}
        {loading ? (
          <div className="text-center py-20">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading birthdays...</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="px-4 py-2 rounded-lg bg-[hsl(210,100%,90%)] text-[hsl(231,44%,28%)] hover:bg-[hsl(210,100%,85%)] transition-all font-medium flex items-center gap-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 rounded-lg bg-[hsl(307,58%,85%)] text-[hsl(231,44%,28%)] hover:bg-[hsl(307,58%,80%)] transition-all font-semibold"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-4 py-2 rounded-lg bg-[hsl(210,100%,90%)] text-[hsl(231,44%,28%)] hover:bg-[hsl(210,100%,85%)] transition-all font-medium flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {user && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 rounded-lg bg-[hsl(150,60%,85%)] text-[hsl(231,44%,28%)] hover:bg-[hsl(150,60%,80%)] transition-all font-medium flex items-center gap-1"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="calendar-grid">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-day-header">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

export default BirthdayCalendar;
