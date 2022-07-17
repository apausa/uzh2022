import React, {
  Dispatch, SetStateAction, useEffect, useState,
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
  setIsConnected: Dispatch<SetStateAction<boolean>>
}) {
  const hashconnect: HashConnect = new HashConnect();
  const [firstTimeData, setFirstTimeData]: [any, Dispatch<SetStateAction<any>>] = useState({});
  const [isWallet, setIsWallet]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

  const onGetKey = async (event: any): Promise<void> => {
    event.preventDefault();

    const hashconnectRawData: any = getItem('hashconnectData');
    const hashconnectData: IData = JSON.parse(hashconnectRawData);

    if (isConnected) {
      await hashconnect.init(APP_METADATA, hashconnectData.privKey);
      await hashconnect.connect(hashconnectData.topic, hashconnectData.metadata);

      setIsConnected(true);
    } else {
      const { privKey }: any = await hashconnect.init(APP_METADATA);
      const state: any = await hashconnect.connect();
      const pairingString: string = hashconnect.generatePairingString(state, 'testnet', true);

      setFirstTimeData({ privKey, topic: state.topic, pairingString });
    }
  };

  const sendPairingEvent = () => {
    const { privKey, topic, pairingString } = firstTimeData;

    hashconnect.connectToLocalWallet(pairingString);
    hashconnect.pairingEvent.once(({ metadata, accountIds }: MessageTypes.ApprovePairing) => {
      const data: IData = {
        privKey, topic, pairingString, metadata, accountIds,
      };

      setItem('hashconnectData', JSON.stringify(data));
      setIsConnected(true);
    });
  };

  useEffect(() => { sendPairingEvent(); }, [firstTimeData]);
  useEffect(() => {
    hashconnect.findLocalWallets();
    hashconnect.foundExtensionEvent.once((walletMetadata) => {
      if (walletMetadata) setIsWallet(true);
    });
  }, []);

  return (
    <div>
      <button type="button" onClick={(event) => onGetKey(event)} disabled={!isWallet}>Connect wallet</button>
    </div>
  );
}

export default Connect;
