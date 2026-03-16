/**
 * Wellness API Service
 * 
 * Provides data access for wellness tracking features:
 * - Wellness profiles (user + family members)
 * - Nutrition tracking (meals)
 * - Activity tracking (workouts)
 * - Daily habits (water, sleep, steps)
 * 
 * FEATURES:
 * - Offline-first with queue support
 * - Mock data fallback
 * - Audit logging
 * - Error handling
 */

import { supabase, USE_MOCK_DATA } from './supabase';
import { OfflineQueue } from './offlineQueue';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WellnessProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  weight?: number; // kg
  height?: number; // cm
  goals: string[];
  activity_level: number; // 0-3
  language: 'sw' | 'en';
  daily_calorie_target: number;
  profile_type: 'adult' | 'child' | 'elder';
  relationship?: string; // child, parent, partner, elder
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface WellnessMeal {
  id: string;
  profile_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    name: string;
    portion: string;
    calories: number;
  }>;
  total_calories: number;
  notes?: string;
  created_at: string;
}

export interface WellnessWorkout {
  id: string;
  profile_id: string;
  date: string;
  activity_type: string;
  duration_minutes: number;
  intensity: 'low' | 'medium' | 'high';
  calories_burned?: number;
  notes?: string;
  created_at: string;
}

export interface WellnessHabit {
  id: string;
  profile_id: string;
  date: string; // YYYY-MM-DD
  water_glasses: number;
  sleep_hours: number;
  steps: number;
  created_at: string;
}

// ============================================================================
// WELLNESS PROFILES
// ============================================================================

export const wellnessApi = {
  // Get all profiles for current user
  async getProfiles(): Promise<WellnessProfile[]> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Wellness profiles loaded');
      return getMockProfiles();
    }

    const { data, error } = await supabase
      .from('wellness_profiles')
      .select('*')
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get single profile
  async getProfile(id: string): Promise<WellnessProfile | null> {
    if (USE_MOCK_DATA) {
      const profiles = getMockProfiles();
      return profiles.find(p => p.id === id) || null;
    }

    const { data, error } = await supabase
      .from('wellness_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create profile
  async createProfile(profile: Omit<WellnessProfile, 'id' | 'created_at' | 'updated_at'>): Promise<WellnessProfile> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Created profile', profile);
      return {
        ...profile,
        id: 'mock-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    if (!navigator.onLine) {
      await OfflineQueue.add('create', 'wellness_profiles', profile);
      throw new Error('Offline: Profile will be created when online');
    }

    const { data, error } = await supabase
      .from('wellness_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async updateProfile(id: string, updates: Partial<WellnessProfile>): Promise<WellnessProfile> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Updated profile', id, updates);
      return { id, ...updates } as WellnessProfile;
    }

    if (!navigator.onLine) {
      await OfflineQueue.add('update', 'wellness_profiles', { id, ...updates });
      throw new Error('Offline: Profile will be updated when online');
    }

    const { data, error } = await supabase
      .from('wellness_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete profile
  async deleteProfile(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Deleted profile', id);
      return;
    }

    if (!navigator.onLine) {
      await OfflineQueue.add('delete', 'wellness_profiles', { id });
      throw new Error('Offline: Profile will be deleted when online');
    }

    const { error } = await supabase
      .from('wellness_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ============================================================================
  // MEALS
  // ============================================================================

  // Get meals for profile
  async getMeals(profileId: string, startDate?: string, endDate?: string): Promise<WellnessMeal[]> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Returning mock meals');
      return getMockMeals(profileId);
    }

    let query = supabase
      .from('wellness_meals')
      .select('*')
      .eq('profile_id', profileId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Add meal
  async addMeal(meal: Omit<WellnessMeal, 'id' | 'created_at'>): Promise<WellnessMeal> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Added meal', meal);
      return {
        ...meal,
        id: 'mock-meal-' + Date.now(),
        created_at: new Date().toISOString(),
      };
    }

    if (!navigator.onLine) {
      await OfflineQueue.add('create', 'wellness_meals', meal);
      throw new Error('Offline: Meal will be added when online');
    }

    const { data, error } = await supabase
      .from('wellness_meals')
      .insert(meal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete meal
  async deleteMeal(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Deleted meal', id);
      return;
    }

    const { error } = await supabase
      .from('wellness_meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ============================================================================
  // WORKOUTS
  // ============================================================================

  // Get workouts for profile
  async getWorkouts(profileId: string, startDate?: string, endDate?: string): Promise<WellnessWorkout[]> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Returning mock workouts');
      return getMockWorkouts(profileId);
    }

    let query = supabase
      .from('wellness_workouts')
      .select('*')
      .eq('profile_id', profileId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Add workout
  async addWorkout(workout: Omit<WellnessWorkout, 'id' | 'created_at'>): Promise<WellnessWorkout> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Added workout', workout);
      return {
        ...workout,
        id: 'mock-workout-' + Date.now(),
        created_at: new Date().toISOString(),
      };
    }

    if (!navigator.onLine) {
      await OfflineQueue.add('create', 'wellness_workouts', workout);
      throw new Error('Offline: Workout will be added when online');
    }

    const { data, error } = await supabase
      .from('wellness_workouts')
      .insert(workout)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete workout
  async deleteWorkout(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Deleted workout', id);
      return;
    }

    const { error } = await supabase
      .from('wellness_workouts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ============================================================================
  // HABITS
  // ============================================================================

  // Get habits for profile
  async getHabits(profileId: string, startDate?: string, endDate?: string): Promise<WellnessHabit[]> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Returning mock habits');
      return getMockHabits(profileId);
    }

    let query = supabase
      .from('wellness_habits')
      .select('*')
      .eq('profile_id', profileId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Get or create today's habits
  async getTodayHabits(profileId: string): Promise<WellnessHabit> {
    const today = new Date().toISOString().split('T')[0];

    if (USE_MOCK_DATA) {
      return {
        id: 'mock-habit-today',
        profile_id: profileId,
        date: today,
        water_glasses: 4,
        sleep_hours: 7.5,
        steps: 5200,
        created_at: new Date().toISOString(),
      };
    }

    // Try to get existing
    const { data: existing } = await supabase
      .from('wellness_habits')
      .select('*')
      .eq('profile_id', profileId)
      .eq('date', today)
      .single();

    if (existing) return existing;

    // Create new
    const { data, error } = await supabase
      .from('wellness_habits')
      .insert({
        profile_id: profileId,
        date: today,
        water_glasses: 0,
        sleep_hours: 0,
        steps: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update habits
  async updateHabits(id: string, updates: Partial<WellnessHabit>): Promise<WellnessHabit> {
    if (USE_MOCK_DATA) {
      console.log('📊 MOCK MODE: Updated habits', id, updates);
      return { id, ...updates } as WellnessHabit;
    }

    if (!navigator.onLine) {
      await OfflineQueue.add('update', 'wellness_habits', { id, ...updates });
      throw new Error('Offline: Habits will be updated when online');
    }

    const { data, error } = await supabase
      .from('wellness_habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// MOCK DATA
// ============================================================================

function getMockProfiles(): WellnessProfile[] {
  return [
    {
      id: 'mock-profile-1',
      user_id: 'mock-user-1',
      name: 'Amina Juma',
      age: 32,
      weight: 68,
      height: 165,
      goals: ['Improve nutrition', 'Be more active'],
      activity_level: 2,
      language: 'sw',
      daily_calorie_target: 2000,
      profile_type: 'adult',
      is_primary: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getMockMeals(profileId: string): WellnessMeal[] {
  const today = new Date().toISOString();
  return [
    {
      id: 'mock-meal-1',
      profile_id: profileId,
      date: today,
      meal_type: 'breakfast',
      foods: [
        { name: 'Ugali', portion: '1 cup', calories: 250 },
        { name: 'Chai', portion: '1 cup', calories: 80 },
      ],
      total_calories: 330,
      created_at: today,
    },
    {
      id: 'mock-meal-2',
      profile_id: profileId,
      date: today,
      meal_type: 'lunch',
      foods: [
        { name: 'Wali na Maharage', portion: '1 plate', calories: 450 },
        { name: 'Salad', portion: '1 bowl', calories: 50 },
      ],
      total_calories: 500,
      created_at: today,
    },
  ];
}

function getMockWorkouts(profileId: string): WellnessWorkout[] {
  return [
    {
      id: 'mock-workout-1',
      profile_id: profileId,
      date: new Date().toISOString(),
      activity_type: 'Walking',
      duration_minutes: 30,
      intensity: 'medium',
      calories_burned: 150,
      created_at: new Date().toISOString(),
    },
  ];
}

function getMockHabits(profileId: string): WellnessHabit[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'mock-habit-1',
      profile_id: profileId,
      date: today,
      water_glasses: 6,
      sleep_hours: 7.5,
      steps: 8200,
      created_at: new Date().toISOString(),
    },
  ];
}