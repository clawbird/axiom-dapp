import { ethers } from 'ethers';

function convertNumbersToHex(obj: any) {
  const convertedObj: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "number") {
        convertedObj[key] = ethers.toBeHex(value);
      } else {
        convertedObj[key] = value;
      }
    }
  }

  return convertedObj;
}

export default convertNumbersToHex;
