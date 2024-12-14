// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BetGame {
    enum Choice { Rock, Paper, Scissors } // Choices for the game

    struct Bet {
        address player;
        Choice choice;
        uint256 amount;
    }

    struct GameResult {
        address player1;
        Choice player1Choice;
        uint256 player1Amount;
        address player2;
        Choice player2Choice;
        uint256 player2Amount;
        address winner;
        uint256 reward;
    }

    Bet public lastBet; // Store the last pending bet
    address public owner; // Contract owner to manage funds
    mapping(address => Bet[]) public playerBets; // Store each player's bet history
    mapping(address => GameResult[]) public playerGameHistory; // Store player game history

    // Declare events to emit during game actions
    event BetPlaced(address indexed player, uint256 amount, Choice choice);
    event GameResultEvent(address indexed player1, Choice player1Choice, address indexed player2, Choice player2Choice, address winner, uint256 reward);
    event Withdraw(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender; // Set contract deployer as the owner
    }

    // Function to place a bet
    function placeBet(Choice _choice) external payable {
        require(msg.value > 0, "Bet amount must be greater than 0");

        // Log and store the player's bet
        Bet memory currentBet = Bet(msg.sender, _choice, msg.value);
        playerBets[msg.sender].push(currentBet);
        emit BetPlaced(msg.sender, msg.value, _choice);

        // If there's a previous bet, resolve the game
        if (lastBet.player != address(0)) {
            resolveGame(lastBet, currentBet);
        } else {
            // Store the new bet as the lastBet
            lastBet = currentBet;
        }
    }

    // Resolve the game and determine the winner
    function resolveGame(Bet memory bet1, Bet memory bet2) private {
        // If the two bets are from the same player, refund them
        if (bet1.player == bet2.player) {
            payable(bet1.player).transfer(bet1.amount + bet2.amount);
            // Clear the last bet
            delete lastBet;
            return;
        }

        address winner;
        uint256 reward = bet1.amount + bet2.amount;

        if (bet1.choice == bet2.choice) {
            // If it's a draw, refund both players
            payable(bet1.player).transfer(bet1.amount);
            payable(bet2.player).transfer(bet2.amount);
        } else if (
            (bet1.choice == Choice.Rock && bet2.choice == Choice.Scissors) ||
            (bet1.choice == Choice.Scissors && bet2.choice == Choice.Paper) ||
            (bet1.choice == Choice.Paper && bet2.choice == Choice.Rock)
        ) {
            // Player 1 wins
            winner = bet1.player;
        } else {
            // Player 2 wins
            winner = bet2.player;
        }

        if (winner != address(0)) {
            payable(winner).transfer(reward);
        }

        // Log the game result for both players
        GameResult memory gameResult = GameResult(
            bet1.player, bet1.choice, bet1.amount, 
            bet2.player, bet2.choice, bet2.amount, 
            winner, reward
        );
        playerGameHistory[bet1.player].push(gameResult);
        playerGameHistory[bet2.player].push(gameResult);

        emit GameResultEvent(bet1.player, bet1.choice, bet2.player, bet2.choice, winner, reward);

        // Reset lastBet after resolution
        delete lastBet;
    }

    // Allow the owner to withdraw funds (if any remain in the contract)
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
        emit Withdraw(owner, balance);
    }

    // Return the last bet for a specific player
    function getLastPlayerBet(address player) external view returns (GameResult memory) {
        require(playerGameHistory[player].length > 0, "No games played yet.");
        return playerGameHistory[player][playerGameHistory[player].length - 1];
    }

    // Return all bets for a specific player
    function getAllPlayerBets(address player) external view returns (Bet[] memory) {
        return playerBets[player];
    }
}
