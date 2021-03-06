import axios from 'axios';

export async function checkBalance(isConnected) {
  try {
    // https://uzh.vercel.app/api/balance
    // http://localhost:3000/api/balance
    const { data: { isOwned } } = await axios.post('http://localhost:3000/api/balance', { isConnected });

    return isOwned;
  } catch {
    return false;
  }
}

export async function mintNft() {
  try {
    // https://uzh.vercel.app/api/mint
    // http://localhost:3000/api/mint
    const data = await axios.get('http://localhost:3000/api/balance');

    console.log('mintNft', data);
    return data.success;
  } catch {
    return false;
  }
}

export async function transferNft(isConnected) {
  try {
    // https://uzh.vercel.app/api/transfer
    // http://localhost:3000/api/transfer
    const data = await axios.post('http://localhost:3000/api/balance', { isConnected });

    console.log('transferNft', data);
    return data.success;
  } catch {
    return false;
  }
}
