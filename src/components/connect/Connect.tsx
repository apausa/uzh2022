/* eslint-disable max-len */
import React, {
  Dispatch, SetStateAction,
} from 'react';
import { HashConnect, MessageTypes } from 'hashconnect';

// Utils
import { getItem, setItem } from '../../lib/utils/localStorage';

// Types
import { IData } from '../../lib/types';

// Constants
import APP_METADATA from './connect.constants';

function Connect({ isConnected, setIsConnected }: {
  isConnected: boolean,
  setIsConnected: Dispatch<SetStateAction<boolean>> }) {
  const hashconnect: HashConnect = new HashConnect();

  const connectWallet = (privKey: string, topic: string, pairingString: string) => {
    hashconnect.connectToLocalWallet(pairingString);

    hashconnect.pairingEvent.once(({ metadata, accountIds }: MessageTypes.ApprovePairing) => {
      const data: IData = {
        privKey, topic, pairingString, metadata, accountIds,
      };

      setItem('hashconnectData', JSON.stringify(data));
      setIsConnected(true);
    });
  };

  const connectLibrary = async (event: any) => {
    event.preventDefault();

    const hashconnectRawData: any = getItem('hashconnectData');
    const hashconnectData: IData = JSON.parse(hashconnectRawData);

    if (hashconnectData) {
      await hashconnect.init(APP_METADATA, hashconnectData.privKey);
      await hashconnect.connect(hashconnectData.topic, hashconnectData.metadata);

      setIsConnected(true);
    } else {
      const { privKey }: any = await hashconnect.init(APP_METADATA);
      const state: any = await hashconnect.connect();
      const pairingString: string = hashconnect.generatePairingString(state, 'testnet', true);

      connectWallet(privKey, state.topic, pairingString);
    }
  };

  return (
    <div className="my-4">
      <div className="mb-2 d-flex justify-content-center fs-4 fw-bold">Step 1</div>
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className={(isConnected) ? 'btn btn-success' : 'btn btn-secondary'}
          onClick={(event) => connectLibrary(event)}
          disabled={isConnected}
        >
          Connect wallet
        </button>
      </div>
    </div>
  );
}

export default Connect;
