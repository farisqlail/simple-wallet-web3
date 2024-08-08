// Inisialisasi Web3
let web3;
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
        // Meminta akses akun jika diperlukan
        ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts) {
            console.log('MetaMask is enabled. Accounts:', accounts);
        });
    } catch (e) {
        console.log('User denied account access:', e);
    }
} else if (typeof window.web3 !== 'undefined') {
    // Menggunakan Mist/MetaMask provider lama
    web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('MetaMask is not installed!');
    alert('Please install MetaMask to use this dApp!');
}

// Alamat kontrak dan ABI (Application Binary Interface)
const contractAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B'; // Ganti dengan alamat kontrak yang di-deploy
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const walletContract = new web3.eth.Contract(contractABI, contractAddress);

async function getBalance() {
    const balance = await walletContract.methods.getBalance().call();
    document.getElementById('balance').innerText = web3.utils.fromWei(balance, 'ether');
}

async function deposit() {
    const accounts = await web3.eth.getAccounts();
    await walletContract.methods.deposit().send({
        from: accounts[0],
        value: web3.utils.toWei('1', 'ether')
    });
    getBalance();
}

async function withdraw() {
    const accounts = await web3.eth.getAccounts();
    await walletContract.methods.withdraw(web3.utils.toWei('1', 'ether')).send({
        from: accounts[0]
    });
    getBalance();
}

// Update balance setiap kali halaman dimuat
window.onload = getBalance;
