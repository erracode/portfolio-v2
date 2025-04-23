import * as THREE from "three"

export class MeEntity {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private currentFrame = 0
  private frameTime = 0
  private isPlaying = false
  private isFacingRight = false
  
  // Sprite sheet configuration
  private totalFrames = 9
  private frameWidth = 250 // Each frame is 250px wide
  private frameHeight = 250 // Each frame is 250px high
  private animationSpeed = 0.1 // seconds per frame

  constructor(scene: THREE.Scene) {
    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(
      "/me.png",
      // onLoad callback
      () => {
        console.log("Me sprite sheet loaded successfully")
        document.dispatchEvent(new CustomEvent("sprite-loaded"))
      },
      // onProgress callback
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      // onError callback
      (error) => {
        console.error("Error loading sprite sheet:", error)
      }
    )

    // Set up texture properties for pixel art
    this.texture.magFilter = THREE.NearestFilter
    this.texture.minFilter = THREE.NearestFilter
    this.texture.colorSpace = THREE.SRGBColorSpace

    // Set up sprite material
    this.material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
    })

    // Create sprite
    this.sprite = new THREE.Sprite(this.material)
    this.sprite.scale.set(2, 2, 1)
    scene.add(this.sprite)

    // Set initial position
    this.setPosition(0, 1, 0)
    
    // Start animation
    this.play()
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

  public setFacingRight(facingRight: boolean) {
    this.isFacingRight = facingRight
    this.updateFrameUV()
  }

  public update(delta: number) {
    if (!this.isPlaying) return

    this.frameTime += delta
    if (this.frameTime >= this.animationSpeed) {
      this.frameTime = 0
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames
      this.updateFrameUV()
    }
  }

  private updateFrameUV() {
    // Calculate the position in the sprite sheet
    // The sprite sheet is 2250px wide with 9 frames, each 250px wide
    const frameWidth = 250 / 2250 // Normalized width of a single frame
    
    // Apply the offset to the texture
    this.texture.offset.set(this.currentFrame * frameWidth, 0)
    
    // Set the repeat to show only one frame
    this.texture.repeat.set(frameWidth, 1)

    // Handle flipping for right-facing sprites
    if (this.isFacingRight) {
      this.texture.repeat.x = -frameWidth
      this.texture.offset.x += frameWidth
    } else {
      this.texture.repeat.x = frameWidth
    }
  }

  public getSprite(): THREE.Sprite {
    return this.sprite
  }
} 