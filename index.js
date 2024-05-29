const { AnkrProvider } = require("@ankr.com/ankr.js");
const converter = require("json-2-csv");
const fs = require("fs");

const provider = new AnkrProvider(
  "https://rpc.ankr.com/multichain/d0925d7d8bb99dbb56dca4102df8ebcbedd42614459f6c4354b3806d178f00fa"
);

let transferTemplate = {
  fromAddress: "",
  toAddress: "",
  contractAddress: "",
  value: "",
  blockchain: "",
  tokenName: "",
  tokenSymbol: "",
  tokenDecimals: "",
  transactionHash: "",
  blockHeight: "",
  timestamp: "",
  bridgeDirection: "",
  transactionLink: "",
  bridgeName: "",
};

const EXPLORERS = {
  eth: "https://etherscan.io/tx/<txhash>",
  arbitrum: "https://arbiscan.io/tx/<txhash>",
  avalanche: "https://snowtrace.io/tx/<txhash>",
  polygon: "https://polygonscan.com/tx/<txhash>",
  fantom: "https://ftmscan.com/tx/<txhash>",
  optimism: "https://optimism.etherscan.io/tx/<txhash>",
  bsc: "https://bscscan.com/tx/<txhash>",
};

const BRIDGES = [
  {
    name: "Multichain Bridge V2",
    data: [
      {
        chain: "arbitrum",
        addresses: [
          "0xc10ef9f491c9b59f936957026020c321651ac078",
          "0xc931f61b1534eb21d8c11b24f3f5ab2471d4ab50",
          "0x650af55d5877f289837c30b94af91538a7504b76",
        ],
      },
      {
        chain: "avalanche",
        addresses: [
          "0xc10ef9f491c9b59f936957026020c321651ac078",
          "0x4e13c3c78094e60cef02d87fd266cd7aed415f17",
          "0xb0731d50c681c45856bfc3f7539d5f61d4be81d8",
          "0xe5cf1558a1470cb5c166c2e8651ed0f3c5fb8f42",
          "0x833f307ac507d47309fd8cdd1f835bef8d702a93",
          "0x05f024c6f5a94990d32191d6f36211e3ee33504e",
          "0x0000000000000000000000000000000000000000"
        ],
      },
      {
        chain: "optimism",
        addresses: [
          "0xc10ef9f491c9b59f936957026020c321651ac078",
          "0xdc42728b0ea910349ed3c6e1c9dc06b5fb591f98",
        ],
      },
      {
        chain: "polygon",
        addresses: [
          "0xc10ef9f491c9b59f936957026020c321651ac078",
          "0x25864a712c80d33ba1ad7c23cffa18b46f2fc00c",
          "0x4f3aff3a747fcade12598081e80c6605a8be192f",
          "0x6ff0609046a38d76bd40c5863b4d1a2dce687f73",
          "0x72c290f3f13664b024ee611983aa2d5621ebe917",
        ],
      },
      {
        chain: "bsc",
        addresses: [
          "0xc10ef9f491c9b59f936957026020c321651ac078",
          "0x92c079d3155c2722dbf7e65017a5baf9cd15561c",
          "0xd1c5966f9f5ee6881ff6b261bbeda45972b1b5f3",
          "0xabd380327fe66724ffda91a87c772fb8d00be488",
          "0xe1d592c3322f1f714ca11f05b6bc0efef1907859",
          "0x0000000000000000000000000000000000000000",
        ],
      },
      {
        chain: "fantom",
        addresses: [
          "0xc10ef9f491c9b59f936957026020c321651ac078",
          "0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4",
          "0xb576c9403f39829565bd6051695e2ac7ecf850e2",
          "0x8ce95561ec220df4178899dd3c500daae2b5f5bd",
          "0x0000000000000000000000000000000000000000",
        ],
      },
    ],
  },
  // {
  //   name: "Arbitrum Native Bridge",
  //   data: [
  //     {
  //       chain: "eth",
  //       addresses: [
  //         "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f",
  //         "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a",
  //         "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840",
  //         "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40",
  //         "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a",
  //         "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
  //         "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
  //         "0xcEe284F754E854890e311e3280b767F80797180d",
  //         "0xd92023E9d9911199a6711321D1277285e6d4e2db",
  //         "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933",
  //         "0x09e9222E96E7B4AE2a407B98d48e330053351EEe",
  //         "0x096760F208390250649E3e8763348E783AEF5562",
  //         "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B",
  //         "0x000000000000000000000000000000000000006E",
  //       ],
  //     },
  //     {
  //       chain: "arbitrum",
  //       addresses: [
  //         "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f",
  //         "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a",
  //         "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840",
  //         "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40",
  //         "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a",
  //         "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
  //         "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
  //         "0xcEe284F754E854890e311e3280b767F80797180d",
  //         "0xd92023E9d9911199a6711321D1277285e6d4e2db",
  //         "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933",
  //         "0x09e9222E96E7B4AE2a407B98d48e330053351EEe",
  //         "0x096760F208390250649E3e8763348E783AEF5562",
  //         "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B",
  //         "0x000000000000000000000000000000000000006E",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Avalanche Native Bridge",
  //   data: [
  //     {
  //       chain: "eth",
  //       addresses: [
  //         "0x8EB8a3b98659Cce290402893d0123abb75E3ab28",
  //         "0xEb1bB70123B2f43419d070d7fDE5618971cc2F8f",
  //         "0xdac7bb7ce4ff441a235f08408e632fa1d799a147",
  //         "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
  //       ],
  //     },
  //     {
  //       chain: "avalanche",
  //       addresses: [
  //         "0x8EB8a3b98659Cce290402893d0123abb75E3ab28",
  //         "0xEb1bB70123B2f43419d070d7fDE5618971cc2F8f",
  //         "0xdac7bb7ce4ff441a235f08408e632fa1d799a147",
  //         "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Wormhole Portal Bridge",
  //   data: [
  //     {
  //       chain: "eth",
  //       addresses: [
  //         "0x98f3c9e6e3face36baad05fe09d375ef1464288b",
  //         "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
  //         "0xf92cd566ea4864356c5491c177a430c222d7e678",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Polygon Native Bridge",
  //   data: [
  //     {
  //       chain: "eth",
  //       addresses: [
  //         "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
  //         "0x158d5fa3ef8e4dda8a5367decf76b94e7effce95",
  //         "0xd505c3822c787d51d5c2b1ae9adb943b2304eb23",
  //         "0x499a865ac595e6167482d2bd5a224876bab85ab4",
  //         "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
  //         "0xfa7d2a996ac6350f4b56c043112da0366a59b74c",
  //         "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf",
  //         "0x8484ef722627bf18ca5ae6bcf031c23e6e922b30",
  //         "0x401f6c983ea34274ec46f84d70b31c151321188b",
  //       ],
  //     },
  //     {
  //       chain: "polygon",
  //       addresses: [
  //         "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
  //         "0x158d5fa3ef8e4dda8a5367decf76b94e7effce95",
  //         "0xd505c3822c787d51d5c2b1ae9adb943b2304eb23",
  //         "0x499a865ac595e6167482d2bd5a224876bab85ab4",
  //         "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
  //         "0xfa7d2a996ac6350f4b56c043112da0366a59b74c",
  //         "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf",
  //         "0x8484ef722627bf18ca5ae6bcf031c23e6e922b30",
  //         "0x401f6c983ea34274ec46f84d70b31c151321188b",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Multichain Bridge",
  //   data: [
  //     {
  //       chain: "eth",
  //       addresses: [
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //     {
  //       chain: "arbitrum",
  //       addresses: [
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //     {
  //       chain: "optimism",
  //       addresses: [
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //     {
  //       chain: "polygon",
  //       addresses: [
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //     {
  //       chain: "avalanche",
  //       addresses: [
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x8186359af5f57fbb40c6b14a588d2a59c0c29880",
  //         "0x6B25532e1060CE10cc3B0A99e5683b91BFDe6982",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //     {
  //       chain: "fantom",
  //       addresses: [
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //     {
  //       chain: "bsc",
  //       addresses: [
  //         "0x400b971099e0ebFDa2C03a3063739cb5398734A6",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0xC10Ef9F491C9B59f936957026020C321651ac078",
  //         "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
  //         "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
  //         "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
  //         "0x13b432914a996b0a48695df9b2d701eda45ff264",
  //         "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
  //         "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
  //         "0x10c6b61dbf44a083aec3780acf769c77be747e23",
  //         "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
  //         "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
  //         "0x6b7a87899490ece95443e979ca9485cbe7e71522",
  //         "0x765277eebeca2e31912c9946eae1021199b39c61",
  //         "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Synapse Bridge",
  //   data: [
  //     {
  //       chain: "eth",
  //       addresses: [
  //         "0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8",
  //         "0xFE986b20d34df3Aa9fA2e4d18b8EBe5AC6c753b0",
  //         "0x5217c83ca75559B1f8a8803824E5b7ac233A12a1",
  //         "0x7b3c1f09088bdc9f136178e170ac668c8ed095f2",
  //         "0x07cA54031c81a76fc943d00CE2423FA8f60C7B17",
  //         "0x1BFE50bb2A8a75fefa46892dB10313898dDbFf8F",
  //         "0x6571d6be3d8460CF5F7d6711Cd9961860029D85F",
  //         "0x6C8c6E68604e78B549C96907bfe9EBdaaC04e3B3",
  //         "0x47B35974cDC9Bb460e71aFf6C7B4FC758f3Bd932",
  //         "0x9413b54f04c90ed8EB59a08323D767b72Dcd278e",
  //         "0x544450Ffdfa5EA20528F21918E8aAC7B2C733381",
  //         "0x88E7af57270F70BCF32CD61fff0Ff635775C8f7c",
  //         "0xd10eF2A513cEE0Db54E959eF16cAc711470B62cF",
  //         "0x2D8Ee8d6951cB4Eecfe4a79eb9C2F973C02596Ed",
  //         "0xa2569370A9D4841c9a62Fc51269110F2eB7E0171",
  //         "0xbCefB397a13528F693D929931248C94c4263B763",
  //         "0xB34C67DB5F0Fd8D3D4238FD0A1cBbfD50a72e177",
  //         "0x244268b9082E05a8BcF18b3b0e83999EA4Fc9fCf",
  //         "0x93124c923dA389Bc0f13840fB822Ce715ca67ED6",
  //         "0x5A5fFf6F753d7C11A56A52FE47a177a87e431655",
  //         "0x11199A9eE50127F335B84A1eEb961D8A85147f5F",
  //         "0x2796317b0fF8538F253012862c06787Adfb8cEb6",
  //         "0x31fe393815822edacBd81C2262467402199EFD0D",
  //         "0x2796317b0fF8538F253012862c06787Adfb8cEb6",
  //         "0x3c726E4eb2e0b36cA3097EE4F5Cd4739D7Cdc750",
  //         "0x846E607B930Ea1F5DDE6c4a9D9104d5fbfAfa157",
  //         "0x647489df0673E17dB3163c47d5233EBB6F5cAc70",
  //       ],
  //     },
  //     {
  //       chain: "arbitrum",
  //       addresses: [
  //         "0x9Dd329F5411466d9e0C488fF72519CA9fEf0cb40",
  //         "0xffd73E0642e8833cCE9854B963840A8cb2A218e8",
  //         "0x544450Ffdfa5EA20528F21918E8aAC7B2C733381",
  //         "0x432036208d2717394d2614d6697c46DF3Ed69540",
  //         "0x37f9aE2e0Ea6742b9CAD5AbCfB6bBC3475b3862B",
  //         "0xE1e1e6711bDfa0b8DEC900F9E677D85aA7F3049d",
  //         "0x911766fA1a425Cb7cCCB0377BC152f37F276f8d6",
  //         "0x9f72004d0Ff5cCF2857a3564F7B3329057D15599",
  //         "0xc36501845A90FC7D9B4B08F3aeBBC27B1401d586",
  //         "0xfFC2d603fde1F99ad94026c00B6204Bb9b8c36E9",
  //         "0x73186f2Cf2493f20836b17b21ae79fc12934E207",
  //         "0xf07d1C752fAb503E47FEF309bf14fbDD3E867089",
  //         "0xE1b8800c33672A495ae2CBC882c14E7c9438166C",
  //         "0x4cDacbb74E86e2E18c35ae9D97B9427A0ADA8007",
  //         "0x9695FA23b27022c7DD752B7d64bB5900677ECC21",
  //         "0xCe762CC8138F4fa55427403A33E95a3D492c0166",
  //         "0xE74f2e89d993a31B21A714Dcc531b34049373EF0",
  //         "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
  //         "0x97a7af2A0323e2a40B866Df3A5F1F389427C9b68",
  //         "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
  //         "0x809DC529f07651bD43A172e8dB6f4a7a0d771036",
  //         "0xd5609cD0e1675331E4Fb1d43207C8d9D83AAb17C",
  //         "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
  //         "0x1c3fe783a7c06bfAbd124F2708F5Cc51fA42E102",
  //       ],
  //     },
  //     {
  //       chain: "optimism",
  //       addresses: [
  //         "0x84A420459cd31C3c34583F67E0f0fB191067D32f",
  //         "0x8745773CC6e70577819BB76f51FA7640cece505F",
  //         "0xaC9b0B65e7CFc1DD482Ed9249a44e58c9C9086ed",
  //         "0x73783F028c60D463bc604cc53852C37C31dEC5e9",
  //         "0x061605c4Ad8825E3B6731875B409D77f19FD75C9",
  //         "0x73783F028c60D463bc604cc53852C37C31dEC5e9",
  //         "0x8c7d5f8A8e154e1B59C92D8FB71314A43F32ef7B",
  //         "0x470f9522ff620eE45DF86C58E54E6A645fE3b4A7",
  //         "0xe0fa08834465EcC36c494F2b6C87b82Ab7970413",
  //         "0xe8c610fcb63A4974F02Da52f0B4523937012Aaa0",
  //         "0x266557A864680A1401A3506c0eb72934BD13Bf59",
  //         "0xBD9b39B8cE8EC403a4B4F277a88d2dc4a44BACa1",
  //         "0x432036208d2717394d2614d6697c46DF3Ed69540",
  //         "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
  //         "0xE27BFf97CE92C3e1Ff7AA9f86781FDd6D48F5eE9",
  //         "0xf07d1C752fAb503E47FEF309bf14fbDD3E867089",
  //         "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
  //         "0x7ef7560789eE2cB301eC38c3C8B91bA8a94Cd1e4",
  //         "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
  //         "0x9508BF380c1e6f751D97604732eF1Bae6673f299",
  //         "0x22cdc93F53Ee3F6b8Ad66faD6f98915a5349950E",
  //         "0x5A5fFf6F753d7C11A56A52FE47a177a87e431655",
  //         "0x003107B3aeee133804eaBE7D1df200DdFbb51dCE",
  //         "0x121ab82b49B2BC4c7901CA46B8277962b4350204",
  //         "0x809DC529f07651bD43A172e8dB6f4a7a0d771036",
  //       ],
  //     },
  //     {
  //       chain: "polygon",
  //       addresses: [
  //         "0x85fCD7Dd0a1e1A9FCD5FD886ED522dE8221C3EE5",
  //         "0xA1f8890E39b4d8E33efe296D698fe42Fb5e59cC3",
  //         "0x612f3a0226463599CCBCAbFf89623904ef38BcB9",
  //         "0x1c6aE197fF4BF7BA96c66C5FD64Cb22450aF9cC8",
  //         "0x77aA7CB4B348f4b99C6364e40Bc5bF615FC6feb3",
  //         "0xe599161573d3eF4f767F696857A00C65Ac35bEdf",
  //         "0x1259aDC9f2a0410d0dB5e226563920A2d49f4454",
  //         "0x41E95B1F1c7849c50Bb9Caf92AB33302c0de945F",
  //         "0xe21a31315ddeA8200d73945AA06ACBb15DB92bFb",
  //         "0x7875Af1a6878bdA1C129a4e2356A3fD040418Be5",
  //         "0x1d4C2a246311bB9f827F4C768e277FF5787B7D7E",
  //         "0x0775632F3d2b8aa764E833C0E3Db6382882D0f48",
  //         "0xD2666441443DAa61492FFe0F37717578714a4521",
  //         "0xBa1001B33bB8294880bE56323d9D8634827Bcb0f",
  //         "0xAa959Ea09a10d1FACED135Cb4268AA942F64892C",
  //         "0xaB0D8Fc46249DaAcd5cB36c5F0bC4f0DAF34EBf5",
  //         "0x8F5BBB2BB8c2Ee94639E55d5F41de9b4839C1280",
  //         "0x966e35C01842D029cFceDdc7a7fEB937C2F62A8a",
  //         "0x8F5BBB2BB8c2Ee94639E55d5F41de9b4839C1280",
  //         "0xca3281e99E2b7A2a889158944c409bF41F3c140d",
  //         "0x0aDf879BD8215654AbDC354B66DBFdfB013d2362",
  //         "0xa12A034fe81A17d11593C1f85930D20090Ec1747",
  //       ],
  //     },
  //     {
  //       chain: "avalanche",
  //       addresses: [
  //         "0xED2a7edd7413021d440b09D654f3b87712abAB66",
  //         "0x77a7e60555bC18B4Be44C181b2575eee46212d44",
  //         "0xdd60483Ace9B215a7c019A44Be2F22Aa9982652E",
  //         "0x20B587484E75752Adac381aE577a7562E7f358c5",
  //         "0x55A0D01a419471DBC0d118966b703e21799B6824",
  //         "0x82d4aCF0DA013Ee3649C7eAdF5Db9093A7EFa7B0",
  //         "0xa6Fa14A446B1b86619De3c27D10eeaAd84a0FcCd",
  //         "0xE2F6d34fd09D21F4121d648E191e842Ac95Ac0Dc",
  //         "0x20A9DC684B4d0407EF8C9A302BEAaA18ee15F656",
  //         "0xAeEDaA1B2C4281CB938b7D64f17C832c0160A6B2",
  //         "0x0EF812f4c68DC84c22A4821EF30ba2ffAB9C2f3A",
  //         "0x003107B3aeee133804eaBE7D1df200DdFbb51dCE",
  //         "0xAe5C1c2E5778f40185A9580ACa4061B42De6f74B",
  //         "0xf07d1C752fAb503E47FEF309bf14fbDD3E867089",
  //         "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
  //         "0xe0fa08834465EcC36c494F2b6C87b82Ab7970413",
  //         "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
  //         "0x3a01521F8E7F012eB37eAAf1cb9490a5d9e18249",
  //         "0x432036208d2717394d2614d6697c46DF3Ed69540",
  //         "0xECD72d039362fbFC52F8A8724E720753c50aa3B1",
  //         "0xaeD5b25BE1c3163c907a471082640450F928DDFE",
  //         "0x22cdc93F53Ee3F6b8Ad66faD6f98915a5349950E",
  //         "0x84A420459cd31C3c34583F67E0f0fB191067D32f",
  //         "0x9508BF380c1e6f751D97604732eF1Bae6673f299",
  //         "0xC05e61d0E7a63D27546389B7aD62FdFf5A91aACE",
  //         "0xA8240475Cc153944974DCE4D13C3b8E27effA8D5",
  //         "0xC05e61d0E7a63D27546389B7aD62FdFf5A91aACE",
  //         "0x1BFE50bb2A8a75fefa46892dB10313898dDbFf8F",
  //         "0x07cA54031c81a76fc943d00CE2423FA8f60C7B17",
  //         "0xa4666f8E6DBf504BBC2dB7B005743ce7d8efacBB",
  //       ],
  //     },
  //     {
  //       chain: "fantom",
  //       addresses: [
  //         "0x85662fd123280827e11C59973Ac9fcBE838dC3B4",
  //         "0xE27BFf97CE92C3e1Ff7AA9f86781FDd6D48F5eE9",
  //         "0x8745773CC6e70577819BB76f51FA7640cece505F",
  //         "0xB003e75f7E0B5365e814302192E99b4EE08c0DEd",
  //         "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
  //         "0xE1e1e6711bDfa0b8DEC900F9E677D85aA7F3049d",
  //         "0x104127CCd4b1378898916894EB59c97E690b6E9E",
  //         "0x5d5F01AaEc428356B54Ee091502dBBEaA935F21A",
  //         "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
  //         "0xaeD5b25BE1c3163c907a471082640450F928DDFE",
  //         "0x266557A864680A1401A3506c0eb72934BD13Bf59",
  //         "0xE910dfaa50094C6BC1bF68E3CD7B244E9eC09D57",
  //         "0xDB9F78F5dD41B73b5020e841B29B5983408f5069",
  //         "0xd5609cD0e1675331E4Fb1d43207C8d9D83AAb17C",
  //         "0xa9E90579eb086bcdA910dD94041ffE041Fb4aC89",
  //         "0x809DC529f07651bD43A172e8dB6f4a7a0d771036",
  //         "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
  //         "0xf46837caB330Fdb14943cee6a119D0e4FCb0C1D1",
  //         "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
  //         "0x9508BF380c1e6f751D97604732eF1Bae6673f299",
  //         "0x22cdc93F53Ee3F6b8Ad66faD6f98915a5349950E",
  //         "0x003107B3aeee133804eaBE7D1df200DdFbb51dCE",
  //       ],
  //     },
  //     {
  //       chain: "bsc",
  //       addresses: [
  //         "0x28ec0B36F0819ecB5005cAB836F4ED5a2eCa4D13",
  //         "0xbE183e2Bd155D5e216e62De331Ab63Fd556ee0E2",
  //         "0x35e4edD1F12aBa7D0c46a8e48513a5B0B679C89c",
  //         "0xf0284FB86adA5E4D82555C529677eEA3B2C3E022",
  //         "0x749F37Df06A99D6A8E065dd065f8cF947ca23697",
  //         "0x2f6087c8cde8C866cafe44d0f32Ff27501Edcaeb",
  //         "0x6F6978e551B62d7E8Db2fe27d8dB8bFE5d94d009",
  //         "0x31F46645948567d44f151e7E18AF6Fc5F0b3EAC6",
  //         "0x6E42e97Dd28b3D531048202D29C4fD81d193344b",
  //         "0x907a1A777a7eE13A0d11728127f9B97C02Fa479d",
  //         "0xDE27892BAbFc5c30D4FE4e3478897F76D261cAeB",
  //         "0x8F5BBB2BB8c2Ee94639E55d5F41de9b4839C1280",
  //         "0x527a2ead8d1799d24d1889B33e98522970f9221F",
  //         "0x8027a7Fa5753c8873E130F1205DA9fB8691726Ab",
  //         "0x2eB78584b26a1E6dF23dB0b9c9D9034fe356D6c7",
  //         "0x1FB7B429e0713F77f038699001548062F4Bb242e",
  //         "0x37f9aE2e0Ea6742b9CAD5AbCfB6bBC3475b3862B",
  //         "0x5F10b4FC66331f53912a5B5EBA4E4e79a6fDAe93",
  //         "0x74c30263AD6723029CE302046EFe262bE7301C12",
  //         "0xd123f70AE324d34A9E76b67a27bf77593bA8749f",
  //         "0x2264C28147BA42A687B5F223C8CaD704Fefc11be",
  //         "0xd123f70AE324d34A9E76b67a27bf77593bA8749f",
  //         "0x5f300aEc9573BeC1ed161E07bB6564e03154e68A",
  //         "0xcCaBe4f1DaBcDa1ffb3EB3335c022DefF51dc1Db",
  //         "0x5B01dD15658EBA8CD294aC5dd59176D57d97d50c",
  //         "0xB6a9b0Be9b087716aCFd4805C2bB5b736aC62b38",
  //       ],
  //     },
  //   ],
  // },
];

const WALLET_ADDRESS = [
  {
    name: "ledger-live",
    address: "0x86beAa0B69bA37BDAdd77A8920EDcb3bC13D8219",
  },
  {
    name: "ledger-1",
    address: "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
  },
  {
    name: "ledger-2",
    address: "0x5847555C01e7B3ed23259d0f1A511E7A67177629",
  },
  {
    name: "ledger-3",
    address: "0xdC2836eF4b62AA7b570D1ef08111419A15e3a2da",
  },
  {
    name: "ledger-4",
    address: "0x0BCD459834338534AB925901B928373879161fB2",
  },
  {
    name: "ledger-6",
    address: "0xA3D73fa6ee6C4aC11c286FD0437aA91996725837",
  },
  {
    name: "ledger-7",
    address: "0x283C39f68EA4d83948D15A7335A7c86D892788e9",
  },
  {
    name: "ledger-8",
    address: "0xf9D46420B78284bfd79c5e38fDa15B9b0c1FF6AA",
  },
  {
    name: "ledger-9",
    address: "0xCb74692c8597ce64f4C8a3ffa30d2d6FeC727D7e",
  },
  {
    name: "ledger-10",
    address: "0x652a292360D744f3eEeaD4a6c5579443FAAa5f8C",
  },
  {
    name: "ledger-11",
    address: "0xFe5D96AdDe3378fCE259F09A05Ee36701274A359",
  },
  {
    name: "ledger-12",
    address: "0x82A182686964Ff915B3243f1145fEbcb271C5015",
  },
  {
    name: "ledger-19",
    address: "0xaf180Eca9f82f96B2Bbc4e1D08E82BC346F7D511",
  },
  {
    name: "ledger-20",
    address: "0x545b74CF29bF64373EF014320d580c0407F2dA79",
  },
  {
    name: "ledger-21",
    address: "0x212dA6c4E86546F5B0bfD5066B7a7585e55AEcaa",
  },
  {
    name: "metamask-cryptocats",
    address: "0xdfeed9486ec84905796c18fa483b9a44e3738b1d",
  },
  {
    name: "metamask-digits-1",
    address: "0x1c702f54Cb1317777304185F9c07580500C3969A",
  },
  {
    name: "metamask-digits-2",
    address: "0x6a7eeabeD9a8b429A47c35AeC27fD8bb0F551590",
  },
  {
    name: "metamask-digits-3",
    address: "0x62F58407c7388D5302c0586CE6C65b76176303da",
  },
  {
    name: "metamask-kekchain-1",
    address: "0x0883A5730570Dec7C0E813778F4C5bB20D8d2D82",
  },
  {
    name: "metamask-kekchain-2",
    address: "0x7f05C2E2B505097b10115F3C263BF5D835C884aC",
  },
  {
    name: "metamask-kekchain-3",
    address: "0x2e74348F91b8169FCB51e03c1fDE1C2888D9470B",
  },
  {
    name: "metamask-kekchain-4",
    address: "0x8FfBb62d34b970Fc37619776eED4B10dab38365E",
  },
  {
    name: "metamask-kekchain-5",
    address: "0x776c7052ED6ccaF62bbA61FDd5dF49207F64a8c0",
  },
  {
    name: "metamask-kekchain-6",
    address: "0x43c10FcC3ede758687D27FCF242d7A058C59c7b9",
  },
  {
    name: "metamask-kekchain-7",
    address: "0xaCb30a5eaAaBBF84ffAB6f2E7cc001ee8e5d0888",
  },
  {
    name: "metamask-kekchain-8",
    address: "0xCfc0C1430bfbe7585c871Da308F3B74C5E664CF8",
  },
  {
    name: "metamask-kekchain-10",
    address: "0xC621EC17A1C6411b49b13b1B6a93c5F86617569e",
  },
  {
    name: "coinbase-wallet-1",
    address: "0x72BE8CF156c8a0Fe9878a48305662fe862F7B395",
  },
  {
    name: "coinbase-wallet-2",
    address: "0xFe2f7DF3A01C7f0f6938255d12D42B70581f78Aa",
  },
  {
    name: "metamask-nfp",
    address: "0x54E3e6B0C8a369815e6931bCA806B12C9FaF48E2",
  },
];

async function processWallet(bridgeName, bridgeData, wallet) {
  // get token transfers like sending USDT
  let transfersResponse = await provider.getTokenTransfers({
    blockchain: bridgeData.chain,
    address: wallet.address,
    fromBlock: "earliest",
    toBlock: "latest",
    pageSize: 10000,
  });

  // delete unused columns
  let transfers = transfersResponse.transfers.map((row) => {
    delete row["valueRawInteger"];
    delete row["thumbnail"];
    row["bridgeDirection"] = "";
    row["transactionLink"] = EXPLORERS[row.blockchain].replace(
      "<txhash>",
      row.transactionHash
    );
    row["bridgeName"] = bridgeName;
    return {
      fromAddress: row.fromAddress.toLowerCase(),
      toAddress: row.toAddress.toLowerCase(),
      transactionHash: row.transactionHash.toLowerCase(),
      ...row,
    };
  });

  // get native transactions like sending ETH on Ethereum/Arbitrum
  let transactionsResponse = await provider.getTransactionsByAddress({
    blockchain: bridgeData.chain,
    address: wallet.address,
    fromBlock: "earliest",
    toBlock: "latest",
    pageSize: 10000,
  });
  let { transactions } = transactionsResponse;

  // delete unused columns
  const formattedTransactions = transactions.map((transaction) => {
    let { from, to, hash, timestamp, value, blockchain, blockNumber } =
      transaction;
    const formattedTransaction = {
      fromAddress: from.toLowerCase(),
      toAddress: to.toLowerCase(),
      contractAddress: "",
      value: (value / Math.pow(10, 18)).toFixed(4),
      blockchain,
      tokenName: "native coin",
      tokenSymbol: "",
      tokenDecimals: 18,
      transactionHash: hash.toLowerCase(),
      blockHeight: BigInt(blockNumber).toString(),
      timestamp: BigInt(timestamp).toString(),
      bridgeDirection: "",
      transactionLink: EXPLORERS[blockchain].replace("<txhash>", hash),
      bridgeName,
    };
    return formattedTransaction;
  });

  let nonDuplicateTransactions = formattedTransactions.filter((transaction) => {
    if (
      transfers.find(
        (transfer) => transfer.transactionHash == transaction.transactionHash
      )
    ) {
      return false;
    }
    return true;
  });

  transfers = [...transfers, ...nonDuplicateTransactions];

  let formattedBridgeAddresses = bridgeData.addresses.map((addr) =>
    addr.toLowerCase()
  );

  let filteredTransfers = transfers.reduce((arr, row) => {
    if (
      formattedBridgeAddresses.find((bAddress) => bAddress == row.fromAddress)
    ) {
      row["bridgeDirection"] = "receive";
      return [...arr, row];
    } else if (
      formattedBridgeAddresses.find((bAddress) => bAddress == row.toAddress)
    ) {
      row["bridgeDirection"] = "send";
      return [...arr, row];
    } else {
      return arr;
    }
  }, []);

  // if empty list, add headers only
  if (filteredTransfers.length == 0) {
    filteredTransfers = [transferTemplate];
  }

  const csv = await converter.json2csv(filteredTransfers);

  fs.writeFile(
    `${wallet.name}-${bridgeName}-${bridgeData.chain}.csv`,
    csv,
    (err) => {
      if (err) console.error(err);
      else console.log("Ok");
    }
  );
}

// console.log(BRIDGE_ADDRESS[1], WALLET_ADDRESS[1]);

// processWallet(BRIDGE_ADDRESS[1], WALLET_ADDRESS[1]);

async function main() {
  for (const bridge of BRIDGES) {
    for (const bridgeData of bridge.data) {
      for (const wallet of WALLET_ADDRESS) {
        try {
          await processWallet(bridge.name, bridgeData, wallet);
        } catch (e) {
          console.log(e);
        }
        console.log(
          "completed\nwallet: " +
            wallet.name +
            "\nbridge: " +
            bridge.name +
            "\nchain: " +
            bridgeData.chain
        );
      }
    }
  }
}

main()
  .then((response) => {
    console.log("main completed");
  })
  .catch((error) => {
    console.log(error);
  });

// done and recorded
// avax native
// arbitrum native
// polygon native
// multichain
// wormhole

// done and no results
// harmony native
// near rainbow bridge

function checkList() {
  let currentList = [
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0xdfeed9486ec84905796c18fa483b9a44e3738b1d",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x5847555c01e7b3ed23259d0f1a511e7a67177629",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xdc2836ef4b62aa7b570d1ef08111419a15e3a2da",

    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20F7C7E4b410af0D7309a04792FC22c7b4c7f46E",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",

    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",

    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",

    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc05e61d0e7a63d27546389b7ad62fdff5a91aace",
    "0x6a7eeabeD9a8b429A47c35AeC27fD8bb0F551590",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x8eb8a3b98659cce290402893d0123abb75e3ab28",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0xdc2836ef4b62aa7b570d1ef08111419a15e3a2da",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0xd123f70ae324d34a9e76b67a27bf77593ba8749f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",

    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6f4e8eba4d337f874ab57478acc2cb5bacdc19c9",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",

    "0x2796317b0ff8538f253012862c06787adfb8ceb6",
    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",

    "0x401f6c983ea34274ec46f84d70b31c151321188b",

    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",

    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",

    "0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f",

    "0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0xe1b8800c33672a495ae2cbc882c14e7c9438166c",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xecd72d039362fbfc52f8a8724e720753c50aa3b1",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xecd72d039362fbfc52f8a8724e720753c50aa3b1",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x0775632f3d2b8aa764e833c0e3db6382882d0f48",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xecd72d039362fbfc52f8a8724e720753c50aa3b1",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xecd72d039362fbfc52f8a8724e720753c50aa3b1",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xecd72d039362fbfc52f8a8724e720753c50aa3b1",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xa2569370a9d4841c9a62fc51269110f2eb7e0171",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x1c6ae197ff4bf7ba96c66c5fd64cb22450af9cc8",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f",

    "0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f",

    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",
    "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x7f05c2e2b505097b10115f3c263bf5d835c884ac",
    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x6a7eeabed9a8b429a47c35aec27fd8bb0f551590",

    "0x5847555c01e7b3ed23259d0f1a511e7a67177629",

    "0x5847555c01e7b3ed23259d0f1a511e7a67177629",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x1c6ae197ff4bf7ba96c66c5fd64cb22450af9cc8",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x0ef812f4c68dc84c22a4821ef30ba2ffab9c2f3a",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",

    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",

    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x20f7c7e4b410af0d7309a04792fc22c7b4c7f46e",

    "0x5847555c01e7b3ed23259d0f1a511e7a67177629",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0xacb30a5eaaabbf84ffab6f2e7cc001ee8e5d0888",

    "0xc621ec17a1c6411b49b13b1b6a93c5f86617569e",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x1c6ae197ff4bf7ba96c66c5fd64cb22450af9cc8",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x1c6ae197ff4bf7ba96c66c5fd64cb22450af9cc8",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x0ef812f4c68dc84c22a4821ef30ba2ffab9c2f3a",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x6571d6be3d8460cf5f7d6711cd9961860029d85f",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x37f9ae2e0ea6742b9cad5abcfb6bbc3475b3862b",

    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
    "0x749f37df06a99d6a8e065dd065f8cf947ca23697",
    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",

    "0x545b74cf29bf64373ef014320d580c0407f2da79",

    "0xaf180eca9f82f96b2bbc4e1d08e82bc346f7d511",
  ];

  let bridgesList = [
    "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f",
    "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a",
    "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840",
    "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40",
    "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a",
    "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
    "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
    "0xcEe284F754E854890e311e3280b767F80797180d",
    "0xd92023E9d9911199a6711321D1277285e6d4e2db",
    "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933",
    "0x09e9222E96E7B4AE2a407B98d48e330053351EEe",
    "0x096760F208390250649E3e8763348E783AEF5562",
    "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B",
    "0x000000000000000000000000000000000000006E",
    "0x8EB8a3b98659Cce290402893d0123abb75E3ab28",
    "0xEb1bB70123B2f43419d070d7fDE5618971cc2F8f",
    "0xdac7bb7ce4ff441a235f08408e632fa1d799a147",
    "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0",
    "0x98f3c9e6e3face36baad05fe09d375ef1464288b",
    "0x3ee18b2214aff97000d974cf647e7c347e8fa585",
    "0xf92cd566ea4864356c5491c177a430c222d7e678",
    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
    "0x158d5fa3ef8e4dda8a5367decf76b94e7effce95",
    "0xd505c3822c787d51d5c2b1ae9adb943b2304eb23",
    "0x499a865ac595e6167482d2bd5a224876bab85ab4",
    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
    "0xfa7d2a996ac6350f4b56c043112da0366a59b74c",
    "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf",
    "0x8484ef722627bf18ca5ae6bcf031c23e6e922b30",
    "0x401f6c983ea34274ec46f84d70b31c151321188b",

    "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
    "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
    "0xC10Ef9F491C9B59f936957026020C321651ac078",
    "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
    "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
    "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
    "0x13b432914a996b0a48695df9b2d701eda45ff264",
    "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
    "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
    "0x10c6b61dbf44a083aec3780acf769c77be747e23",
    "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
    "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
    "0x6b7a87899490ece95443e979ca9485cbe7e71522",
    "0x765277eebeca2e31912c9946eae1021199b39c61",
    "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",

    "0x400b971099e0ebFDa2C03a3063739cb5398734A6",
    "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
    "0xC10Ef9F491C9B59f936957026020C321651ac078",
    "0x1633D66Ca91cE4D81F63Ea047B7B19Beb92dF7f3",
    "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
    "0xC10Ef9F491C9B59f936957026020C321651ac078",
    "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
    "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
    "0x8efd012977DD5C97E959b9e48c04eE5fcd604374",
    "0x13b432914a996b0a48695df9b2d701eda45ff264",
    "0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
    "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
    "0x10c6b61dbf44a083aec3780acf769c77be747e23",
    "0x533e3c0e6b48010873b947bddc4721b1bdff9648",
    "0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284",
    "0x6b7a87899490ece95443e979ca9485cbe7e71522",
    "0x765277eebeca2e31912c9946eae1021199b39c61",
    "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",

    "0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8",
    "0xFE986b20d34df3Aa9fA2e4d18b8EBe5AC6c753b0",
    "0x5217c83ca75559B1f8a8803824E5b7ac233A12a1",
    "0x7b3c1f09088bdc9f136178e170ac668c8ed095f2",
    "0x07cA54031c81a76fc943d00CE2423FA8f60C7B17",
    "0x1BFE50bb2A8a75fefa46892dB10313898dDbFf8F",
    "0x6571d6be3d8460CF5F7d6711Cd9961860029D85F",
    "0x6C8c6E68604e78B549C96907bfe9EBdaaC04e3B3",
    "0x47B35974cDC9Bb460e71aFf6C7B4FC758f3Bd932",
    "0x9413b54f04c90ed8EB59a08323D767b72Dcd278e",
    "0x544450Ffdfa5EA20528F21918E8aAC7B2C733381",
    "0x88E7af57270F70BCF32CD61fff0Ff635775C8f7c",
    "0xd10eF2A513cEE0Db54E959eF16cAc711470B62cF",
    "0x2D8Ee8d6951cB4Eecfe4a79eb9C2F973C02596Ed",
    "0xa2569370A9D4841c9a62Fc51269110F2eB7E0171",
    "0xbCefB397a13528F693D929931248C94c4263B763",
    "0xB34C67DB5F0Fd8D3D4238FD0A1cBbfD50a72e177",
    "0x244268b9082E05a8BcF18b3b0e83999EA4Fc9fCf",
    "0x93124c923dA389Bc0f13840fB822Ce715ca67ED6",
    "0x5A5fFf6F753d7C11A56A52FE47a177a87e431655",
    "0x11199A9eE50127F335B84A1eEb961D8A85147f5F",
    "0x2796317b0fF8538F253012862c06787Adfb8cEb6",
    "0x31fe393815822edacBd81C2262467402199EFD0D",
    "0x2796317b0fF8538F253012862c06787Adfb8cEb6",
    "0x3c726E4eb2e0b36cA3097EE4F5Cd4739D7Cdc750",
    "0x846E607B930Ea1F5DDE6c4a9D9104d5fbfAfa157",
    "0x647489df0673E17dB3163c47d5233EBB6F5cAc70",

    "0x9Dd329F5411466d9e0C488fF72519CA9fEf0cb40",
    "0xffd73E0642e8833cCE9854B963840A8cb2A218e8",
    "0x544450Ffdfa5EA20528F21918E8aAC7B2C733381",
    "0x432036208d2717394d2614d6697c46DF3Ed69540",
    "0x37f9aE2e0Ea6742b9CAD5AbCfB6bBC3475b3862B",
    "0xE1e1e6711bDfa0b8DEC900F9E677D85aA7F3049d",
    "0x911766fA1a425Cb7cCCB0377BC152f37F276f8d6",
    "0x9f72004d0Ff5cCF2857a3564F7B3329057D15599",
    "0xc36501845A90FC7D9B4B08F3aeBBC27B1401d586",
    "0xfFC2d603fde1F99ad94026c00B6204Bb9b8c36E9",
    "0x73186f2Cf2493f20836b17b21ae79fc12934E207",
    "0xf07d1C752fAb503E47FEF309bf14fbDD3E867089",
    "0xE1b8800c33672A495ae2CBC882c14E7c9438166C",
    "0x4cDacbb74E86e2E18c35ae9D97B9427A0ADA8007",
    "0x9695FA23b27022c7DD752B7d64bB5900677ECC21",
    "0xCe762CC8138F4fa55427403A33E95a3D492c0166",
    "0xE74f2e89d993a31B21A714Dcc531b34049373EF0",
    "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
    "0x97a7af2A0323e2a40B866Df3A5F1F389427C9b68",
    "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
    "0x809DC529f07651bD43A172e8dB6f4a7a0d771036",
    "0xd5609cD0e1675331E4Fb1d43207C8d9D83AAb17C",
    "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
    "0x1c3fe783a7c06bfAbd124F2708F5Cc51fA42E102",

    "0x84A420459cd31C3c34583F67E0f0fB191067D32f",
    "0x8745773CC6e70577819BB76f51FA7640cece505F",
    "0xaC9b0B65e7CFc1DD482Ed9249a44e58c9C9086ed",
    "0x73783F028c60D463bc604cc53852C37C31dEC5e9",
    "0x061605c4Ad8825E3B6731875B409D77f19FD75C9",
    "0x73783F028c60D463bc604cc53852C37C31dEC5e9",
    "0x8c7d5f8A8e154e1B59C92D8FB71314A43F32ef7B",
    "0x470f9522ff620eE45DF86C58E54E6A645fE3b4A7",
    "0xe0fa08834465EcC36c494F2b6C87b82Ab7970413",
    "0xe8c610fcb63A4974F02Da52f0B4523937012Aaa0",
    "0x266557A864680A1401A3506c0eb72934BD13Bf59",
    "0xBD9b39B8cE8EC403a4B4F277a88d2dc4a44BACa1",
    "0x432036208d2717394d2614d6697c46DF3Ed69540",
    "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
    "0xE27BFf97CE92C3e1Ff7AA9f86781FDd6D48F5eE9",
    "0xf07d1C752fAb503E47FEF309bf14fbDD3E867089",
    "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
    "0x7ef7560789eE2cB301eC38c3C8B91bA8a94Cd1e4",
    "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
    "0x9508BF380c1e6f751D97604732eF1Bae6673f299",
    "0x22cdc93F53Ee3F6b8Ad66faD6f98915a5349950E",
    "0x5A5fFf6F753d7C11A56A52FE47a177a87e431655",
    "0x003107B3aeee133804eaBE7D1df200DdFbb51dCE",
    "0x121ab82b49B2BC4c7901CA46B8277962b4350204",
    "0x809DC529f07651bD43A172e8dB6f4a7a0d771036",

    "0x85fCD7Dd0a1e1A9FCD5FD886ED522dE8221C3EE5",
    "0xA1f8890E39b4d8E33efe296D698fe42Fb5e59cC3",
    "0x612f3a0226463599CCBCAbFf89623904ef38BcB9",
    "0x1c6aE197fF4BF7BA96c66C5FD64Cb22450aF9cC8",
    "0x77aA7CB4B348f4b99C6364e40Bc5bF615FC6feb3",
    "0xe599161573d3eF4f767F696857A00C65Ac35bEdf",
    "0x1259aDC9f2a0410d0dB5e226563920A2d49f4454",
    "0x41E95B1F1c7849c50Bb9Caf92AB33302c0de945F",
    "0xe21a31315ddeA8200d73945AA06ACBb15DB92bFb",
    "0x7875Af1a6878bdA1C129a4e2356A3fD040418Be5",
    "0x1d4C2a246311bB9f827F4C768e277FF5787B7D7E",
    "0x0775632F3d2b8aa764E833C0E3Db6382882D0f48",
    "0xD2666441443DAa61492FFe0F37717578714a4521",
    "0xBa1001B33bB8294880bE56323d9D8634827Bcb0f",
    "0xAa959Ea09a10d1FACED135Cb4268AA942F64892C",
    "0xaB0D8Fc46249DaAcd5cB36c5F0bC4f0DAF34EBf5",
    "0x8F5BBB2BB8c2Ee94639E55d5F41de9b4839C1280",
    "0x966e35C01842D029cFceDdc7a7fEB937C2F62A8a",
    "0x8F5BBB2BB8c2Ee94639E55d5F41de9b4839C1280",
    "0xca3281e99E2b7A2a889158944c409bF41F3c140d",
    "0x0aDf879BD8215654AbDC354B66DBFdfB013d2362",
    "0xa12A034fe81A17d11593C1f85930D20090Ec1747",

    "0xED2a7edd7413021d440b09D654f3b87712abAB66",
    "0x77a7e60555bC18B4Be44C181b2575eee46212d44",
    "0xdd60483Ace9B215a7c019A44Be2F22Aa9982652E",
    "0x20B587484E75752Adac381aE577a7562E7f358c5",
    "0x55A0D01a419471DBC0d118966b703e21799B6824",
    "0x82d4aCF0DA013Ee3649C7eAdF5Db9093A7EFa7B0",
    "0xa6Fa14A446B1b86619De3c27D10eeaAd84a0FcCd",
    "0xE2F6d34fd09D21F4121d648E191e842Ac95Ac0Dc",
    "0x20A9DC684B4d0407EF8C9A302BEAaA18ee15F656",
    "0xAeEDaA1B2C4281CB938b7D64f17C832c0160A6B2",
    "0x0EF812f4c68DC84c22A4821EF30ba2ffAB9C2f3A",
    "0x003107B3aeee133804eaBE7D1df200DdFbb51dCE",
    "0xAe5C1c2E5778f40185A9580ACa4061B42De6f74B",
    "0xf07d1C752fAb503E47FEF309bf14fbDD3E867089",
    "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
    "0xe0fa08834465EcC36c494F2b6C87b82Ab7970413",
    "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
    "0x3a01521F8E7F012eB37eAAf1cb9490a5d9e18249",
    "0x432036208d2717394d2614d6697c46DF3Ed69540",
    "0xECD72d039362fbFC52F8A8724E720753c50aa3B1",
    "0xaeD5b25BE1c3163c907a471082640450F928DDFE",
    "0x22cdc93F53Ee3F6b8Ad66faD6f98915a5349950E",
    "0x84A420459cd31C3c34583F67E0f0fB191067D32f",
    "0x9508BF380c1e6f751D97604732eF1Bae6673f299",
    "0xC05e61d0E7a63D27546389B7aD62FdFf5A91aACE",
    "0xA8240475Cc153944974DCE4D13C3b8E27effA8D5",
    "0xC05e61d0E7a63D27546389B7aD62FdFf5A91aACE",
    "0x1BFE50bb2A8a75fefa46892dB10313898dDbFf8F",
    "0x07cA54031c81a76fc943d00CE2423FA8f60C7B17",
    "0xa4666f8E6DBf504BBC2dB7B005743ce7d8efacBB",

    "0x85662fd123280827e11C59973Ac9fcBE838dC3B4",
    "0xE27BFf97CE92C3e1Ff7AA9f86781FDd6D48F5eE9",
    "0x8745773CC6e70577819BB76f51FA7640cece505F",
    "0xB003e75f7E0B5365e814302192E99b4EE08c0DEd",
    "0xA67b7147DcE20D6F25Fd9ABfBCB1c3cA74E11f0B",
    "0xE1e1e6711bDfa0b8DEC900F9E677D85aA7F3049d",
    "0x104127CCd4b1378898916894EB59c97E690b6E9E",
    "0x5d5F01AaEc428356B54Ee091502dBBEaA935F21A",
    "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
    "0xaeD5b25BE1c3163c907a471082640450F928DDFE",
    "0x266557A864680A1401A3506c0eb72934BD13Bf59",
    "0xE910dfaa50094C6BC1bF68E3CD7B244E9eC09D57",
    "0xDB9F78F5dD41B73b5020e841B29B5983408f5069",
    "0xd5609cD0e1675331E4Fb1d43207C8d9D83AAb17C",
    "0xa9E90579eb086bcdA910dD94041ffE041Fb4aC89",
    "0x809DC529f07651bD43A172e8dB6f4a7a0d771036",
    "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
    "0xf46837caB330Fdb14943cee6a119D0e4FCb0C1D1",
    "0xAf41a65F786339e7911F4acDAD6BD49426F2Dc6b",
    "0x9508BF380c1e6f751D97604732eF1Bae6673f299",
    "0x22cdc93F53Ee3F6b8Ad66faD6f98915a5349950E",
    "0x003107B3aeee133804eaBE7D1df200DdFbb51dCE",

    "0x28ec0B36F0819ecB5005cAB836F4ED5a2eCa4D13",
    "0xbE183e2Bd155D5e216e62De331Ab63Fd556ee0E2",
    "0x35e4edD1F12aBa7D0c46a8e48513a5B0B679C89c",
    "0xf0284FB86adA5E4D82555C529677eEA3B2C3E022",
    "0x749F37Df06A99D6A8E065dd065f8cF947ca23697",
    "0x2f6087c8cde8C866cafe44d0f32Ff27501Edcaeb",
    "0x6F6978e551B62d7E8Db2fe27d8dB8bFE5d94d009",
    "0x31F46645948567d44f151e7E18AF6Fc5F0b3EAC6",
    "0x6E42e97Dd28b3D531048202D29C4fD81d193344b",
    "0x907a1A777a7eE13A0d11728127f9B97C02Fa479d",
    "0xDE27892BAbFc5c30D4FE4e3478897F76D261cAeB",
    "0x8F5BBB2BB8c2Ee94639E55d5F41de9b4839C1280",
    "0x527a2ead8d1799d24d1889B33e98522970f9221F",
    "0x8027a7Fa5753c8873E130F1205DA9fB8691726Ab",
    "0x2eB78584b26a1E6dF23dB0b9c9D9034fe356D6c7",
    "0x1FB7B429e0713F77f038699001548062F4Bb242e",
    "0x37f9aE2e0Ea6742b9CAD5AbCfB6bBC3475b3862B",
    "0x5F10b4FC66331f53912a5B5EBA4E4e79a6fDAe93",
    "0x74c30263AD6723029CE302046EFe262bE7301C12",
    "0xd123f70AE324d34A9E76b67a27bf77593bA8749f",
    "0x2264C28147BA42A687B5F223C8CaD704Fefc11be",
    "0xd123f70AE324d34A9E76b67a27bf77593bA8749f",
    "0x5f300aEc9573BeC1ed161E07bB6564e03154e68A",
    "0xcCaBe4f1DaBcDa1ffb3EB3335c022DefF51dc1Db",
    "0x5B01dD15658EBA8CD294aC5dd59176D57d97d50c",
    "0xB6a9b0Be9b087716aCFd4805C2bB5b736aC62b38",
  ];

  let whitelist = WALLET_ADDRESS.map((wallet) => wallet.address.toLowerCase());

  currentList = currentList.map((a) => a.toLowerCase());
  bridgesList = bridgesList.map((bridge) => bridge.toLowerCase());
  whitelist = [...whitelist, ...bridgesList];

  currentList.forEach((a) => {
    if (!whitelist.find((b) => b == a)) {
      console.log("not in list: " + a);
    }
  });
}

// checkList();
