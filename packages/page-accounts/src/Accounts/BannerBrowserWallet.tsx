// Copyright 2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from '../translate.js';

// Versioned key — bump suffix if the banner's message materially changes
// so returning users see the new warning instead of their old "dismissed" flag.
const DISMISS_KEY = 'dbc:browserWalletBannerDismissed.v1';

function readDismissed (): boolean {
  try {
    return typeof window !== 'undefined' &&
      window.localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDismissed (): void {
  try {
    window.localStorage.setItem(DISMISS_KEY, '1');
  } catch { /* storage unavailable — silently ignore */ }
}

// Self-contained banner (no @polkadot/react-components dep) so the unit test
// can run without pulling in the full react-components tree. Dismissal is
// persisted per-origin in localStorage and synced across tabs via the
// `storage` event.
function BannerBrowserWallet (): React.ReactElement | null {
  const { t } = useTranslation();
  // Lazy initializer — reads localStorage once on mount, not on every re-render.
  const [dismissed, setDismissed] = useState<boolean>(() => readDismissed());

  // Multi-tab sync: if another tab dismisses, hide here too.
  useEffect(() => {
    const onStorage = (e: StorageEvent): void => {
      if (e.key === DISMISS_KEY || e.key === null /* clear() */) {
        setDismissed(readDismissed());
      }
    };

    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const onDismiss = useCallback((): void => {
    writeDismissed();
    setDismissed(true);
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <article className='warning centered' style={wrapperStyle}>
      <button
        aria-label={t<string>('Dismiss')}
        data-testid='dismiss-browser-wallet-banner'
        onClick={onDismiss}
        style={dismissStyle}
        type='button'
      >
        ×
      </button>
      <p style={paragraphStyle}>
        {t<string>('You can now create or import a wallet directly in this browser — no extension required. Keys are encrypted with your password and stored in browser localStorage. Suitable for small amounts or testing; for larger balances please use an extension (Polkadot.js / Talisman) or a hardware wallet.')}
        <span style={hintStyle}>{t<string>(' (toggle this in Settings → General → local in-browser account storage)')}</span>
      </p>
    </article>
  );
}

const wrapperStyle: React.CSSProperties = {
  background: 'rgba(255, 196, 0, 0.12)',
  borderLeft: '4px solid #f0ad4e',
  borderRadius: '4px',
  margin: '0.5rem 0',
  padding: '0.75rem 2.25rem 0.75rem 1rem',
  position: 'relative'
};

const paragraphStyle: React.CSSProperties = {
  lineHeight: 1.5,
  margin: 0
};

const hintStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85em',
  marginTop: '0.25rem',
  opacity: 0.75
};

const dismissStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '1.25rem',
  lineHeight: 1,
  // Opacity 0.8 for WCAG AA contrast on pale-yellow background (prior 0.6 borderline)
  opacity: 0.8,
  padding: '0.25rem 0.5rem',
  position: 'absolute',
  right: '0.5rem',
  top: '0.25rem'
};

// No React.memo wrapper — this component takes no props, so memo provides no
// benefit and adds a shallow-equality check on every parent render.
export default BannerBrowserWallet;

// Exposed for testing only.
export const __test__ = {
  DISMISS_KEY,
  readDismissed,
  writeDismissed
};
