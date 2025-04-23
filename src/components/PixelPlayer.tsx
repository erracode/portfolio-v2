import * as THREE from "three"

export class PixelPlayer extends THREE.Group {
  private sprite: THREE.Sprite
  private spriteSheet: THREE.Texture | null = null
  private idleFrames: THREE.Texture[] = []
  private walkFrames: THREE.Texture[] = []
  private currentFrame = 0
  private animationSpeed = 0.1
  private frameCount = 0
  private isMoving = false
  private facingLeft = true
  private animationState: "idle" | "walk" = "idle"

  constructor() {
    super()

    // Create a placeholder sprite material with visible color
    const placeholderMaterial = new THREE.SpriteMaterial({
      color: 0xff0000, // Red placeholder
      transparent: true,
    })

    this.sprite = new THREE.Sprite(placeholderMaterial)
    this.sprite.scale.set(2, 2, 1)
    this.add(this.sprite)

    // Load player sprites
    this.loadSpriteSheet()

    // Add keyboard controls
    this.setupControls()
  }

  private loadSpriteSheet() {
    const loader = new THREE.TextureLoader()

    // Log the loading process
    console.log("Starting to load sprite sheet")

    loader.load(
      "/player.png",
      (texture) => {
        console.log("Sprite sheet loaded successfully", texture)

        // Apply nearest-neighbor filtering for pixel art
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        this.spriteSheet = texture

        // Get the dimensions of the full sprite sheet
        const fullWidth = texture.image.width
        const fullHeight = texture.image.height
        console.log(`Sprite sheet dimensions: ${fullWidth}x${fullHeight}`)

        // Calculate the dimensions of each frame
        const framesX = 6
        const framesY = 2
        const frameWidth = fullWidth / framesX
        const frameHeight = fullHeight / framesY
        console.log(`Frame dimensions: ${frameWidth}x${frameHeight}`)

        // Create textures for each frame in the idle animation (top row)
        for (let i = 0; i < framesX; i++) {
          const idleTexture = texture.clone()
          // Set the UV coordinates for this frame
          idleTexture.repeat.set(1 / framesX, 1 / framesY)
          idleTexture.offset.set(i / framesX, 0)
          this.idleFrames.push(idleTexture)
        }
        console.log(`Created ${this.idleFrames.length} idle frames`)

        // Create textures for each frame in the walk animation (bottom row)
        for (let i = 0; i < framesX; i++) {
          const walkTexture = texture.clone()
          // Set the UV coordinates for this frame
          walkTexture.repeat.set(1 / framesX, 1 / framesY)
          walkTexture.offset.set(i / framesX, 1 / framesY)
          this.walkFrames.push(walkTexture)
        }
        console.log(`Created ${this.walkFrames.length} walk frames`)

        // Set initial texture to first idle frame
        if (this.idleFrames.length > 0) {
          ;(this.sprite.material as THREE.SpriteMaterial).map = this.idleFrames[0]
          console.log("Set initial frame")
        }
      },
      (progress) => {
        console.log(`Loading progress: ${Math.round((progress.loaded / progress.total) * 100)}%`)
      },
      (error) => {
        console.error("Error loading sprite sheet:", error)
      },
    )
  }

  private setupControls() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          this.isMoving = true
          this.animationState = "walk"
          break
        case "ArrowDown":
        case "s":
          this.isMoving = true
          this.animationState = "walk"
          break
        case "ArrowLeft":
        case "a":
          this.isMoving = true
          this.animationState = "walk"
          this.facingLeft = true
          break
        case "ArrowRight":
        case "d":
          this.isMoving = true
          this.animationState = "walk"
          this.facingLeft = false
          break
      }
    })

    document.addEventListener("keyup", (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
        // Check if any other movement keys are still pressed
        const keysPressed = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].some(
          (key) => key !== event.key && document.querySelector(`[data-key="${key}"]`),
        )

        if (!keysPressed) {
          this.isMoving = false
          this.animationState = "idle"
        }
      }
    })
  }

  update() {
    // Update animation
    this.frameCount++

    if (this.frameCount >= 1 / this.animationSpeed) {
      this.frameCount = 0

      // Get the appropriate animation frames based on state
      const frames = this.animationState === "idle" ? this.idleFrames : this.walkFrames

      if (frames.length > 0) {
        this.currentFrame = (this.currentFrame + 1) % frames.length
        const texture = frames[this.currentFrame].clone()

        // Handle sprite flipping for right-facing movement
        if (!this.facingLeft) {
          texture.repeat.x *= -1
          texture.offset.x += texture.repeat.x
        }
        // Apply the texture to the sprite material
        ;(this.sprite.material as THREE.SpriteMaterial).map = texture
      }
    }

    // Update position based on movement
    if (this.isMoving) {
      const speed = 0.1
      const keys: { [key: string]: boolean } = {}

      // Check which keys are currently pressed
      document.querySelectorAll("[data-key]").forEach((el) => {
        const key = el.getAttribute("data-key")
        if (key) keys[key] = true
      })

      if (keys["ArrowUp"] || keys["w"]) {
        this.position.z -= speed
      }
      if (keys["ArrowDown"] || keys["s"]) {
        this.position.z += speed
      }
      if (keys["ArrowLeft"] || keys["a"]) {
        this.position.x -= speed
        this.facingLeft = true
      }
      if (keys["ArrowRight"] || keys["d"]) {
        this.position.x += speed
        this.facingLeft = false
      }
    }
  }
}
