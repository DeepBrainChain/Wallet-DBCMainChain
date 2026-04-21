// Copyright 2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Icon, styled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Banner from './Banner.js';

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

// Shown once when the user can create/import wallets in-browser (no extension).
// Dismissible; remembers dismissal in localStorage so returning users don't see
// it again. Exposes a private reset path for tests (see BannerBrowserWallet.spec).
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
    <StyledWrap>
      <Banner type='warning'>
        <DismissButton
          aria-label={t<string>('Dismiss')}
          data-testid='dismiss-browser-wallet-banner'
          onClick={onDismiss}
          role='button'
          tabIndex={0}
        >
          <Icon icon='times' />
        </DismissButton>
        <p>
          {t<string>('You can now create or import a wallet directly in this browser — no extension required. Keys are encrypted with your password and stored in browser localStorage. Suitable for small amounts or testing; for larger balances please use an extension (Polkadot.js / Talisman) or a hardware wallet.')}
        </p>
      </Banner>
    </StyledWrap>
  );
}

const StyledWrap = styled.div`
  position: relative;
`;

const DismissButton = styled.span`
  position: absolute;
  right: 1.25rem;
  top: 0.75rem;
  cursor: pointer;
  opacity: 0.6;

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export default React.memo(BannerBrowserWallet);

// Exposed for testing only.
export const __test__ = {
  DISMISS_KEY,
  readDismissed,
  writeDismissed
};
