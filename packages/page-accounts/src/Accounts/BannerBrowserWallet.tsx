// Copyright 2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { useTranslation } from '../translate.js';

const DISMISS_KEY = 'dbc:browserWalletBannerDismissed';

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
// can run without pulling in the full react-components tree. Visual style
// mirrors the existing Banner.tsx warning variant.
function BannerBrowserWallet (): React.ReactElement | null {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState<boolean>(readDismissed());

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
      </p>
    </article>
  );
}

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  padding: '0.75rem 2.25rem 0.75rem 1rem',
  margin: '0.5rem 0',
  background: 'rgba(255, 196, 0, 0.12)',
  borderLeft: '4px solid #f0ad4e',
  borderRadius: '4px'
};

const paragraphStyle: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.5
};

const dismissStyle: React.CSSProperties = {
  position: 'absolute',
  right: '0.5rem',
  top: '0.25rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.25rem',
  lineHeight: 1,
  opacity: 0.6,
  padding: '0.25rem 0.5rem'
};

export default React.memo(BannerBrowserWallet);

// Exposed for testing only.
export const __test__ = {
  DISMISS_KEY,
  readDismissed,
  writeDismissed
};
