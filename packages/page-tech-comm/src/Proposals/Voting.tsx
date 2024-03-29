// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash } from "@polkadot/types/interfaces";

import BN from "bn.js";
import React, { useState } from "react";

import { Button, MarkWarning, Modal, TxButton, VoteAccount } from "@polkadot/react-components";
import { useAccounts, useApi, useToggle } from "@polkadot/react-hooks";

import { useTranslation } from "../translate";

interface Props {
  hash: Hash | string;
  members: string[];
  prime?: AccountId | null;
  proposalId: BN | number;
}

function Voting({ hash, members, prime, proposalId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal header={t<string>("Vote on proposal")} size="small">
          <Modal.Content>
            <VoteAccount filter={members} onChange={setAccountId} />
            {accountId === prime?.toString() && (
              <MarkWarning
                content={t<string>(
                  "You are voting with this collective's prime account. The vote will be the default outcome in case of any abstentions."
                )}
              />
            )}
          </Modal.Content>
          <Modal.Actions onCancel={toggleVoting}>
            <TxButton
              accountId={accountId}
              icon="ban"
              label={t<string>("Vote Nay")}
              onStart={toggleVoting}
              params={[hash, proposalId, false]}
              tx={api.tx.technicalCommittee.vote}
            />
            <TxButton
              accountId={accountId}
              icon="check"
              label={t<string>("Vote Aye")}
              onStart={toggleVoting}
              params={[hash, proposalId, true]}
              tx={api.tx.technicalCommittee.vote}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button icon="check" label={t<string>("Vote")} onClick={toggleVoting} />
    </>
  );
}

export default React.memo(Voting);
