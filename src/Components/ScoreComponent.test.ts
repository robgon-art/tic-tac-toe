import { describe, it, expect, beforeEach } from 'vitest';
import { ScoreComponent } from './ScoreComponent';

describe('ScoreComponent', () => {
    let scoreComponent: ScoreComponent;

    beforeEach(() => {
        scoreComponent = new ScoreComponent();
    });

    it('should initialize with zero scores by default', () => {
        expect(scoreComponent.playerScore).toBe(0);
        expect(scoreComponent.computerScore).toBe(0);
        expect(scoreComponent.ties).toBe(0);
        expect(scoreComponent.getTotalGames()).toBe(0);
    });

    it('should initialize with provided scores', () => {
        const customScore = new ScoreComponent(3, 2, 1);
        expect(customScore.playerScore).toBe(3);
        expect(customScore.computerScore).toBe(2);
        expect(customScore.ties).toBe(1);
        expect(customScore.getTotalGames()).toBe(6);
    });

    it('should get and set player score correctly', () => {
        expect(scoreComponent.playerScore).toBe(0);

        scoreComponent.playerScore = 5;
        expect(scoreComponent.playerScore).toBe(5);

        // Should not allow negative scores
        scoreComponent.playerScore = -3;
        expect(scoreComponent.playerScore).toBe(0);
    });

    it('should get and set computer score correctly', () => {
        expect(scoreComponent.computerScore).toBe(0);

        scoreComponent.computerScore = 7;
        expect(scoreComponent.computerScore).toBe(7);

        // Should not allow negative scores
        scoreComponent.computerScore = -2;
        expect(scoreComponent.computerScore).toBe(0);
    });

    it('should get and set ties correctly', () => {
        expect(scoreComponent.ties).toBe(0);

        scoreComponent.ties = 3;
        expect(scoreComponent.ties).toBe(3);

        // Should not allow negative ties
        scoreComponent.ties = -1;
        expect(scoreComponent.ties).toBe(0);
    });

    it('should increment player score correctly', () => {
        expect(scoreComponent.playerScore).toBe(0);

        const newScore = scoreComponent.incrementPlayerScore();
        expect(newScore).toBe(1);
        expect(scoreComponent.playerScore).toBe(1);

        scoreComponent.incrementPlayerScore();
        expect(scoreComponent.playerScore).toBe(2);
    });

    it('should increment computer score correctly', () => {
        expect(scoreComponent.computerScore).toBe(0);

        const newScore = scoreComponent.incrementComputerScore();
        expect(newScore).toBe(1);
        expect(scoreComponent.computerScore).toBe(1);

        scoreComponent.incrementComputerScore();
        expect(scoreComponent.computerScore).toBe(2);
    });

    it('should increment ties correctly', () => {
        expect(scoreComponent.ties).toBe(0);

        const newTies = scoreComponent.incrementTies();
        expect(newTies).toBe(1);
        expect(scoreComponent.ties).toBe(1);

        scoreComponent.incrementTies();
        expect(scoreComponent.ties).toBe(2);
    });

    it('should calculate total games correctly', () => {
        expect(scoreComponent.getTotalGames()).toBe(0);

        // Add some scores
        scoreComponent.playerScore = 3;
        scoreComponent.computerScore = 2;
        scoreComponent.ties = 1;

        expect(scoreComponent.getTotalGames()).toBe(6);

        // Increment scores
        scoreComponent.incrementPlayerScore();
        expect(scoreComponent.getTotalGames()).toBe(7);

        scoreComponent.incrementComputerScore();
        expect(scoreComponent.getTotalGames()).toBe(8);

        scoreComponent.incrementTies();
        expect(scoreComponent.getTotalGames()).toBe(9);
    });

    it('should reset scores correctly', () => {
        // Set some scores
        scoreComponent.playerScore = 5;
        scoreComponent.computerScore = 3;
        scoreComponent.ties = 2;

        expect(scoreComponent.getTotalGames()).toBe(10);

        // Reset scores
        scoreComponent.reset();

        expect(scoreComponent.playerScore).toBe(0);
        expect(scoreComponent.computerScore).toBe(0);
        expect(scoreComponent.ties).toBe(0);
        expect(scoreComponent.getTotalGames()).toBe(0);
    });

    it('should create a clone with same state', () => {
        // Set some scores
        scoreComponent.playerScore = 3;
        scoreComponent.computerScore = 2;
        scoreComponent.ties = 1;

        // Clone the component
        const clonedScore = scoreComponent.clone();

        // Verify state matches
        expect(clonedScore.playerScore).toBe(3);
        expect(clonedScore.computerScore).toBe(2);
        expect(clonedScore.ties).toBe(1);
        expect(clonedScore.getTotalGames()).toBe(6);

        // Verify it's a separate instance
        scoreComponent.playerScore = 10;
        expect(scoreComponent.playerScore).toBe(10);
        expect(clonedScore.playerScore).toBe(3);
    });

    it('should implement the Component interface', () => {
        expect(scoreComponent.name).toBe('ScoreComponent');
        expect(scoreComponent.state).toBeDefined();
        expect(scoreComponent.state.playerScore).toBe(0);
        expect(scoreComponent.state.computerScore).toBe(0);
        expect(scoreComponent.state.ties).toBe(0);
    });
}); 