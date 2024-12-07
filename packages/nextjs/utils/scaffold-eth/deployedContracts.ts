import { GenericContractsDeclaration } from "./contract";

const deployedContracts = {
  31337: {
    EventTicketing: {
      address: process.env.NEXT_PUBLIC_EVENT_TICKETING_ADDRESS || "0x0",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC721IncorrectOwner",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "eventId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "organizer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "startTime",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ticketPrice",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "maxAttendees",
              type: "uint256",
            },
          ],
          name: "EventCreated",
          type: "event",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "description",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "imageCID",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "startTime",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "endTime",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "venueName",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "streetAddress",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "city",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "state",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "postalCode",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "country",
                  type: "string",
                },
                {
                  internalType: "bool",
                  name: "isOnline",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "ticketPrice",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "maxAttendees",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "isPrivate",
                  type: "bool",
                },
              ],
              internalType: "struct EventTicketing.EventDetails",
              name: "eventDetails",
              type: "tuple",
            },
          ],
          name: "createEvent",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  },
  80002: {
    EventTicketing: {
      address: "0xFcA607E98c6950B194037934a4D1f75e9873814d",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC721IncorrectOwner",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "eventId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "organizer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "startTime",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ticketPrice",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "maxAttendees",
              type: "uint256",
            },
          ],
          name: "EventCreated",
          type: "event",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "description",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "imageCID",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "startTime",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "endTime",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "venueName",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "streetAddress",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "city",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "state",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "postalCode",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "country",
                  type: "string",
                },
                {
                  internalType: "bool",
                  name: "isOnline",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "ticketPrice",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "maxAttendees",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "isPrivate",
                  type: "bool",
                },
              ],
              internalType: "struct EventTicketing.EventDetails",
              name: "eventDetails",
              type: "tuple",
            },
          ],
          name: "createEvent",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
