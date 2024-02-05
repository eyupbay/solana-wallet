const fs = require("fs")
const wallet =require("./wallet")

let selectedWallet=1
let firstTime=true

const filePath = "wallet.json";
let jsonData = fs.readFileSync(filePath, "utf-8");
let data = JSON.parse(jsonData);

const readline = require('readline');
const { Keypair } = require("@solana/web3.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function operation(islem){
    switch(islem){
        case '1':
            console.log("");
            data.wallets?.map((wallet, index) => console.log(index + 1 + ". " + wallet.publicKey));
            console.log("");

            rl.question('Select a wallet (enter the corresponding number): ', (selectedWalletIndex) => {
                const index = parseInt(selectedWalletIndex) - 1;
                if (index >= 0 && index < data.wallets.length) {
                    selectedWallet = data.wallets[index].id;
                    console.log("\nSelected Wallet updated: " + data.wallets[index].publicKey + "\n");
                } else {
                    console.log("\nInvalid selection. Please try again.\n");
                }
                printMenu()
                main()
            });
            break;
        case '2':
          await wallet.createNewWalletAndSave();
          printMenu()
          break;
        
        case '3':
          rl.question('Enter a wallet transfer SOL : ', (toWallet) => {
                rl.question('Enter amount: ', async (amount) => {
                  // console.log(Keypair.fromSecretKey(data.wallets.find(wallet=>wallet.id===selectedWallet).secretKey))
                    await wallet.transfer(toWallet, Keypair.fromSecretKey(new Uint8Array(data.wallets.find(wallet=>wallet.id===selectedWallet).secretKey)),amount)
                    printMenu();
                    main();
                });
            });
            break;
        case '4':
          await wallet.refreshBalance(selectedWallet)
          printMenu()
          main()
          break;
        case '5':
          rl.question('Enter amount: ', async (airdrop) => {
                   await wallet.getAirdrop(selectedWallet,airdrop)
                    printMenu();
                    main();
                });
          break;
        default:
          console.log("Invalid.");
          printMenu();
          main();
    }
}

async function main() {
  jsonData = fs.readFileSync(filePath, "utf-8");
  data = JSON.parse(jsonData);
  if(firstTime){
    if(data.wallets.length===0){
      await wallet.createNewWalletAndSave()
      jsonData = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(jsonData);
    }
    printMenu()
    firstTime=false
  }
    rl.question('Choose : ', async (islem) => {
    await operation(islem);
    if (islem !== '0') {
      main();
    }
    else{
      rl.close()
    };
  });
}

function printMenu(){
    if(selectedWallet===0){ console.log("\nSelected Wallet : --- \n")}
    else{ console.log("Selected Wallet : " + data.wallets.filter((value)=>value.id===selectedWallet)[0]?.publicKey +"\n")}
    console.log("1. Select Another Wallet")
    console.log("2. Create New Wallet")
    console.log("3. Transfer SOL");
    console.log("4. Show Balance");
    console.log("5. Get Airdrop");
    console.log("0. Exit\n");
}

main()

rl.on('close', () => {
  console.log('Uygulama kapatıldı.');
});