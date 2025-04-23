import * as THREE from "three"

export interface SpriteSheetConfig {
  imagePath: string
  frameWidth: number
  frameHeight: number
  totalFrames: number
  framesPerRow: number
  animationSpeed: number // seconds per frame
  isLooping?: boolean
}

export class SpriteEntity {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private currentFrame: number = 0
  private frameTime: number = 0
  private isPlaying: boolean = false
  private config: SpriteSheetConfig

  constructor(config: SpriteSheetConfig, scene: THREE.Scene) {
    this.config = {
      isLooping: true,
      ...config
    }

    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(config.imagePath)

    // Set up sprite material
    this.material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
    })

    // Create sprite
    this.sprite = new THREE.Sprite(this.material)
    scene.add(this.sprite)

    // Set initial frame
    this.updateFrameUV()
  }

  public setPosition(x: number, y: number, z: number) {
    this.sprite.position.set(x, y, z)
  }

  public getPosition(): THREE.Vector3 {
    return this.sprite.position.clone()
  }

  public play() {
    this.isPlaying = true
  }

  public pause() {
    this.isPlaying = false
  }

  public setFrame(frameIndex: number) {
    this.currentFrame = Math.max(0, Math.min(frameIndex, this.config.totalFrames - 1))
    this.updateFrameUV()
  }

  public update(delta: number) {
    if (!this.isPlaying) return

    this.frameTime += delta
    if (this.frameTime >= this.config.animationSpeed) {
      this.frameTime = 0
      this.currentFrame = (this.currentFrame + 1) % this.config.totalFrames
      this.updateFrameUV()
    }
  }

  private updateFrameUV() {
    const row = Math.floor(this.currentFrame / this.config.framesPerRow)
    const col = this.currentFrame % this.config.framesPerRow

    const frameWidth = 1 / this.config.framesPerRow
    const frameHeight = 1 / (this.config.totalFrames / this.config.framesPerRow)

    this.material.map!.offset.set(col * frameWidth, 1 - (row + 1) * frameHeight)
    this.material.map!.repeat.set(frameWidth, frameHeight)
  }

  public getSprite(): THREE.Sprite {
    return this.sprite
  }
} 