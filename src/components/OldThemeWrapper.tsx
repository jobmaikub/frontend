import React from 'react';
import '@/styles/old-theme.css';

interface OldThemeWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component to apply old theme styling from old-theme.css
 * Use this wrapper for home, careerList, and careerDetail pages
 * 
 * Usage:
 * <OldThemeWrapper>
 *   <YourPageContent />
 * </OldThemeWrapper>
 */
export const OldThemeWrapper: React.FC<OldThemeWrapperProps> = ({ children }) => {
  return (
    <div className="old-theme-root old-theme-wrapper">
      {children}
    </div>
  );
};
