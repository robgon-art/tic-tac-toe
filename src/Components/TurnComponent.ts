import { Component } from 'javascript-entity-component-system';
import { CellValue } from './BoardComponent';

/**
 * TurnComponent tracks the current turn and turn number
 * It is a pure data container following ECS principles
 */
export class TurnComponent implements Component {
    public name: string = 'TurnComponent';
    public state: { [key: string]: any } = {
        currentTurn: CellValue.X, // X goes first by default
        turnNumber: 1,
        firstPlayerSymbol: CellValue.X // Track who goes first (for new games)
    };

    /**
     * Creates a new TurnComponent
     * @param startingSymbol The symbol that goes first (X by default)
     */
    constructor(startingSymbol: CellValue = CellValue.X) {
        this.reset(startingSymbol);
    }

    /**
     * Resets the turn state
     * @param startingSymbol The symbol that should go first
     */
    public reset(startingSymbol: CellValue = CellValue.X): void {
        // Only X or O can be valid starting symbols
        if (startingSymbol === CellValue.Empty) {
            startingSymbol = CellValue.X;
        }

        this.state.currentTurn = startingSymbol;
        this.state.turnNumber = 1;
        this.state.firstPlayerSymbol = startingSymbol;
    }

    /**
     * Gets the current turn symbol
     * @returns The current turn (X or O)
     */
    public get currentTurn(): CellValue {
        return this.state.currentTurn;
    }

    /**
     * Gets the current turn number
     * @returns The current turn number (1-9)
     */
    public get turnNumber(): number {
        return this.state.turnNumber;
    }

    /**
     * Gets the symbol of player who goes first
     * @returns The first player's symbol (X or O)
     */
    public get firstPlayerSymbol(): CellValue {
        return this.state.firstPlayerSymbol;
    }

    /**
     * Advances to the next turn
     * @returns The new current turn symbol
     */
    public nextTurn(): CellValue {
        // Switch turns between X and O
        this.state.currentTurn = this.state.currentTurn === CellValue.X
            ? CellValue.O
            : CellValue.X;

        // Increment turn number
        this.state.turnNumber++;

        return this.state.currentTurn;
    }

    /**
     * Determines if it's X's turn
     * @returns True if it's X's turn, false otherwise
     */
    public isXTurn(): boolean {
        return this.state.currentTurn === CellValue.X;
    }

    /**
     * Determines if it's O's turn
     * @returns True if it's O's turn, false otherwise
     */
    public isOTurn(): boolean {
        return this.state.currentTurn === CellValue.O;
    }

    /**
     * Creates a deep copy of the current turn state
     * @returns A new TurnComponent with the same state
     */
    public clone(): TurnComponent {
        const clonedComponent = new TurnComponent(this.firstPlayerSymbol);
        clonedComponent.state.currentTurn = this.currentTurn;
        clonedComponent.state.turnNumber = this.turnNumber;
        return clonedComponent;
    }

    /**
     * Prepares for the next game by alternating who goes first
     */
    public prepareNextGame(): void {
        // Alternate who goes first in the next game
        const nextFirstPlayer = this.state.firstPlayerSymbol === CellValue.X
            ? CellValue.O
            : CellValue.X;

        this.reset(nextFirstPlayer);
    }
} 