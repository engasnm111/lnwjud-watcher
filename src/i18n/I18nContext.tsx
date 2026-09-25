/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { en, th, type MessageKey } from './messages';

export type Locale = 'th' | 'en';
const LOCALE_KEY = 'lnwjud-watcher.locale.v1';

function detectLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === 'th' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('th') ? 'th' : 'en';
}

interface I18nValue {
  locale: Locale;
  localeTag: string;
  setLocale(locale: Locale): void;
  t(key: MessageKey, vars?: Record<string, string | number>): string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  const setLocale = (next: Locale) => {
    localStorage.setItem(LOCALE_KEY, next);
    setLocaleState(next);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nValue>(() => ({
    locale,
    localeTag: locale === 'th' ? 'th-TH' : 'en-US',
    setLocale,
    t(key, vars) {
      let value: string = (locale === 'th' ? th : en)[key];
      for (const [name, replacement] of Object.entries(vars ?? {})) {
        value = value.replaceAll('{' + name + '}', String(replacement));
      }
      return value;
    }
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
