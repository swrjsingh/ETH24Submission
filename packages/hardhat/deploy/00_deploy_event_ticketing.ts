import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🛫 Deploying EventTicketing...");

  const deployment = await deploy("EventTicketing", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Verify the contract on Polygonscan if not on a local network
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n📝 Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: deployment.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Polygonscan");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("Contract is already verified!");
      } else {
        console.log("❌ Error verifying contract:", error);
      }
    }
  }

  console.log("\n✅ Deployment completed!");
};

func.tags = ["EventTicketing"];
export default func;
