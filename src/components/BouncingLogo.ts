import * as THREE from "three"

export class BouncingLogo {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private position: THREE.Vector3
  private initialPosition: THREE.Vector3
  private isActive = false
  private scale = 0.1 // Start small
  private targetScale = 0.8 // Final scale
  private growSpeed = 0.15 // Faster growth speed
  private floatAmplitude = 0.2 // How much it floats up and down
  private floatSpeed = 2 // Speed of floating motion
  private floatOffset = 0 // Used for the floating animation
  private rotationSpeed = 1 // Speed of rotation
  
  constructor(scene: THREE.Scene, logoPath: string, startPosition: THREE.Vector3) {
    this.position = startPosition.clone()
    this.initialPosition = startPosition.clone()
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(
      logoPath,
      // onLoad callback
      () => {
        console.log("Logo loaded successfully")
      },
      // onProgress callback
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      // onError callback
      (error) => {
        console.error("Error loading logo:", error)
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
    this.sprite.scale.set(this.scale, this.scale, 1) // Start small
    this.sprite.position.copy(this.position)
    this.sprite.visible = false // Start invisible
    scene.add(this.sprite)
  }

  public activate() {
    this.isActive = true
    this.sprite.visible = true
    this.scale = 0.1 // Reset scale to small
    this.sprite.scale.set(this.scale, this.scale, 1)
    // Add random initial offset for floating animation
    this.floatOffset = Math.random() * Math.PI * 2
  }

  public update(delta: number) {
    if (!this.isActive) return

    // Grow the logo quickly at first
    if (this.scale < this.targetScale) {
      this.scale += this.growSpeed * delta * 10
      if (this.scale > this.targetScale) {
        this.scale = this.targetScale
      }
      this.sprite.scale.set(this.scale, this.scale, 1)
    }

    // Update floating animation
    this.floatOffset += this.floatSpeed * delta
    const floatY = Math.sin(this.floatOffset) * this.floatAmplitude
    
    // Update position with floating effect
    this.position.y = this.initialPosition.y + floatY + 2 // Float 2 units above initial position
    
    // Add gentle rotation
    this.sprite.rotation.z += this.rotationSpeed * delta

    // Update sprite position
    this.sprite.position.copy(this.position)
  }

  public getSprite(): THREE.Sprite {
    return this.sprite
  }

  public dispose() {
    if (this.sprite.parent) {
      this.sprite.parent.remove(this.sprite)
    }
    this.material.dispose()
    this.texture.dispose()
  }
} 