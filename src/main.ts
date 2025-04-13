import { createApp, resizeCanvas } from './app.js';

/**
 * Creates and configures the game canvas element
 * @returns The configured canvas element
 */
export function createGameCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.width = 300;
    canvas.height = 300;
    return canvas;
}

/**
 * Creates the game UI elements
 * @returns Object containing UI elements
 */
export function createGameUI() {
    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.className = 'game-container';

    // Create canvas
    const canvas = createGameCanvas();
    gameContainer.appendChild(canvas);

    // Create scoreboard
    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';
    scoreboard.className = 'scoreboard';
    scoreboard.innerHTML = `
    <div class="score-item">
      <span class="label">Player (X):</span> 
      <span id="player-score">0</span>
    </div>
    <div class="score-item">
      <span class="label">Ties:</span> 
      <span id="ties-score">0</span>
    </div>
    <div class="score-item">
      <span class="label">Computer (O):</span> 
      <span id="computer-score">0</span>
    </div>
  `;
    gameContainer.appendChild(scoreboard);

    // Create game status
    const status = document.createElement('div');
    status.id = 'game-status';
    status.className = 'game-status';
    status.textContent = 'Game Ready';
    gameContainer.appendChild(status);

    // Create game controls
    const controls = document.createElement('div');
    controls.id = 'game-controls';
    controls.className = 'game-controls';

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.textContent = 'Reset Game';
    controls.appendChild(resetButton);

    gameContainer.appendChild(controls);

    return {
        container: gameContainer,
        canvas,
        scoreboard,
        status,
        controls,
        resetButton
    };
}

/**
 * Handle reset button click
 * @param app The game app instance
 */
export function handleResetClick(app: any): void {
    app.resetGame();
    updateStatus('Game Reset');
}

/**
 * Handle canvas click
 * @param app Game app instance
 * @param x X coordinate of click
 * @param y Y coordinate of click
 */
export function handleCanvasClick(app: any, x: number, y: number): void {
    app.handleClick(x, y);
}

/**
 * Handle score changes
 * @param playerScore Player's score
 * @param ties Number of ties
 * @param computerScore Computer's score
 */
export function handleScoreChange(playerScore: number, ties: number, computerScore: number): void {
    document.getElementById('player-score')!.textContent = playerScore.toString();
    document.getElementById('ties-score')!.textContent = ties.toString();
    document.getElementById('computer-score')!.textContent = computerScore.toString();
}

/**
 * Handle game state changes
 * @param state New game state
 */
export function handleGameStateChange(state: string): void {
    updateStatus(state);
}

/**
 * Initializes the application
 */
function initializeApp() {
    console.log('[DEBUG] Initializing app');

    // Create UI elements
    const ui = createGameUI();
    console.log('[DEBUG] UI elements created, canvas id:', ui.canvas.id);

    // Add to document
    const root = document.getElementById('app');
    if (root) {
        root.appendChild(ui.container);
        console.log('[DEBUG] UI elements added to app root');
    } else {
        document.body.appendChild(ui.container);
        console.log('[DEBUG] UI elements added to body (app root not found)');
    }

    // Initialize game
    const app = createApp(ui.canvas);
    console.log('[DEBUG] Game app created');

    // Connect reset button
    ui.resetButton.addEventListener('click', () => {
        handleResetClick(app);
    });

    // Handle canvas clicks
    ui.canvas.addEventListener('click', (event) => {
        const rect = ui.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        handleCanvasClick(app, x, y);
    });

    // Update score display
    app.onScoreChange = handleScoreChange;

    // Update game status 
    app.onGameStateChange = handleGameStateChange;

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas(ui.canvas);
    });

    // Initial resize
    resizeCanvas(ui.canvas);
    console.log('[DEBUG] Canvas resized, dimensions:', ui.canvas.width, 'x', ui.canvas.height);

    // Start game
    console.log('[DEBUG] Starting game');
    app.startGame();
    console.log('[DEBUG] Game started');
}

/**
 * Updates the game status display
 * @param status Status message to display
 */
export function updateStatus(status: string) {
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 