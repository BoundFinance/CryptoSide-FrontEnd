export const conciseAddress = (address, startSlice = 6, endSlice = 3) => {

  if (address) {
    return `${address.slice(0, startSlice)}...${address.slice(
      address.length - endSlice,
      address.length
    )}`;

  }

  return '';

};



// sum of numbers 
export function sumArrayWithReduce(arr) {
  return arr.reduce((accumulator, currentValue) =>  accumulator + currentValue, 0);
}


export const getWalletBalance = async (chainId, account) => {
  if (chainId && account) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': 'MM5IJDab0w6OLJfD9x4wHYzG0LcMUyBPdbadDKav3L54LCmxoaC3nr213TMJeYVg'
      },
    };

    const data = await fetch(`https://deep-index.moralis.io/api/v2/wallets/balances?chain=${chainId}&wallet_addresses%5B0%5D=${account}`, options)
      .then(response => response.json())
    return data
  }
  return null
};


export function createArrayWithDefaultValue(length, defaultValue) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Input length must be a positive integer');
  }

  return new Array(length).fill(defaultValue);
}
 
export function convertInputTimeFormat(time24Hour) {
  const [date, timeValue] = time24Hour.split('T');
  const [hours, minutes,] = timeValue.split(':');
   
  return {date, hours:Number(hours), minutes:Number(minutes) };
}

export function convertTimestampToDateTime(timestamp) {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const dateValue = `${year}-${month}-${day}T${hours}:${minutes}`;

  return dateValue ;
}



// export function convertTimestampToFormattedDate(timestamp) {
//   const regularTimestamp = Number(timestamp); // Convert the BigInt to a regular number
//   const date = new Date(timestamp * 1000); // Convert to milliseconds

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');

//   const dateFormate = `${year}-${month}-${day}`;
//   const timehor = Number(hours);
//   const timeMinutes = Number(minutes);
//   return {date:dateFormate, hours:timehor, minutes:timeMinutes};
// }

export function convertTimestampToFormattedDate(timestamp) {
  const regularTimestamp = Number(timestamp); // Convert the BigInt to a regular number
  const date = new Date(timestamp * 1000); // Convert to milliseconds

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const dateFormate = `${year}-${month}-${day}T${hours}-${minutes}-00`;
  return dateFormate;
}