import { Entity, EntityComponentSystem } from 'javascript-entity-component-system';
import { BoardComponent } from '../Components/BoardComponent';
import { RenderComponent } from '../Components/RenderComponent';

/**
 * Interface for options when creating a Board entity
 */
export interface BoardOptions {
    /** Custom width for the board (pixels) */
    width?: number;
    /** Custom height for the board (pixels) */
    height?: number;
    /** Custom line width for grid lines */
    lineWidth?: number;
    /** Custom mark size (percentage of cell) */
    markSize?: number;
}

/**
 * Creates a Board entity
 * 
 * This is a pure factory function that creates a Board entity with
 * the required components. It doesn't register the entity with the ECS.
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the board (optional)
 * @returns A new Board entity
 */
export function createBoardEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Board',
    options: BoardOptions = {}
): Entity {
    // Create the components
    const boardComponent = new BoardComponent();
    const renderComponent = new RenderComponent(
        options.width || 300,
        options.height || 300
    );

    // Customize render component if options provided
    if (options.lineWidth) {
        renderComponent.lineWidth = options.lineWidth;
    }

    if (options.markSize) {
        renderComponent.markSize = options.markSize;
    }

    // Register the components with the ECS
    ecs.addComponent(boardComponent);
    ecs.addComponent(renderComponent);

    // Create and return the entity
    // The entity is created but not added to the ECS system yet
    return ecs.createEntity(
        entityName,
        ['BoardComponent', 'RenderComponent'],
        [] // No processors attached directly to the entity
    );
}

/**
 * Factory function that creates a Board entity with proper component attachment
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the board (optional)
 * @returns The created Board entity
 */
export function createAndRegisterBoardEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Board',
    options: BoardOptions = {}
): Entity {
    // Create the entity first
    const boardEntity = ecs.createEntity(
        entityName,
        [], // No component names, we'll add components explicitly
        []  // No processors
    );

    // Create the components
    const boardComponent = new BoardComponent();
    const renderComponent = new RenderComponent(
        options.width || 300,
        options.height || 300
    );

    // Customize render component if options provided
    if (options.lineWidth) {
        renderComponent.lineWidth = options.lineWidth;
    }

    if (options.markSize) {
        renderComponent.markSize = options.markSize;
    }

    // DIRECT COMPONENT ATTACHMENT APPROACH
    // This ensures components are properly registered and linked to entities

    // 1. First add these components to the ECS system
    ecs.addComponent(boardComponent);
    ecs.addComponent(renderComponent);

    console.log('[DEBUG] Created Board components:', boardComponent.name, renderComponent.name);

    // 2. Then explicitly add each component to the entity
    // This is the key step that's likely missing
    try {
        // Try using API with component objects
        (ecs as any).addComponentToEntity(boardEntity, boardComponent);
        (ecs as any).addComponentToEntity(boardEntity, renderComponent);
        console.log('[DEBUG] Added components to Board via object method');
    } catch (e) {
        // Fallback to using component names
        (ecs as any).addComponentToEntity(boardEntity, 'BoardComponent');
        (ecs as any).addComponentToEntity(boardEntity, 'RenderComponent');
        console.log('[DEBUG] Added components to Board via name method');
    }

    // 3. Add entity to the ECS system
    ecs.addEntity(boardEntity);

    return boardEntity;
}

/**
 * Get the board component from a board entity
 * 
 * @param ecs The Entity Component System instance
 * @param boardEntity The board entity
 * @returns The BoardComponent or undefined if not found
 */
export function getBoardComponent(
    ecs: EntityComponentSystem,
    boardEntity: Entity
): BoardComponent | undefined {
    const components = ecs.getEntityComponents(boardEntity, ['BoardComponent']);
    return components.find(c => c.name === 'BoardComponent') as BoardComponent | undefined;
}

/**
 * Get the render component from a board entity
 * 
 * @param ecs The Entity Component System instance
 * @param boardEntity The board entity
 * @returns The RenderComponent or undefined if not found
 */
export function getRenderComponent(
    ecs: EntityComponentSystem,
    boardEntity: Entity
): RenderComponent | undefined {
    const components = ecs.getEntityComponents(boardEntity, ['RenderComponent']);
    return components.find(c => c.name === 'RenderComponent') as RenderComponent | undefined;
} 