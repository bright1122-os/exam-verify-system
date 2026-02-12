import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),

      // Authentication
      user: null,
      isAuthenticated: false,
      userType: null, // 'student', 'examiner', 'admin'

      login: (userData, type) => set({
        user: userData,
        isAuthenticated: true,
        userType: type
      }),

      logout: () => {
        localStorage.removeItem('token');
        return set({
          user: null,
          isAuthenticated: false,
          userType: null
        });
      },

      // Student data
      studentData: {
        registrationComplete: false,
        paymentVerified: false,
        qrGenerated: false,
        qrUsed: false,
      },

      updateStudentData: (data) => set((state) => ({
        studentData: { ...state.studentData, ...data }
      })),

      // Scan history for examiner
      scanHistory: [],
      addScanRecord: (record) => set((state) => ({
        scanHistory: [record, ...state.scanHistory]
      })),
    }),
    {
      name: 'exam-verify-storage',
    }
  )
);
