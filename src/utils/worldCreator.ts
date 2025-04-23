import * as THREE from "three"

export function createWorld() {
  const world = new THREE.Group()

  // Create ground - simplified with gray color
  const groundGeometry = new THREE.PlaneGeometry(100, 100)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333, // Dark gray
    roughness: 0.8,
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  world.add(ground)

  // Add a grid helper for development reference
  const gridHelper = new THREE.GridHelper(100, 100, 0x555555, 0x222222)
  world.add(gridHelper)

  return world
}
