// const { compileContract } = require('../lib/compileContract');
// const { deployContract } = require('../lib/deployContract');

// const getMPTProof = (req, res, next) => {
//   if (req.body && req.body.contractName) {
//     var contractName = req.body.contractName;
//     compileContract(contractName);
//     console.log('Successfully compiled the contract using Express.js Middleware');
//     next();
//   } else {
//     res.status(401).json({
//       message: "Error: No Contract Name provided"
//     });
//     console.error('Error: No Contract Name provided: ', error);
//     next(error);
//     return;
//   }
// }

// const deploy = (req, res, next) => {
//   var contractName = req.body.contractName;
//   var contractAddress = deployContract(contractName);
//   res.contractAddress = contractAddress;
//   console.log('Successfully deployed the contract using Express.js Middleware');
//   next();
// }

const getMPTProof = (req: any, res: any, next: any) => {
  // TODO
}

const readBlockHeader = (req: any, res: any) => {
//   stateRoot = res.stateRoot;
//   // Return contract address in response object
//   res.json({
//     stateRoot: stateRoot
//   })
}

const getProof = (req: any, res: any) => {
//   proof = res.proof;
//   // Return proof in response object
//   res.json({
//     proof: proof
//   })
}

export {
  getMPTProof,
  readBlockHeader,
  getProof
}
