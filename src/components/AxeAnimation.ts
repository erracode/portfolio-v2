import * as THREE from "three"

export class AxeAnimation {
  private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  private material: THREE.MeshBasicMaterial
  private texture: THREE.Texture
  private currentFrame = 0
  private frameTime = 0
  private isPlaying = false
  private velocity = new THREE.Vector3()
  
  // Animation configuration
  private totalFrames = 8 // 8 frames for axe animation
  private animationDuration = 0.2 // Faster animation (5 full cycles per second)
  private frameInterval: number
  
  constructor(scene: THREE.Scene) {
    this.frameInterval = this.animationDuration / this.totalFrames
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(
      "/axe-sheet.png",
      () => {
        console.log("Axe sprite sheet loaded successfully")
      },
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      (error) => {
        console.error("Error loading axe sprite sheet:", error)
      }
    )

    // Set up texture properties
    this.texture.magFilter = THREE.NearestFilter
    this.texture.minFilter = THREE.NearestFilter
    this.texture.colorSpace = THREE.SRGBColorSpace

    // Set up mesh material for plane
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      depthWrite: true,
    })

    // Create a plane mesh for the axe frame (unit width, aspect-correct height)
    const frameAspect = 220 / (1720 / this.totalFrames) // height / frame width in pixels
    const geometry = new THREE.PlaneGeometry(1, frameAspect)
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.visible = false
    // Tilt the plane upward so the axe faces more towards the sky
    this.mesh.rotation.x = -Math.PI / 2  // 90° tilt
    scene.add(this.mesh)

    // Set initial UV
    this.updateFrameUV()
  }

  public setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z)
  }

  public setScale(x: number, y: number, z: number) {
    this.mesh.scale.set(x, y, z)
  }

  public throw(startPos: THREE.Vector3, direction: THREE.Vector3, speed = 15) {
    this.mesh.position.copy(startPos)
    this.velocity.copy(direction).multiplyScalar(speed)
    this.currentFrame = 0
    this.frameTime = 0
    this.isPlaying = true
    this.mesh.visible = true
    this.updateFrameUV()
  }

  public update(delta: number) {
    if (!this.isPlaying) return

    // Update position based on velocity
    this.mesh.position.add(this.velocity.clone().multiplyScalar(delta))
    
    // Update animation frame
    this.frameTime += delta
    if (this.frameTime >= this.frameInterval) {
      this.frameTime = 0
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames
      this.updateFrameUV()
    }
  }

  private updateFrameUV() {
    // Calculate UV coordinates for current frame
    const frameWidth = 1 / this.totalFrames
    this.texture.offset.x = this.currentFrame * frameWidth
    this.texture.repeat.x = frameWidth
    this.texture.repeat.y = 1
  }

  public stop() {
    this.isPlaying = false
    this.mesh.visible = false
  }

  public isActive(): boolean {
    return this.isPlaying
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position
  }

  public dispose() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh)
    }
    this.mesh.geometry.dispose()
    this.material.dispose()
    this.texture.dispose()
  }
}