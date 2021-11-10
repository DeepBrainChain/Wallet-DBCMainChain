// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    'DBC Mainnet': 'dbcmainnet',
    Kusama: 'ksm',
    Polkadot: 'dot'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://www.reddit.com/r/DBC_Council/`,
    //`https://www.dbctreasury.com.com/${chain}/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.dbctreasury as string,
  paths: {
    bounty: 'bounties',
    tip: 'tips',
    treasury: 'proposals'
  },
  url: 'https://reddit.com/'
  //url: 'https://dbctreasury.com/'
};
