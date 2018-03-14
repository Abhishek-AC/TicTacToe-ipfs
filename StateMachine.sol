pragma solidity ^0.4.11;

//import oracle from Oraclize
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";


// import lib for manipulating strings
import "github.com/willitscale/solidity-util/lib/Strings.sol";


contract StateMachine is usingOraclize{ 
    
    //contract constructor 
    function StateMachine()public  payable{
        newGame(); //sets state to inital state
    }
    
    //neede for solidity-util
    using Strings for string;

    //saves the states of the game 
    string[] states= new string[] (10);
    
    //keeps track of turn number
    uint public turn=0;
    
    //getter for acces from Web3-js
    function GetTurn() public view returns(uint){
        return turn;
    }
    
    //bool to see if Illegal moves where found after CheckState()
    bool public FunnyBuisness=false;
    
    //getter for acces from Web3-js
    function getFunnyBuisness() public view returns(bool){
        return FunnyBuisness;
    }
        
    // to keep track of Oraclize queries
    bytes32 Q1;
    bytes32 Q2;
    
    // used to save state returned from Oraclize Query
    string public stateBefore;
    string public stateToCheck;

    // can be called by player to compare last two states
    function checkForFunnyBuisness() public  payable {
        require(oraclize_getPrice("IPFS") < this.balance); // query costs 0.01$
            Q2= oraclize_query("IPFS", getState()); //send query and save ID for later differentiation
            Q1= oraclize_query("IPFS", getStateBefore()); 
    
    }
    
    
    // Oraclize calls this function two times as a response of the two queries
    function __callback(bytes32 myid, string result, bytes proof) public  {
        if (myid==Q2){
            stateToCheck = result;
            CheckState(); // after second Query gets answerd compare states
        }else if(myid==Q1){
            stateBefore=result;
        }
    }
    
    // compares two state strings
    function CheckState() public  {
        for(int i=2;i<int(stateBefore.length());i=i+2){
            //checks if an already played move is played again by opponend
            if(!stateBefore._substring(i,1).compareTo("w") && !stateBefore._substring(i,1).compareTo(stateToCheck._substring(i,1))){
                FunnyBuisness=true;
                break;
           }
        }
    }
    
    // initialize parameters for a new game
    function newGame() public{
        turn=0;
        addState("QmQWkhCHYAVRFB5bAeSn7ghM8xnvXQKm1g3ugapiqTkgqo"); //0,w,w,w,w,w,w,w,w,w turn:0 and all fields are white
        FunnyBuisness=false; //no illegal moves ate the start of the game
        }
    
    //adds a new state to state array
    function addState( string _ipfs ) public{
        states[turn]=_ipfs;
        turn++;
    }
    
    //gets last state added
    function getState() public view returns(string){ 
        return states[turn-1];
    }
    
    //gets state before last 
    function getStateBefore() public view returns(string){ 
        require(turn>=2);
        return states[turn-2];
    }
    
    

}
