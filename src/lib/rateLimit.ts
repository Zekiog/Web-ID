/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Client-side rate limiter — localStorage-based, 100 submissions/day baseline.
 * Works alongside Firestore security rule rate limiting for defense-in-depth.
 */

const STORAGE_KEY = 'web-id-rate-limit';
const DAILY_LIMIT = 100;

interface RateLimitState {
  /** ISO date string (YYYY-MM-DD) for the current tracking day */
  date: string;
  /** Number of submissions counted today */
  count: number;
}

/**
 * Get today's date as YYYY-MM-DD in the user's local timezone.
 */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Read the current rate limit state from localStorage.
 * Resets to a fresh day if the stored date doesn't match today.
 */
function getState(): RateLimitState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RateLimitState;
      if (parsed.date === todayKey()) {
        return parsed;
      }
    }
  } catch {
    // Corrupted or unavailable — fall through to fresh state
  }
  return { date: todayKey(), count: 0 };
}

/**
 * Persist rate limit state to localStorage.
 */
function saveState(state: RateLimitState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or disabled — silently degrade; server-side
    // Firestore rules still enforce the limit.
  }
}

/**
 * Check whether the caller is within the daily submission limit.
 * Returns `true` if the submission is allowed.
 */
export function checkRateLimit(): boolean {
  const state = getState();
  return state.count < DAILY_LIMIT;
}

/**
 * Returns the number of submissions remaining today.
 */
export function getRemainingRequests(): number {
  const state = getState();
  return Math.max(0, DAILY_LIMIT - state.count);
}

/**
 * Increment the submission counter. Must be called *after* a successful
 * submission (not speculatively) so the count accurately reflects actual usage.
 */
export function incrementRateLimit(): void {
  const state = getState();
  if (state.count < DAILY_LIMIT) {
    state.count += 1;
    saveState(state);
  }
}

/**
 * Reset the rate limit counter (useful for testing).
 */
export function resetRateLimit(): void {
  saveState({ date: todayKey(), count: 0 });
}
