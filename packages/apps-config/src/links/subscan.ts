// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";

import { externalLogos } from "../ui/logos";

export default {
  chains: {
    "Acala Mandala TC5": "acala-testnet",
    "Bifrost Asgard Nightly": "bitfrost",
    "Centrifuge Mainnet": "centrifuge",
    ChainX: "chainx",
    "Crust Maxwell": "crust",
    "Darwinia CC1": "darwinia-cc1",
    "Darwinia Crab": "crab",
    "DBC Mainnet": "dbcmainnet",
    Edgeware: "edgeware",
    Equilibrium: "equilibrium",
    Kulupu: "kulupu",
    Kusama: "kusama",
    "Laminar Turbulence TC2": "laminar-testnet",
    "Phala PoC-3": "phala",
    Plasm: "plasm",
    Polkadot: "polkadot",
    Rococo: "rococo",
    Stafi: "stafi",
    Westend: "westend",
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://dbc.subscan.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.subscan as string,
  paths: {
    address: "account",
    block: "block",
    council: "council",
    extrinsic: "extrinsic",
    proposal: "democracy_proposal",
    referendum: "referenda",
    techcomm: "tech",
    treasury: "treasury",
    validator: "validator",
  },
  url: "https://subscan.io/",
};
