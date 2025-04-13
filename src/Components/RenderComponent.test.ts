import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RenderComponent, DEFAULT_COLORS } from './RenderComponent';

describe('RenderComponent', () => {
    let renderComponent: RenderComponent;

    beforeEach(() => {
        renderComponent = new RenderComponent();
        // Reset Date.now mock if used in tests
        vi.restoreAllMocks();
    });

    it('should initialize with default dimensions', () => {
        expect(renderComponent.width).toBe(300);
        expect(renderComponent.height).toBe(300);
        expect(renderComponent.rows).toBe(3);
        expect(renderComponent.cols).toBe(3);
        expect(renderComponent.cellSize).toBe(100); // 300/3
    });

    it('should initialize with custom dimensions', () => {
        const customRender = new RenderComponent(600, 600);
        expect(customRender.width).toBe(600);
        expect(customRender.height).toBe(600);
        expect(customRender.cellSize).toBe(200); // 600/3
    });

    it('should update dimensions and cell size', () => {
        renderComponent.setDimensions(450, 450);
        expect(renderComponent.width).toBe(450);
        expect(renderComponent.height).toBe(450);
        expect(renderComponent.cellSize).toBe(150); // 450/3
    });

    it('should handle uneven dimensions', () => {
        renderComponent.setDimensions(500, 300);
        // Cell size should be min of width/cols and height/rows
        expect(renderComponent.cellSize).toBe(100); // min(500/3, 300/3)
    });

    it('should get and set line width with minimum validation', () => {
        expect(renderComponent.lineWidth).toBe(3);

        renderComponent.lineWidth = 5;
        expect(renderComponent.lineWidth).toBe(5);

        // Should enforce minimum of 1
        renderComponent.lineWidth = 0;
        expect(renderComponent.lineWidth).toBe(1);

        renderComponent.lineWidth = -2;
        expect(renderComponent.lineWidth).toBe(1);
    });

    it('should get and set mark size with range validation', () => {
        expect(renderComponent.markSize).toBe(40);

        renderComponent.markSize = 60;
        expect(renderComponent.markSize).toBe(60);

        // Should enforce minimum of 10
        renderComponent.markSize = 5;
        expect(renderComponent.markSize).toBe(10);

        // Should enforce maximum of 90
        renderComponent.markSize = 95;
        expect(renderComponent.markSize).toBe(90);
    });

    it('should initialize with default colors', () => {
        expect(renderComponent.colors).toEqual(DEFAULT_COLORS);
    });

    it('should set specific colors', () => {
        renderComponent.setColor('background', '#000000');
        expect(renderComponent.colors.background).toBe('#000000');

        renderComponent.setColor('xMark', '#ff0000');
        expect(renderComponent.colors.xMark).toBe('#ff0000');

        // Other colors should remain unchanged
        expect(renderComponent.colors.oMark).toBe(DEFAULT_COLORS.oMark);
    });

    it('should ignore invalid color keys', () => {
        // Using any to bypass TypeScript
        (renderComponent as any).setColor('invalidKey', '#000000');
        expect((renderComponent.colors as any).invalidKey).toBeUndefined();
    });

    it('should get animation state', () => {
        const markAnimation = renderComponent.getAnimation('mark');
        expect(markAnimation).toBeDefined();
        expect(markAnimation.inProgress).toBe(false);
        expect(markAnimation.progress).toBe(0);
        expect(markAnimation.duration).toBe(300);

        const winAnimation = renderComponent.getAnimation('win');
        expect(winAnimation).toBeDefined();
        expect(winAnimation.inProgress).toBe(false);
        expect(winAnimation.progress).toBe(0);
        expect(winAnimation.duration).toBe(600);
    });

    it('should start an animation', () => {
        // Mock Date.now
        const now = 1000;
        vi.spyOn(Date, 'now').mockImplementation(() => now);

        renderComponent.startAnimation('mark');

        const markAnimation = renderComponent.getAnimation('mark');
        expect(markAnimation.inProgress).toBe(true);
        expect(markAnimation.progress).toBe(0);
        expect(markAnimation.startTime).toBe(now);
        expect(markAnimation.duration).toBe(300); // Default duration
    });

    it('should start an animation with custom duration', () => {
        renderComponent.startAnimation('mark', 500);

        const markAnimation = renderComponent.getAnimation('mark');
        expect(markAnimation.inProgress).toBe(true);
        expect(markAnimation.progress).toBe(0);
        expect(markAnimation.duration).toBe(500); // Custom duration
    });

    it('should update animation progress', () => {
        // Mock Date.now
        let now = 1000;
        vi.spyOn(Date, 'now').mockImplementation(() => now);

        // Start animation
        renderComponent.startAnimation('mark');

        // Move time forward 150ms (half of the 300ms duration)
        now = 1150;
        const progress = renderComponent.updateAnimation('mark');

        expect(progress).toBe(0.5); // 150/300 = 0.5
        expect(renderComponent.getAnimation('mark').progress).toBe(0.5);
        expect(renderComponent.getAnimation('mark').inProgress).toBe(true);
    });

    it('should complete animation when progress reaches 1', () => {
        // Mock Date.now
        let now = 1000;
        vi.spyOn(Date, 'now').mockImplementation(() => now);

        // Start animation
        renderComponent.startAnimation('mark');

        // Move time forward beyond duration
        now = 1350; // 350ms > 300ms duration
        const progress = renderComponent.updateAnimation('mark');

        expect(progress).toBe(1); // Capped at 1
        expect(renderComponent.getAnimation('mark').progress).toBe(1);
        expect(renderComponent.getAnimation('mark').inProgress).toBe(false); // Animation completed
    });

    it('should return -1 when updating non-active animation', () => {
        // Animation not started
        const progress = renderComponent.updateAnimation('mark');
        expect(progress).toBe(-1);
    });

    it('should stop an animation', () => {
        // Start animation
        renderComponent.startAnimation('mark');
        expect(renderComponent.getAnimation('mark').inProgress).toBe(true);

        // Stop animation
        renderComponent.stopAnimation('mark');

        expect(renderComponent.getAnimation('mark').inProgress).toBe(false);
        expect(renderComponent.getAnimation('mark').progress).toBe(1);
    });

    it('should create a clone with same properties', () => {
        // Customize the original
        renderComponent.setDimensions(400, 400);
        renderComponent.lineWidth = 5;
        renderComponent.markSize = 60;
        renderComponent.setColor('background', '#000000');
        renderComponent.startAnimation('mark', 500);

        // Clone the component
        const clonedRender = renderComponent.clone();

        // Verify properties match
        expect(clonedRender.width).toBe(400);
        expect(clonedRender.height).toBe(400);
        expect(clonedRender.cellSize).toBeCloseTo(133.33, 1); // Use toBeCloseTo for float comparison
        expect(clonedRender.lineWidth).toBe(5);
        expect(clonedRender.markSize).toBe(60);
        expect(clonedRender.colors.background).toBe('#000000');

        // Deep copy verification - modify original
        renderComponent.setColor('background', '#ffffff');
        expect(renderComponent.colors.background).toBe('#ffffff');
        expect(clonedRender.colors.background).toBe('#000000'); // Clone unchanged

        // Animation state should be copied
        expect(clonedRender.getAnimation('mark').duration).toBe(500);
    });

    it('should implement the Component interface', () => {
        expect(renderComponent.name).toBe('RenderComponent');
        expect(renderComponent.state).toBeDefined();
        expect(renderComponent.state.width).toBe(300);
        expect(renderComponent.state.height).toBe(300);
        expect(renderComponent.state.colors).toBeDefined();
        expect(renderComponent.state.animations).toBeDefined();
    });
}); 