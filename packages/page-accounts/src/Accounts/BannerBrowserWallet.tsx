// Copyright 2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useTranslation } from '../translate.js';
import Banner from './Banner.js';

// Shown when the user can create/import wallets in-browser (without an extension).
// Reminds them that local-storage-backed keys are convenient but less secure
// than browser extensions or hardware wallets.
function BannerBrowserWallet (): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Banner type='warning'>
      <p>
        {t<string>('You can create or import a wallet directly in this browser (no extension required). Keys are stored in browser localStorage, encrypted with your password. This is convenient for small amounts or testing — for larger balances, please use a browser extension (Polkadot.js / Talisman) or a hardware wallet (Ledger).')}
      </p>
    </Banner>
  );
}

export default React.memo(BannerBrowserWallet);
