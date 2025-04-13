import { Component } from 'javascript-entity-component-system';

// Default colors
export const DEFAULT_COLORS = {
    background: '#ffffff',
    grid: '#333333',
    xMark: '#ff5252',
    oMark: '#2196f3',
    winLine: '#4caf50',
    text: '#333333'
};

// Animation state for transitions
export interface AnimationState {
    inProgress: boolean;
    progress: number; // 0 to 1
    duration: number; // ms
    startTime: number; // timestamp
}

/**
 * RenderComponent handles visual aspects of the game
 * It is a pure data container following ECS principles
 */
export class RenderComponent implements Component {
    public name: string = 'RenderComponent';
    public state: { [key: string]: any } = {
        // Canvas dimensions
        width: 300,
        height: 300,

        // Board dimensions (cells)
        rows: 3,
        cols: 3,

        // Cell size (calculated)
        cellSize: 100,

        // Styling
        lineWidth: 3,
        markSize: 40, // Percentage of cell size

        // Colors
        colors: { ...DEFAULT_COLORS },

        // Animation states
        animations: {
            mark: {
                inProgress: false,
                progress: 0,
                duration: 300,
                startTime: 0
            } as AnimationState,
            win: {
                inProgress: false,
                progress: 0,
                duration: 600,
                startTime: 0
            } as AnimationState
        }
    };

    /**
     * Creates a new RenderComponent
     * @param width Canvas width in pixels
     * @param height Canvas height in pixels
     */
    constructor(width: number = 300, height: number = 300) {
        this.setDimensions(width, height);
    }

    /**
     * Sets the canvas dimensions and updates cell size
     * @param width Canvas width in pixels
     * @param height Canvas height in pixels
     */
    public setDimensions(width: number, height: number): void {
        this.state.width = width;
        this.state.height = height;
        this.updateCellSize();
    }

    /**
     * Gets the canvas width
     * @returns Canvas width in pixels
     */
    public get width(): number {
        return this.state.width;
    }

    /**
     * Gets the canvas height
     * @returns Canvas height in pixels
     */
    public get height(): number {
        return this.state.height;
    }

    /**
     * Gets the number of rows in the grid
     * @returns Number of rows
     */
    public get rows(): number {
        return this.state.rows;
    }

    /**
     * Gets the number of columns in the grid
     * @returns Number of columns
     */
    public get cols(): number {
        return this.state.cols;
    }

    /**
     * Gets the cell size (width/height)
     * @returns Cell size in pixels
     */
    public get cellSize(): number {
        return this.state.cellSize;
    }

    /**
     * Gets the grid line width
     * @returns Line width in pixels
     */
    public get lineWidth(): number {
        return this.state.lineWidth;
    }

    /**
     * Sets the grid line width
     * @param width Line width in pixels
     */
    public set lineWidth(width: number) {
        this.state.lineWidth = Math.max(1, width);
    }

    /**
     * Gets the mark size (percentage of cell size)
     * @returns Mark size as percentage (0-100)
     */
    public get markSize(): number {
        return this.state.markSize;
    }

    /**
     * Sets the mark size
     * @param size Mark size as percentage (0-100)
     */
    public set markSize(size: number) {
        this.state.markSize = Math.max(10, Math.min(90, size));
    }

    /**
     * Gets the colors configuration
     * @returns Colors object
     */
    public get colors(): typeof DEFAULT_COLORS {
        return this.state.colors;
    }

    /**
     * Sets a specific color
     * @param key Color key (background, grid, xMark, oMark, winLine, text)
     * @param color CSS color value
     */
    public setColor(key: keyof typeof DEFAULT_COLORS, color: string): void {
        if (key in this.state.colors) {
            this.state.colors[key] = color;
        }
    }

    /**
     * Gets an animation state
     * @param key Animation key (mark, win)
     * @returns Animation state object
     */
    public getAnimation(key: 'mark' | 'win'): AnimationState {
        return this.state.animations[key];
    }

    /**
     * Starts an animation
     * @param key Animation key (mark, win)
     * @param duration Animation duration in ms (optional)
     */
    public startAnimation(key: 'mark' | 'win', duration?: number): void {
        const animation = this.state.animations[key];
        if (animation) {
            animation.inProgress = true;
            animation.progress = 0;
            animation.startTime = Date.now();
            if (duration !== undefined) {
                animation.duration = duration;
            }
        }
    }

    /**
     * Updates animation progress
     * @param key Animation key (mark, win)
     * @returns Current progress (0-1) or -1 if animation not in progress
     */
    public updateAnimation(key: 'mark' | 'win'): number {
        const animation = this.state.animations[key];
        if (animation && animation.inProgress) {
            const elapsed = Date.now() - animation.startTime;
            animation.progress = Math.min(1, elapsed / animation.duration);

            if (animation.progress >= 1) {
                animation.inProgress = false;
            }

            return animation.progress;
        }

        return -1;
    }

    /**
     * Stops an animation
     * @param key Animation key (mark, win)
     */
    public stopAnimation(key: 'mark' | 'win'): void {
        const animation = this.state.animations[key];
        if (animation) {
            animation.inProgress = false;
            animation.progress = 1;
        }
    }

    /**
     * Updates cell size based on canvas dimensions
     */
    private updateCellSize(): void {
        // Calculate cell size to fit canvas while maintaining aspect ratio
        const cellWidth = this.state.width / this.state.cols;
        const cellHeight = this.state.height / this.state.rows;
        this.state.cellSize = Math.min(cellWidth, cellHeight);
    }

    /**
     * Creates a deep copy of the current render state
     * @returns A new RenderComponent with the same state
     */
    public clone(): RenderComponent {
        const clonedComponent = new RenderComponent(this.state.width, this.state.height);

        // Copy styling properties
        clonedComponent.state.lineWidth = this.state.lineWidth;
        clonedComponent.state.markSize = this.state.markSize;

        // Deep copy colors
        clonedComponent.state.colors = { ...this.state.colors };

        // Deep copy animations
        clonedComponent.state.animations = {
            mark: { ...this.state.animations.mark },
            win: { ...this.state.animations.win }
        };

        return clonedComponent;
    }
} 