import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// We need to mock these modules
vi.mock('./app', () => ({
    createApp: vi.fn().mockReturnValue({
        startGame: vi.fn(),
        stopGame: vi.fn(),
        resetGame: vi.fn(),
        handleClick: vi.fn(),
        onScoreChange: null,
        onGameStateChange: null
    }),
    resizeCanvas: vi.fn()
}));

// Helper to set up JSDOM
function setupDOM() {
    const dom = new JSDOM(
        `<!DOCTYPE html>
    <html>
      <body>
        <div id="app"></div>
      </body>
    </html>`,
        { url: 'http://localhost/' }
    );

    // Set up JSDOM globals
    global.document = dom.window.document;
    global.window = dom.window as any;

    // Initialize main code
    return import('./main');
}

describe('Main', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });

    describe('DOM Creation', () => {
        it('should create game UI elements', async () => {
            await setupDOM();

            // After main.js runs, we should have a game container
            const gameContainer = document.getElementById('game-container');
            expect(gameContainer).toBeDefined();

            // Check for required elements
            expect(document.getElementById('game-canvas')).toBeDefined();
            expect(document.getElementById('scoreboard')).toBeDefined();
            expect(document.getElementById('game-status')).toBeDefined();
            expect(document.getElementById('reset-button')).toBeDefined();
        });

        it('should mount UI in the app container', async () => {
            await setupDOM();

            const appContainer = document.getElementById('app');
            const gameContainer = document.getElementById('game-container');

            expect(appContainer).toBeDefined();
            expect(gameContainer).toBeDefined();
            expect(appContainer!.contains(gameContainer)).toBe(true);
        });
    });

    describe('Event Handlers', () => {
        it('should set up reset button click handler', async () => {
            const { createApp } = await import('./app');
            await setupDOM();

            const resetButton = document.getElementById('reset-button');
            resetButton!.click();

            const app = (createApp as any).mock.results[0].value;
            expect(app.resetGame).toHaveBeenCalledTimes(1);
        });

        it('should update score display when score changes', async () => {
            await setupDOM();

            // Get the createApp mock result
            const { createApp } = await import('./app');
            const app = (createApp as any).mock.results[0].value;

            // Ensure our callback is set
            expect(app.onScoreChange).toBeDefined();

            // Call the callback
            app.onScoreChange(3, 1, 2);

            // Check the score displays
            expect(document.getElementById('player-score')!.textContent).toBe('3');
            expect(document.getElementById('ties-score')!.textContent).toBe('1');
            expect(document.getElementById('computer-score')!.textContent).toBe('2');
        });

        it('should update game status when game state changes', async () => {
            await setupDOM();

            // Get the createApp mock result
            const { createApp } = await import('./app');
            const app = (createApp as any).mock.results[0].value;

            // Ensure our callback is set
            expect(app.onGameStateChange).toBeDefined();

            // Call the callback
            app.onGameStateChange('Player X wins!');

            // Check the status display
            expect(document.getElementById('game-status')!.textContent).toBe('Player X wins!');
        });
    });
}); 