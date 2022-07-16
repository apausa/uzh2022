import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { IResponse } from '../../lib/types';
import postRecaptcha from './recaptcha.service';

function Recaptcha({ setIsHuman }: any) {
  const [token, setToken]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const { SITE_KEY } = process.env;

  const onGetResponse = (event: any): void => {
    event.preventDefault();
    const response: string = grecaptcha.getResponse();
    setToken(response);
  };

  const postResponse = async (): Promise<void> => {
    const { success }: IResponse = await postRecaptcha(token);
    setIsHuman(success);
  };

  useEffect(() => { if (token) postResponse(); }, [token]);

  return (
    <div>
      <form>
        <div className="g-recaptcha" data-sitekey={`${SITE_KEY}`} />
        <button
          type="button"
          onClick={(event) => onGetResponse(event)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Recaptcha;
