import { Component } from 'javascript-entity-component-system';

/**
 * ScoreComponent tracks game scores for player, computer, and ties
 * It is a pure data container following ECS principles
 */
export class ScoreComponent implements Component {
    public name: string = 'ScoreComponent';
    public state: { [key: string]: any } = {
        playerScore: 0,
        computerScore: 0,
        ties: 0
    };

    /**
     * Creates a new ScoreComponent with initial scores
     * @param playerScore Initial player score
     * @param computerScore Initial computer score
     * @param ties Initial number of ties
     */
    constructor(
        playerScore: number = 0,
        computerScore: number = 0,
        ties: number = 0
    ) {
        this.state.playerScore = playerScore;
        this.state.computerScore = computerScore;
        this.state.ties = ties;
    }

    /**
     * Gets the player's score
     * @returns The player score
     */
    public get playerScore(): number {
        return this.state.playerScore;
    }

    /**
     * Sets the player's score
     * @param score The new player score
     */
    public set playerScore(score: number) {
        this.state.playerScore = score >= 0 ? score : 0;
    }

    /**
     * Gets the computer's score
     * @returns The computer score
     */
    public get computerScore(): number {
        return this.state.computerScore;
    }

    /**
     * Sets the computer's score
     * @param score The new computer score
     */
    public set computerScore(score: number) {
        this.state.computerScore = score >= 0 ? score : 0;
    }

    /**
     * Gets the number of ties
     * @returns The number of ties
     */
    public get ties(): number {
        return this.state.ties;
    }

    /**
     * Sets the number of ties
     * @param ties The new number of ties
     */
    public set ties(ties: number) {
        this.state.ties = ties >= 0 ? ties : 0;
    }

    /**
     * Increments the player score by 1
     * @returns The new player score
     */
    public incrementPlayerScore(): number {
        this.state.playerScore++;
        return this.state.playerScore;
    }

    /**
     * Increments the computer score by 1
     * @returns The new computer score
     */
    public incrementComputerScore(): number {
        this.state.computerScore++;
        return this.state.computerScore;
    }

    /**
     * Increments the ties count by 1
     * @returns The new number of ties
     */
    public incrementTies(): number {
        this.state.ties++;
        return this.state.ties;
    }

    /**
     * Gets the total number of games played
     * @returns Total games (player wins + computer wins + ties)
     */
    public getTotalGames(): number {
        return this.state.playerScore + this.state.computerScore + this.state.ties;
    }

    /**
     * Resets all scores to zero
     */
    public reset(): void {
        this.state.playerScore = 0;
        this.state.computerScore = 0;
        this.state.ties = 0;
    }

    /**
     * Creates a deep copy of the current score state
     * @returns A new ScoreComponent with the same state
     */
    public clone(): ScoreComponent {
        return new ScoreComponent(
            this.state.playerScore,
            this.state.computerScore,
            this.state.ties
        );
    }
} 