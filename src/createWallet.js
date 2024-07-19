const fs = require('fs');
const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const path = require('path');

// Definindo a Rede (testnet - bitcoin rede de teste)
const network = bitcoin.networks.testnet;

// Caminho de derivação (carteiras HD)
const derivationPath = `m/49'/1'/0'/0`; // 84' P2WPKH, (onde : 0' MainNet, 1' Testnet)

// Criando as palavras para o seed (senha)
const mnemonic = bip39.generateMnemonic();
const seed = bip39.mnemonicToSeedSync(mnemonic);

// Raiz da carteira
const root = bip32.fromSeed(seed, network);

// Criando a conta (chave privada/publica)
const account = root.derivePath(derivationPath);
const node = account.derive(0).derive(0);

// Endereço
const btcAddress = bitcoin.payments.p2wpkh({
    pubkey: node.publicKey,
    network: network
}).address;

// Exibindo informações no console
console.log("Carteira gerada");
console.log("Endereço: ", btcAddress);
console.log("Chave privada: ", node.toWIF());
console.log("Seeds:", mnemonic);

// Salvando as seeds em um documento de texto na pasta data
const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

const seedFilePath = path.join(dataPath, 'seeds.txt');
fs.writeFileSync(seedFilePath, `Mnemonic: ${mnemonic}\nAddress: ${btcAddress}\nPrivate Key: ${node.toWIF()}`);

console.log(`As seeds foram salvas em: ${seedFilePath}`);
