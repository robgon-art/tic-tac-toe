import { Component } from 'javascript-entity-component-system';
import { CellValue } from './BoardComponent';

// Player types
export enum PlayerType {
    Human = 'human',
    Computer = 'computer'
}

/**
 * PlayerComponent represents a player in the game
 * It is a pure data container following ECS principles
 */
export class PlayerComponent implements Component {
    public name: string = 'PlayerComponent';
    public state: { [key: string]: any } = {
        playerType: PlayerType.Human,
        symbol: CellValue.X
    };

    /**
     * Creates a new PlayerComponent
     * @param playerType The type of player (human/computer)
     * @param symbol The symbol used by the player (X/O)
     */
    constructor(playerType: PlayerType = PlayerType.Human, symbol: CellValue = CellValue.X) {
        this.state.playerType = playerType;
        this.state.symbol = symbol;
    }

    /**
     * Gets the player type
     * @returns The player type (human/computer)
     */
    public get playerType(): PlayerType {
        return this.state.playerType;
    }

    /**
     * Sets the player type
     * @param type The player type to set
     */
    public set playerType(type: PlayerType) {
        this.state.playerType = type;
    }

    /**
     * Gets the player's symbol
     * @returns The symbol (X/O)
     */
    public get symbol(): CellValue {
        return this.state.symbol;
    }

    /**
     * Sets the player's symbol
     * @param symbol The symbol to set (X/O)
     */
    public set symbol(symbol: CellValue) {
        // Only allow X or O symbols, not empty
        if (symbol !== CellValue.Empty) {
            this.state.symbol = symbol;
        }
    }

    /**
     * Checks if this player is human
     * @returns True if the player is human, false otherwise
     */
    public isHuman(): boolean {
        return this.state.playerType === PlayerType.Human;
    }

    /**
     * Checks if this player is computer
     * @returns True if the player is computer, false otherwise
     */
    public isComputer(): boolean {
        return this.state.playerType === PlayerType.Computer;
    }

    /**
     * Creates a deep copy of the player
     * @returns A new PlayerComponent with the same state
     */
    public clone(): PlayerComponent {
        return new PlayerComponent(this.playerType, this.symbol);
    }
} 