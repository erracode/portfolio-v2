import * as THREE from "three"

export class MeEntity {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private currentFrame = 0
  private frameTime = 0
  private isPlaying = false
  private isFacingRight = false
  private dialogCallback?: (msg: string) => void
  private raycaster: THREE.Raycaster
  private camera: THREE.Camera
  private handleClickBound: (event: MouseEvent) => void
  
  // Sprite sheet configuration
  private totalFrames = 9
  private frameWidth = 250 // Each frame is 250px wide
  private frameHeight = 250 // Each frame is 250px high
  private animationSpeed = 0.1 // seconds per frame

  constructor(scene: THREE.Scene, camera: THREE.Camera, dialogCallback?: (msg: string) => void) {
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.dialogCallback = dialogCallback
    
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
    
    // Bind handleClick and add click event listener
    this.handleClickBound = this.handleClick.bind(this)
    window.addEventListener('click', this.handleClickBound)
  }

  private handleClick(event: MouseEvent) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )
    
    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera)
    
    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObject(this.sprite)
    
    if (intersects.length > 0) {
      // Trigger dialog message when clicked
      this.dialogCallback?.(
        "Hi! I'm Jesús from Maracaibo, Venezuela 🇻🇪 🎮\n\n" +
        "Software Engineer at Sundevs\n" +
        "Let's connect and build something great!"
    );
    }
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

  public dispose() {
    // Clean up event listener when component is disposed
    window.removeEventListener('click', this.handleClickBound)
    // Remove sprite from scene to prevent duplicates
    if (this.sprite.parent) {
      this.sprite.parent.remove(this.sprite)
    }
  }
}