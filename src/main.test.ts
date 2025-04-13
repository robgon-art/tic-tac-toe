import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock the app module
vi.mock('./app.js', () => {
    const mockApp = {
        startGame: vi.fn(),
        stopGame: vi.fn(),
        resetGame: vi.fn(),
        handleClick: vi.fn(),
        onScoreChange: vi.fn(),
        onGameStateChange: vi.fn()
    };
    
    return {
        createApp: vi.fn().mockReturnValue(mockApp),
        resizeCanvas: vi.fn()
    };
});

// Import functions from main.ts
import {
    createGameCanvas,
    createGameUI,
    handleResetClick,
    handleScoreChange,
    handleGameStateChange,
    handleCanvasClick
} from './main.js';

// Import the mocked module to access the mock app
import { createApp } from './app.js';

describe('Main Tests', () => {
    let document: Document;
    let mockApp: any;
    
    beforeEach(() => {
        // Set up a fresh DOM for each test
        const dom = new JSDOM(
            `<!DOCTYPE html>
            <html>
              <body>
                <div id="app"></div>
              </body>
            </html>`,
            { url: 'http://localhost/' }
        );
        
        document = dom.window.document;
        global.document = document;
        global.window = dom.window as any;
        
        // Clear mock records
        vi.clearAllMocks();
        
        // Create a new mock app for each test
        mockApp = (createApp as any).mock.results[0]?.value || {
            startGame: vi.fn(),
            stopGame: vi.fn(),
            resetGame: vi.fn(),
            handleClick: vi.fn(),
            onScoreChange: vi.fn(),
            onGameStateChange: vi.fn()
        };
    });
    
    describe('UI Components', () => {
        it('should create a game canvas with expected properties', () => {
            const canvas = createGameCanvas();
            
            expect(canvas.id).toBe('game-canvas');
            expect(canvas.width).toBe(300);
            expect(canvas.height).toBe(300);
            
            // In JSDOM, check tag name instead of instanceof
            expect(canvas.tagName).toBe('CANVAS');
        });
        
        it('should create game UI elements', () => {
            const ui = createGameUI();
            
            expect(ui.container.id).toBe('game-container');
            expect(ui.canvas.id).toBe('game-canvas');
            expect(ui.scoreboard.id).toBe('scoreboard');
            expect(ui.status.id).toBe('game-status');
            expect(ui.resetButton.id).toBe('reset-button');
            expect(ui.resetButton.textContent).toBe('Reset Game');
        });
    });
    
    describe('DOM Structure', () => {
        it('should mount UI elements properly in the DOM', () => {
            // Create UI
            const ui = createGameUI();
            
            // Create app container
            const appContainer = document.getElementById('app');
            
            // Manually append to DOM
            appContainer!.appendChild(ui.container);
            
            // Now run assertions
            const gameContainer = document.getElementById('game-container');
            expect(gameContainer).not.toBeNull();
            
            // Verify the container is mounted in the app
            expect(appContainer!.contains(gameContainer)).toBe(true);
            
            // Verify other elements
            expect(document.getElementById('game-canvas')).not.toBeNull();
            expect(document.getElementById('scoreboard')).not.toBeNull();
            expect(document.getElementById('game-status')).not.toBeNull();
            expect(document.getElementById('reset-button')).not.toBeNull();
        });
    });
    
    describe('Event Handlers', () => {
        it('should handle reset button click', () => {
            // Create DOM structure
            const ui = createGameUI();
            document.body.appendChild(ui.container);
            
            // Directly trigger the handler
            handleResetClick(mockApp);
            
            // Assert
            expect(mockApp.resetGame).toHaveBeenCalledTimes(1);
            expect(document.getElementById('game-status')!.textContent).toBe('Game Reset');
        });
        
        it('should update score display', () => {
            // Create DOM structure
            const ui = createGameUI();
            document.body.appendChild(ui.container);
            
            // Directly update scores
            handleScoreChange(3, 1, 2);
            
            // Assert
            expect(document.getElementById('player-score')!.textContent).toBe('3');
            expect(document.getElementById('ties-score')!.textContent).toBe('1');
            expect(document.getElementById('computer-score')!.textContent).toBe('2');
        });
        
        it('should update game status', () => {
            // Create DOM structure
            const ui = createGameUI();
            document.body.appendChild(ui.container);
            
            // Directly update status
            handleGameStateChange('Player X wins!');
            
            // Assert
            expect(document.getElementById('game-status')!.textContent).toBe('Player X wins!');
        });
        
        it('should handle canvas clicks', () => {
            // Create DOM structure
            const ui = createGameUI();
            document.body.appendChild(ui.container);
            
            // Directly call the handler
            handleCanvasClick(mockApp, 100, 150);
            
            // Assert
            expect(mockApp.handleClick).toHaveBeenCalledWith(100, 150);
        });
    });
}); 