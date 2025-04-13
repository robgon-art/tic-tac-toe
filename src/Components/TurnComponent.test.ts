import { describe, it, expect, beforeEach } from 'vitest';
import { TurnComponent } from './TurnComponent';
import { CellValue } from './BoardComponent';

describe('TurnComponent', () => {
    let turnComponent: TurnComponent;

    beforeEach(() => {
        turnComponent = new TurnComponent();
    });

    it('should initialize with X as first player by default', () => {
        expect(turnComponent.currentTurn).toBe(CellValue.X);
        expect(turnComponent.turnNumber).toBe(1);
        expect(turnComponent.firstPlayerSymbol).toBe(CellValue.X);
    });

    it('should initialize with specified first player', () => {
        const oFirstTurn = new TurnComponent(CellValue.O);
        expect(oFirstTurn.currentTurn).toBe(CellValue.O);
        expect(oFirstTurn.turnNumber).toBe(1);
        expect(oFirstTurn.firstPlayerSymbol).toBe(CellValue.O);
    });

    it('should use X if Empty is specified as first player', () => {
        const fallbackTurn = new TurnComponent(CellValue.Empty);
        expect(fallbackTurn.currentTurn).toBe(CellValue.X);
        expect(fallbackTurn.firstPlayerSymbol).toBe(CellValue.X);
    });

    it('should correctly advance to next turn', () => {
        // Start with X, turn 1
        expect(turnComponent.currentTurn).toBe(CellValue.X);
        expect(turnComponent.turnNumber).toBe(1);

        // Advance to O, turn 2
        const nextTurn = turnComponent.nextTurn();
        expect(nextTurn).toBe(CellValue.O);
        expect(turnComponent.currentTurn).toBe(CellValue.O);
        expect(turnComponent.turnNumber).toBe(2);

        // Advance to X, turn 3
        turnComponent.nextTurn();
        expect(turnComponent.currentTurn).toBe(CellValue.X);
        expect(turnComponent.turnNumber).toBe(3);
    });

    it('should correctly identify if it is X\'s turn', () => {
        // Start with X
        expect(turnComponent.isXTurn()).toBe(true);
        expect(turnComponent.isOTurn()).toBe(false);

        // Switch to O
        turnComponent.nextTurn();
        expect(turnComponent.isXTurn()).toBe(false);
        expect(turnComponent.isOTurn()).toBe(true);
    });

    it('should reset turn state', () => {
        // Advance a few turns
        turnComponent.nextTurn(); // O, turn 2
        turnComponent.nextTurn(); // X, turn 3

        // Reset back to X, turn 1
        turnComponent.reset();
        expect(turnComponent.currentTurn).toBe(CellValue.X);
        expect(turnComponent.turnNumber).toBe(1);
        expect(turnComponent.firstPlayerSymbol).toBe(CellValue.X);

        // Reset to O as first player
        turnComponent.reset(CellValue.O);
        expect(turnComponent.currentTurn).toBe(CellValue.O);
        expect(turnComponent.turnNumber).toBe(1);
        expect(turnComponent.firstPlayerSymbol).toBe(CellValue.O);
    });

    it('should create a clone with same state', () => {
        // Advance to turn 3
        turnComponent.nextTurn(); // O, turn 2
        turnComponent.nextTurn(); // X, turn 3

        // Clone the component
        const clonedTurn = turnComponent.clone();

        // Verify state matches
        expect(clonedTurn.currentTurn).toBe(CellValue.X);
        expect(clonedTurn.turnNumber).toBe(3);
        expect(clonedTurn.firstPlayerSymbol).toBe(CellValue.X);

        // Verify it's a separate instance
        turnComponent.nextTurn(); // O, turn 4
        expect(turnComponent.currentTurn).toBe(CellValue.O);
        expect(turnComponent.turnNumber).toBe(4);
        expect(clonedTurn.currentTurn).toBe(CellValue.X);
        expect(clonedTurn.turnNumber).toBe(3);
    });

    it('should prepare for next game by alternating first player', () => {
        // Initially X is first player
        expect(turnComponent.firstPlayerSymbol).toBe(CellValue.X);

        // Prepare for next game
        turnComponent.prepareNextGame();

        // Now O should be first player
        expect(turnComponent.currentTurn).toBe(CellValue.O);
        expect(turnComponent.turnNumber).toBe(1);
        expect(turnComponent.firstPlayerSymbol).toBe(CellValue.O);

        // Prepare for another game
        turnComponent.prepareNextGame();

        // Back to X as first player
        expect(turnComponent.currentTurn).toBe(CellValue.X);
        expect(turnComponent.turnNumber).toBe(1);
        expect(turnComponent.firstPlayerSymbol).toBe(CellValue.X);
    });

    it('should implement the Component interface', () => {
        expect(turnComponent.name).toBe('TurnComponent');
        expect(turnComponent.state).toBeDefined();
        expect(turnComponent.state.currentTurn).toBe(CellValue.X);
        expect(turnComponent.state.turnNumber).toBe(1);
        expect(turnComponent.state.firstPlayerSymbol).toBe(CellValue.X);
    });
}); 