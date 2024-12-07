import { Abi, Address, Hash, TransactionReceipt } from "viem";
import { useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import { Config } from "wagmi";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getTargetNetworks } from "~~/utils/scaffold-eth/networks";

type UpdatedArgs = {
  contractName: ContractName;
  functionName: string;
  args?: any[];
  value?: string;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
};

type TxResponse = {
  hash: Hash;
  wait: () => Promise<any>;
};

type ContractConfig = {
  abi: Abi;
  address: Address;
  chainId: number;
  functionName: string;
  args?: any[];
  value?: bigint;
};

type DeployedContractData = {
  address: Address;
  abi: Abi;
} | null;

/**
 * @dev wrapper for wagmi's useContractWrite hook which loads in deployed contract contract abi, address automatically
 * @param contractName - deployed contract name
 * @param functionName - name of the function to write
 * @param args - arguments for the function
 * @param value - value in ETH that will be sent with transaction
 */
export const useScaffoldContractWrite = ({
  contractName,
  functionName,
  args,
  value,
  onSuccess,
  onError,
}: UpdatedArgs) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName) as { data: DeployedContractData };
  const writeTx = useTransactor();
  const configuredNetwork = getTargetNetworks()[0]; // Use first network as default

  // Only create config if we have the required data
  const contractConfig = deployedContractData
    ? {
        abi: deployedContractData.abi,
        address: deployedContractData.address,
        chainId: configuredNetwork.id,
        functionName,
        args,
        value: value ? BigInt(value) : undefined,
      }
    : undefined;

  const {
    data: txData,
    error,
    isPending,
    writeContract,
    writeContractAsync,
  } = useContractWrite({
    mutation: {
      onError: (err: Error) => {
        if (onError) {
          onError(err);
        }
        notification.error(err.message || "Transaction failed");
      },
    },
    ...contractConfig,
  });

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    chainId: configuredNetwork.id,
    ...(txData && {
      hash: txData,
      onSuccess: async (receipt: TransactionReceipt) => {
        if (writeTx && receipt) {
          await writeTx(() => Promise.resolve(receipt.transactionHash));
        }
        if (onSuccess) {
          onSuccess(receipt);
        }
        notification.success("Transaction confirmed");
      },
    }),
  });

  const isLoading = isPending || isConfirming;

  return {
    data: txData,
    error,
    isLoading,
    write: writeContract,
    writeAsync: writeContractAsync,
  };
};
