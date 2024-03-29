// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from "@polkadot/api-derive/types";

import { useAccounts, useApi, useCall } from "@polkadot/react-hooks";

const transformCounter = {
  transform: (motions: DeriveCollectiveProposal[]) => motions.filter(({ votes }): boolean => !!votes).length,
};

export default function useCounter(): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const counter =
    useCall<number>(isApiReady && hasAccounts && api.derive.council?.proposals, undefined, transformCounter) || 0;

  return counter;
}
