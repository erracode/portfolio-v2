export class SpriteAnimation {
    public tiles: number[]
    public key: string
  
    constructor(tiles: number[], key: string) {
      this.tiles = tiles
      this.key = key
    }
  }
  
  // Define animation sequences based on our sprite sheet
  // Our sprite sheet has 6 frames per row and 2 rows
  // First row (0-5): Walk animation
  // Second row (6-11): Idle animation
  
  // For walk animation (first row)
  export const WALK_RIGHT = new SpriteAnimation([0, 1, 2, 3, 4, 5], "WALK_RIGHT")
  // For idle animation (second row)
  export const IDLE_RIGHT = new SpriteAnimation([6, 7, 8, 9, 10, 11], "IDLE_RIGHT")
  
  // We'll mirror these for left-facing animations in the SpriteFlipbook class
  export const WALK_LEFT = new SpriteAnimation([0, 1, 2, 3, 4, 5], "WALK_LEFT")
  export const IDLE_LEFT = new SpriteAnimation([6, 7, 8, 9, 10, 11], "IDLE_LEFT")
  