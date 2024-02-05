const {
  Transaction,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
  Connection,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const fs = require("fs");

const filePath = "wallet.json";
const jsonData = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(jsonData);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

 const createNewWalletAndSave = async () =>{
  const keypair = Keypair.generate();
  const balance = await connection.getBalance(keypair.publicKey);
  const newWallet = {
    id: data.wallets.length + 1,
    publicKey: keypair.publicKey.toString(),
    secretKey: Array.from(keypair.secretKey),
    balance: balance,
  };
  data.wallets.push(newWallet);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("\nWallet with " + keypair.publicKey.toString() +" address created.\n")
}

const transfer = async (to,from,amount)=> {
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount*LAMPORTS_PER_SOL,
    })
  );

  try {
    const signature = await sendAndConfirmTransaction(
    connection,
    transferTransaction,
    [from]
  );
  console.log("\nTransaction complete. Signature : " + signature);
  console.log("")
  } catch (error) {
    console.log(error)
  }
  
  
}

const refreshBalance = async (wallet)=>  {

  
    const balance = await connection.getBalance(Keypair.fromSecretKey(new Uint8Array(data.wallets.find(w=>w.id===wallet).secretKey)).publicKey)
    console.log("Balance : "+balance/LAMPORTS_PER_SOL +" SOL\n")
    
}

const getAirdrop = async (wallet,amount) => {
  let txhash = await connection.requestAirdrop(Keypair.fromSecretKey(new Uint8Array(data.wallets.find(w=>w.id===wallet).secretKey)).publicKey,1e9*amount)
  console.log("Successful. Signature : "+txhash)
}


module.exports = {
  createNewWalletAndSave,transfer,refreshBalance,getAirdrop
}
