
//dependecies
var ipfsAPI = require('ipfs-api')
var Web3 = require('web3')

// create web3 instance
var web3 = new Web3(Web3.givenProvider)

// Checking if Web3 has been injected by the browser (MetaMask)
if (typeof web3 !== 'undefined') {
  // Use MetaMask provider
  console.log("MetaMask: injected web3 successfully")
} else {
  console.log('No web3? You should consider trying MetaMask!')
}

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

var myAddress="METAMASK-ADDRESS";

//address of contract instance ON ROPSTEN TESTNET
var contractAddress="0x266114dfc8166ce3cc475e19677322ba29c0ef79" 

//used to create JS object for SC
var contractABI=[
  {
    "constant": true,
    "inputs": [],
    "name": "FunnyBuisness",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "turn",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "stateToCheck",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "stateBefore",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "GetTurn",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getStateBefore",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getFunnyBuisness",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getState",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "CheckState",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "newGame",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "myid",
        "type": "bytes32"
      },
      {
        "name": "result",
        "type": "string"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "myid",
        "type": "bytes32"
      },
      {
        "name": "result",
        "type": "string"
      },
      {
        "name": "proof",
        "type": "bytes"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_ipfs",
        "type": "string"
      }
    ],
    "name": "addState",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "checkForFunnyBuisness",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  }
];

//create javaScript object to interact with
var stateContract = new web3.eth.Contract(contractABI,contractAddress); 


// gets turn of current game and calls startGame()
getTurnState();

//helper
function getTurnState(){
  stateContract.methods.GetTurn().call().then(startGame);
}

// gets turn from SC and decides to create a new game or follow to existing one
function startGame(turn){
  if(turn!==1){
    stateContract.methods.newGame()
    .send({from:myAddress}).then(function(res){
    startInterval();  // starts watching for new states //TODO use solidty events for that
    console.log("New game started!")
    console.log(res); //logs information of block 
    })
  }else{
    console.log("connected to game!");
    startInterval();
  }
}

// responses to html elements 
document.getElementById("1").onclick = function(){drawhere("1")};
document.getElementById("2").onclick = function(){drawhere("2")};
document.getElementById("3").onclick = function(){drawhere("3")};
document.getElementById("4").onclick = function(){drawhere("4")};
document.getElementById("5").onclick = function(){drawhere("5")};
document.getElementById("6").onclick = function(){drawhere("6")};
document.getElementById("7").onclick = function(){drawhere("7")};
document.getElementById("8").onclick = function(){drawhere("8")};
document.getElementById("9").onclick = function(){drawhere("9")};
document.getElementById("check").onclick = function(){
  checkIllegalMoves()
  console.log("Investigation started....")     
};
document.getElementById("update").onclick = function(){updateState()}; //used to manualy get latest state


//monitor SC to check if new state got added
var interval;
function startInterval(){
  interval =setInterval(function(){updateState();},4000) // update 4sec.
}

//helper
function updateState(){
  stateContract.methods.getState().call().then(display);
}

//get hash from Smart Contract and pull state from IPFS
function display (toGet) {
  var newState=[];

    ipfs.files.cat(toGet, (err, data) => {
    if (err) { return console.error('ipfs cat error', err) }
      newState=String(data).split(','); // string into array
      //set state to last one on chain
      setState(newState)
      })
  }



// calls check function in SC
function checkIllegalMoves(){
  stateContract.methods.checkForFunnyBuisness()
  .send({from:myAddress})
  .then(function(res){
    console.log("Query was sent to Oraclize, waiting for answer....(can take up to 1 min.)");
    console.log(res);
    startIntervalFB(); // starts looking for response from SC //TODO use events for this
    count=0; //timeout counter 
  })
}

//used to monitor response //TODO use events for this!!!
var intervalFB;
var count=0;
function startIntervalFB(){
  intervalFB =setInterval(function(){checkFB();},2000) //checks if __callback function was called
}
function checkFB(){
  stateContract.methods.getFunnyBuisness().call().then(Show);
}
function Show(illegalMoves){
    if(illegalMoves==true){
      console.log("Illegal moves where found: Opponend will be punished!")
      clearInterval(intervalFB);
    }else{
      count++;
    }
    //Oraclize stops if IPFS file is not found within 50sec
    if(count==25){
      console.log("No illegal moves found or Oraclize timeout")
      clearInterval(intervalFB);
    }
}


//function to add a move
function drawhere(_id){
      //change html appearence
      if(state[0]%2==0){
        state[_id]="b";
      }else{
        state[_id]="r";
      }
      setState(state)
      state[0]++; //increas turn
      clearInterval(interval); // dont look at last state utill its added to Blockchain
      store() //calles function to store on SC
      console.log("turn: " +state[0])//logas current turn 
    }


//new state after move //TODO an be done better
function setState(_state){
    for(i=1;i<10;i++){
      document.getElementById(i).className=_state[i]
    }
    state=_state
}

// add state to IPFS and hash to SmartContract
function store () {
  var toStore = state.toString(); //current state of board

  ipfs.files.add(Buffer.from(toStore), (err, res) => {
    if (err || !res) {
      return console.error('ipfs add error', err, res)
    }

    res.forEach((file) => {
      if (file && file.hash) {

        console.log('successfully stored state at:', file.hash)
        setContractState(file.hash); // add hash to SC
        ipfs.ls(file.hash, function (err, files) { //not sure if needed
        files.forEach((fileing) => {
        console.log(fileing.path)
            })
          })  
        }
      })
    })
  }

//calls SC function with ipfs hash as arguments
function setContractState(_stateHash){
  stateContract.methods.addState(_stateHash)
  .send({from:myAddress})
  .then(function(res){
    startInterval(); // after new state added start looking again for new states
    console.log(res);
  })
}



