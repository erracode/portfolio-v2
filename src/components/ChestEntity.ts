import * as THREE from "three"
import { BouncingLogo } from "./BouncingLogo"

export class ChestEntity {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private isOpen = false
  private raycaster: THREE.Raycaster
  private camera: THREE.Camera
  private bouncingLogos: BouncingLogo[] = []
  private hasSpawnedLogos = false
  
  // Logo configuration
  private logoConfigs = [
    { path: "/react-logo.png", xOffset: -0.8 },
    { path: "/javascript-logo.png", xOffset: 0.8 }
  ]
  
  // Sprite sheet configuration
  private frameWidth = 254 // Width of a single frame (half of total width)
  private frameHeight = 254 // Height of a single frame
  private totalWidth = 508 // Total width of sprite sheet
  
  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(
      "/chest.png",
      // onLoad callback
      () => {
        console.log("Chest sprite loaded successfully")
      },
      // onProgress callback
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      // onError callback
      (error) => {
        console.error("Error loading chest sprite:", error)
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
    this.sprite.scale.set(1.5, 1.5, 1) // Made the chest smaller
    scene.add(this.sprite)

    // Set initial position - place it on the ground
    this.setPosition(5, 1, 5)
    
    // Set initial state (closed)
    this.updateFrameUV()
    
    // Add click event listener
    window.addEventListener('click', this.handleClick.bind(this))
  }

  public setPosition(x: number, y: number, z: number) {
    this.sprite.position.set(x, y, z)
  }

  public getPosition(): THREE.Vector3 {
    return this.sprite.position.clone()
  }

  public getSprite(): THREE.Sprite {
    return this.sprite
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
      // Toggle chest state
      this.isOpen = !this.isOpen
      this.updateFrameUV()
      console.log(`Chest is now ${this.isOpen ? 'open' : 'closed'}`)
      
      // Spawn logos when chest is opened for the first time
      if (this.isOpen && !this.hasSpawnedLogos) {
        this.spawnLogos()
        this.hasSpawnedLogos = true
      }
    }
  }

  private spawnLogos() {
    // Get the chest position
    const chestPos = this.getPosition()
    
    // Spawn each logo with its configured offset
    this.logoConfigs.forEach((config, index) => {
      // Create a position above and in front of the chest for the logo to float
      const logoStartPos = new THREE.Vector3(
        chestPos.x + config.xOffset, // Offset horizontally based on config
        chestPos.y + 0.5, // Start above the chest
        chestPos.z - 0.5  // Slightly in front of the chest
      )
      
      // Create the bouncing logo
      const logo = new BouncingLogo(
        this.sprite.parent as THREE.Scene,
        config.path,
        logoStartPos
      )
      
      // Activate the logo with a slight delay based on index
      setTimeout(() => {
        logo.activate()
      }, index * 150) // 150ms delay between each logo
      
      // Store the logo reference
      this.bouncingLogos.push(logo)
    })
  }

  public update(delta: number) {
    // Update all logos
    this.bouncingLogos.forEach(logo => {
      logo.update(delta)
    })
  }

  private updateFrameUV() {
    // The chest sprite has two states side by side:
    // - Closed state is on the left (x-offset 0)
    // - Open state is on the right (x-offset 0.5)
    this.texture.offset.set(this.isOpen ? 0.5 : 0, 0)
    this.texture.repeat.set(0.5, 1)
  }

  public dispose() {
    // Clean up event listener when component is disposed
    window.removeEventListener('click', this.handleClick.bind(this))
    
    // Clean up all logos
    this.bouncingLogos.forEach(logo => {
      logo.dispose()
    })
    this.bouncingLogos = []
  }
} 