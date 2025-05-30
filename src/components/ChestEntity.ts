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
  private dialogCallback?: (msg: string) => void
  private handleClickBound: (event: MouseEvent) => void
  
  // Logo configuration
  private logoConfigs = [
    { path: "/react-logo.png", xOffset: -0.8 },
    { path: "/javascript-logo.png", xOffset: 0.8 },
    // { path: "/typescript-logo.png", xOffset: 0.8 },
    { path: "/nodejs-logo.png", xOffset: 1.5 },
    { path: "/nextjs-logo.png", xOffset: -1.5 },
    // { path: "/tailwindcss-logo.png", xOffset: 0.8 },
    { path: "/css-logo.png", xOffset: 2.4 },
    { path: "/html-logo.png", xOffset: -2.4 },
    // { path: "/python-logo.png", xOffset: 0.8 },
    { path: "/mongodb-logo.png", xOffset: 3.6 },
    { path: "/mysql-logo.png", xOffset: -3.6 },
    // { path: "/postgresql-logo.png", xOffset: 0.8 },
    { path: "/wordpress-logo.png", xOffset: 4.8 },
    { path: "/woocommerce-logo.png", xOffset: -4.8 },
    { path: "/zustand-logo.png", xOffset: 5.4 },
    { path: "/redux-logo.png", xOffset: -5.4 },
    { path: "/postgres-logo.png", xOffset: 6.6 },
    { path: "/tailwind-logo.png", xOffset: -6.6 },
    { path: "/typescript-logo.png", xOffset: 7.2 },
    { path: "/payloadcms-logo.png", xOffset: 8.4 },
    { path: "/trpc-logo.png", xOffset: -8.4 },
    { path: "/express-logo.png", xOffset: 9.6 },
    { path: "/supabase-logo.png", xOffset: 10.8 },
    // { path: "/docker-logo.png", xOffset: -6.6 },
    // { path: "/kubernetes-logo.png", xOffset: 0.8 },
    // { path: "/aws-logo.png", xOffset: 0.8 },
    
    
  ]
  
  // Sprite sheet configuration
  private frameWidth = 254 // Width of a single frame (half of total width)
  private frameHeight = 254 // Height of a single frame
  private totalWidth = 508 // Total width of sprite sheet
  
  constructor(scene: THREE.Scene, camera: THREE.Camera, dialogCallback?: (msg: string) => void) {
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.dialogCallback = dialogCallback
    
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
    
    // Bind handleClick and add click event listener
    this.handleClickBound = this.handleClick.bind(this)
    window.addEventListener('click', this.handleClickBound)
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
        // Trigger dialog message for chest open
        this.dialogCallback?.('These are my current skills!')
      }
    }
  }

  private spawnLogos() {
    // Get the chest position
    const chestPos = this.getPosition()

    // Spawn each logo with its configured offset
    for (const [index, config] of this.logoConfigs.entries()) {
      // Create a position above and in front of the chest for the logo to float
      const logoStartPos = new THREE.Vector3(
        chestPos.x + config.xOffset,
        chestPos.y + 0.5,
        chestPos.z - 0.5
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
      }, index * 150)

      // Store the logo reference
      this.bouncingLogos.push(logo)
    }
  }

  public update(delta: number) {
    // Update all logos
    for (const logo of this.bouncingLogos) {
      logo.update(delta)
    }
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
    window.removeEventListener('click', this.handleClickBound)
    // Remove chest sprite from scene to prevent duplicates
    if (this.sprite.parent) {
      this.sprite.parent.remove(this.sprite)
    }
    // Clean up all logos
    for (const logo of this.bouncingLogos) {
      logo.dispose()
    }
    this.bouncingLogos = []
  }
} 