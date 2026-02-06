import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon, Plus, Edit2, Trash2, Gift, Cake, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import '../styles/BirthdayCalendar.css';

function BirthdayCalendar() {
  const { user } = useAuth();
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
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

      setFormData({ name: '', birthday: '', notes: '' });
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
      birthday: birthday.birthday,
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
      const [year, bMonth, bDay] = b.birthday.split('-').map(Number);
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
                  className="birthday-marker"
                  title={birthday.name}
                >
                  <Cake className="w-4 h-4" />
                  <span className="birthday-name">{birthday.name}</span>
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
        const [year, month, day] = b.birthday.split('-').map(Number);
        const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
        const daysUntil = Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24));
        
        return { ...b, daysUntil, month, day };
      })
      .filter(b => b.daysUntil >= 0 && b.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className="flex-1 bg-background pt-8">
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Login reminder for admin features */}
        {!user && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                <Lock className="w-4 h-4 inline mr-2" />
                Login to add, edit, or delete birthdays
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Birthdays Section */}
        {upcomingBirthdays.length > 0 && (
          <Card className="mb-8 border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cake className="w-6 h-6" />
                Upcoming Birthdays (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBirthdays.map(birthday => (
                  <div key={birthday.id} className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <Gift className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{birthday.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {birthday.daysUntil === 0 ? '🎉 Today!' : `In ${birthday.daysUntil} day${birthday.daysUntil !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar View Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Calendar View</h2>
        </div>

        {/* Add/Edit Form - Only for logged in users */}
        {user && showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Birthday' : 'Add New Birthday'}</CardTitle>
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
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
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
                      setFormData({ name: '', birthday: '', notes: '' });
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

        {/* Birthday List */}
        {birthdays.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Birthdays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {birthdays
                  .sort((a, b) => {
                    const [, aMonth, aDay] = a.birthday.split('-').map(Number);
                    const [, bMonth, bDay] = b.birthday.split('-').map(Number);
                    if (aMonth !== bMonth) return aMonth - bMonth;
                    return aDay - bDay;
                  })
                  .map(birthday => {
                    const [year, month, day] = birthday.birthday.split('-').map(Number);
                    return (
                      <div key={birthday.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <Cake className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-semibold">{birthday.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {monthNames[month - 1]} {day}
                              {birthday.notes && ` • ${birthday.notes}`}
                            </p>
                          </div>
                        </div>
                        {/* Edit/Delete buttons - Only for logged in users */}
                        {user && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(birthday)}
                              className="text-primary hover:text-primary/80 transition-colors p-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(birthday.id)}
                              className="text-destructive hover:text-destructive/80 transition-colors p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default BirthdayCalendar;
