import * as THREE from "three"

export class JumpAnimation {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private currentFrame = 0
  private frameTime = 0
  private isPlaying = false
  private isFlipped = false
  
  // Animation configuration
  private totalFrames = 6 // 6 frames for jump animation
  private animationDuration = 0.5 // Complete jump animation in 0.5 seconds
  private frameInterval: number
  private jumpProgress = 0 // Track jump progress from 0 to 1
  
  constructor(scene: THREE.Scene) {
    this.frameInterval = this.animationDuration / this.totalFrames
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(
      "/player-jump.png",
      () => {
        console.log("Jump sprite sheet loaded successfully")
      },
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      (error) => {
        console.error("Error loading jump sprite sheet:", error)
      }
    )

    // Set up texture properties
    this.texture.magFilter = THREE.NearestFilter
    this.texture.minFilter = THREE.NearestFilter
    this.texture.colorSpace = THREE.SRGBColorSpace

    // Set up sprite material
    this.material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
    })

    // Create sprite with same scale as regular animations
    this.sprite = new THREE.Sprite(this.material)
    this.sprite.scale.set(2, 2, 1)
    this.sprite.visible = false // Start invisible
    scene.add(this.sprite)

    // Set initial UV
    this.updateFrameUV()
  }

  public setPosition(x: number, y: number, z: number) {
    this.sprite.position.set(x, y, z)
  }

  public startJump(isFlipped: boolean) {
    this.isFlipped = isFlipped
    this.currentFrame = 0
    this.frameTime = 0
    this.jumpProgress = 0
    this.isPlaying = true
    this.sprite.visible = true
    this.updateFrameUV()
  }

  public stop() {
    this.isPlaying = false
    this.sprite.visible = false
  }

  public update(delta: number, jumpProgress: number) {
    if (!this.isPlaying) return
    
    this.jumpProgress = jumpProgress
    
    // Calculate which frame to show based on jump progress
    const targetFrame = Math.min(
      Math.floor(this.jumpProgress * (this.totalFrames - 1)),
      this.totalFrames - 1
    )
    
    if (targetFrame !== this.currentFrame) {
      this.currentFrame = targetFrame
      this.updateFrameUV()
    }
  }

  private updateFrameUV() {
    // Calculate UV coordinates for current frame
    const frameWidth = 1 / this.totalFrames
    
    if (!this.isFlipped) {
      this.texture.offset.x = this.currentFrame * frameWidth
      this.texture.repeat.x = frameWidth
      this.texture.repeat.y = 1
    } else {
      // For flipped animation, adjust UV coordinates
      this.texture.offset.x = (this.currentFrame + 1) * frameWidth
      this.texture.repeat.x = -frameWidth
      this.texture.repeat.y = 1
    }
  }

  public isAnimating(): boolean {
    return this.isPlaying
  }

  public setScale(x: number, y: number, z: number) {
    this.sprite.scale.set(x, y, z)
  }

  public dispose() {
    if (this.sprite.parent) {
      this.sprite.parent.remove(this.sprite)
    }
    this.material.dispose()
    this.texture.dispose()
  }
} 