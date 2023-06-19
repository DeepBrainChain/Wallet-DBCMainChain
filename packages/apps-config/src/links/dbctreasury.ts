// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalDbctreasurySVG } from '../ui/logos/external/index.js';

export const DBCtreasury: ExternalDef = {
  chains: {
   'DBC Mainnet': 'dbcmainnet',
   'DBC Testnet': 'dbctestnet'
  },
  create: (_chain: string, _path: string, _data: BN | number | string): string =>
    `https://www.reddit.com/r/DBC_Council/`,
  homepage: 'https://www.reddit.com/r/DBC_Council/',
  isActive: true,
  paths: {
    bounty: 'bounties',
    tip: 'tips',
    treasury: 'proposals'
  },
  ui: {
    logo: externalDbctreasurySVG
  }
};