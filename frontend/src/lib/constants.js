/**
 * Application constants
 */

export const APP_NAME = 'LetterBuddy';
export const APP_VERSION = '1.0.0';

// Letter types
export const LETTER_TYPES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  FORMAL: 'formal',
  INFORMAL: 'informal'
};

// Letter statuses
export const LETTER_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  ARCHIVED: 'archived'
};

// API endpoints
export const API_ENDPOINTS = {
  LETTERS: '/api/letters',
  TEMPLATES: '/api/templates',
  USERS: '/api/users'
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'letterbuddy_preferences',
  DRAFT_LETTERS: 'letterbuddy_drafts',
  RECENT_TEMPLATES: 'letterbuddy_recent_templates'
};

// Validation rules
export const VALIDATION_RULES = {
  MIN_LETTER_LENGTH: 10,
  MAX_LETTER_LENGTH: 10000,
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 100
};
