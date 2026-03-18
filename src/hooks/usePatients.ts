/**
 * React Hooks for Patient Operations
 * 
 * Provides easy-to-use hooks for patient CRUD operations
 */

import { useState, useEffect } from 'react';
import { db, Database } from '../utils/supabase/client';

type Patient = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type PatientUpdate = Database['public']['Tables']['patients']['Update'];

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await db.patients.list();
    
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPatients(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const createPatient = async (patient: PatientInsert) => {
    const { data, error } = await db.patients.create(patient);
    
    if (error) {
      setError(error.message);
      return { success: false, error };
    }
    
    // Refresh list
    await fetchPatients();
    
    return { success: true, data };
  };

  const updatePatient = async (id: string, updates: PatientUpdate) => {
    const { data, error } = await db.patients.update(id, updates);
    
    if (error) {
      setError(error.message);
      return { success: false, error };
    }
    
    // Refresh list
    await fetchPatients();
    
    return { success: true, data };
  };

  const searchPatients = async (query: string) => {
    setLoading(true);
    const { data, error } = await db.patients.search(query);
    
    if (error) {
      setError(error.message);
    } else {
      setPatients(data || []);
    }
    
    setLoading(false);
  };

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    searchPatients,
    refreshPatients: fetchPatients,
  };
}

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await db.patients.get(id);
      
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setPatient(data);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  return { patient, loading, error };
}
