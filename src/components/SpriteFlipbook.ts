import * as THREE from "three"

/**
 * This class provides functionality to animate sprite sheets.
 */
export class SpriteFlipbook {
  private tilesHoriz = 0
  private tilesVert = 0
  private currentTile = 0

  private map: THREE.Texture
  private maxDisplayTime = 0
  private elapsedTime = 0
  private runningTileArrayIndex = 0

  private playSpriteIndices: number[] = []
  private sprite: THREE.Sprite
  private isFacingRight = false

  /**
   *
   * @param spriteTexture A sprite sheet with sprite tiles
   * @param tilesHoriz Horizontal number of tiles
   * @param tilesVert Vertical number of tiles
   * @param scene Three.js scene which will contain the sprite
   */
  constructor(spriteTexture: string, tilesHoriz: number, tilesVert: number, scene: THREE.Scene) {
    this.tilesHoriz = tilesHoriz
    this.tilesVert = tilesVert

    const loader = new THREE.TextureLoader()
    this.map = loader.load(
      spriteTexture,
      // onLoad callback
      () => {
        console.log("Sprite sheet loaded successfully")
        document.dispatchEvent(new CustomEvent("sprite-loaded"))
      },
      // onProgress callback
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      // onError callback
      (error) => {
        console.error("Error loading sprite sheet:", error)
      },
    )

    this.map.magFilter = THREE.NearestFilter // sharp pixel sprite
    this.map.minFilter = THREE.NearestFilter
    this.map.repeat.set(1 / tilesHoriz, 1 / tilesVert)
    
    // Ensure proper color space for accurate colors
    this.map.colorSpace = THREE.SRGBColorSpace

    this.update(0)

    const material = new THREE.SpriteMaterial({ map: this.map, transparent: true, })
    this.sprite = new THREE.Sprite(material)
    this.sprite.scale.set(2, 2, 1)

    
    scene.add(this.sprite)
  }

  public loop(playSpriteIndices: number[], totalDuration: number, facingRight = false) {
    this.playSpriteIndices = playSpriteIndices
    this.isFacingRight = facingRight
    this.runningTileArrayIndex = 0
    this.currentTile = playSpriteIndices[this.runningTileArrayIndex]
    this.maxDisplayTime = totalDuration / this.playSpriteIndices.length
    this.elapsedTime = this.maxDisplayTime // force to play new animation
    this.updateTilePosition()
  }

  public setPosition(x: number, y: number, z: number) {
    this.sprite.position.x = x
    this.sprite.position.y = y
    this.sprite.position.z = z
  }

  public addPosition(x: number, y: number, z: number) {
    this.sprite.position.x += x
    this.sprite.position.y += y
    this.sprite.position.z += z
  }

  public getPosition(): THREE.Vector3 {
    return this.sprite.position
  }

  public update(delta: number) {
    this.elapsedTime += delta

    if (this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime) {
      this.elapsedTime = 0
      this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length
      this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex]
      this.updateTilePosition()
    }
  }

  private updateTilePosition() {
    // Calculate the position in the sprite sheet
    const offsetX = (this.currentTile % this.tilesHoriz) / this.tilesHoriz
    const offsetY = Math.floor(this.currentTile / this.tilesHoriz) / this.tilesVert

    // Apply the offset to the texture
    this.map.offset.x = offsetX
    this.map.offset.y = offsetY

    // Handle flipping for right-facing sprites
    if (this.isFacingRight) {
      this.map.repeat.x = -1 / this.tilesHoriz
      this.map.offset.x += 1 / this.tilesHoriz
    } else {
      this.map.repeat.x = 1 / this.tilesHoriz
    }
  }

  public getSprite(): THREE.Sprite {
    return this.sprite
  }
}
