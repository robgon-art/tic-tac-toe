import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerComponent, PlayerType } from './PlayerComponent';
import { CellValue } from './BoardComponent';

describe('PlayerComponent', () => {
    let humanPlayer: PlayerComponent;
    let computerPlayer: PlayerComponent;

    beforeEach(() => {
        // Create a human player with X symbol (default)
        humanPlayer = new PlayerComponent();

        // Create a computer player with O symbol
        computerPlayer = new PlayerComponent(PlayerType.Computer, CellValue.O);
    });

    it('should initialize with provided values', () => {
        // Human player (default values)
        expect(humanPlayer.playerType).toBe(PlayerType.Human);
        expect(humanPlayer.symbol).toBe(CellValue.X);

        // Computer player (custom values)
        expect(computerPlayer.playerType).toBe(PlayerType.Computer);
        expect(computerPlayer.symbol).toBe(CellValue.O);
    });

    it('should get and set player type correctly', () => {
        // Initially human
        expect(humanPlayer.playerType).toBe(PlayerType.Human);

        // Change to computer
        humanPlayer.playerType = PlayerType.Computer;
        expect(humanPlayer.playerType).toBe(PlayerType.Computer);

        // Change back to human
        humanPlayer.playerType = PlayerType.Human;
        expect(humanPlayer.playerType).toBe(PlayerType.Human);
    });

    it('should get and set symbol correctly', () => {
        // Initially X
        expect(humanPlayer.symbol).toBe(CellValue.X);

        // Change to O
        humanPlayer.symbol = CellValue.O;
        expect(humanPlayer.symbol).toBe(CellValue.O);

        // Change back to X
        humanPlayer.symbol = CellValue.X;
        expect(humanPlayer.symbol).toBe(CellValue.X);
    });

    it('should not allow setting empty as a symbol', () => {
        // Try to set empty symbol
        humanPlayer.symbol = CellValue.Empty;

        // Symbol should remain X
        expect(humanPlayer.symbol).toBe(CellValue.X);
    });

    it('should correctly identify if player is human', () => {
        expect(humanPlayer.isHuman()).toBe(true);
        expect(computerPlayer.isHuman()).toBe(false);

        // Change type and test again
        humanPlayer.playerType = PlayerType.Computer;
        expect(humanPlayer.isHuman()).toBe(false);
    });

    it('should correctly identify if player is computer', () => {
        expect(humanPlayer.isComputer()).toBe(false);
        expect(computerPlayer.isComputer()).toBe(true);

        // Change type and test again
        humanPlayer.playerType = PlayerType.Computer;
        expect(humanPlayer.isComputer()).toBe(true);
    });

    it('should create a clone with same properties', () => {
        // Clone the computer player
        const clonedPlayer = computerPlayer.clone();

        // Verify properties match
        expect(clonedPlayer.playerType).toBe(PlayerType.Computer);
        expect(clonedPlayer.symbol).toBe(CellValue.O);

        // Verify it's a different instance
        computerPlayer.playerType = PlayerType.Human;
        expect(computerPlayer.playerType).toBe(PlayerType.Human);
        expect(clonedPlayer.playerType).toBe(PlayerType.Computer);
    });

    it('should implement the Component interface', () => {
        expect(humanPlayer.name).toBe('PlayerComponent');
        expect(humanPlayer.state).toBeDefined();
        expect(humanPlayer.state.playerType).toBe(PlayerType.Human);
        expect(humanPlayer.state.symbol).toBe(CellValue.X);
    });
}); 