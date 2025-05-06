// Enemy.ts
import * as THREE from "three";

export class Enemy {
  private mesh: THREE.Mesh;
  private health: number = 100;
  private speed: number = 2;
  private targetPosition: THREE.Vector3;
  private isActive: boolean = true;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    // Create a simple cube enemy
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      metalness: 0.3,
      roughness: 0.4
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    // Set initial random target position
    this.targetPosition = new THREE.Vector3(
      position.x + (Math.random() * 10 - 5),
      position.y,
      position.z + (Math.random() * 10 - 5)
    );
  }

  update(deltaTime: number, playerPosition: THREE.Vector3) {
    if (!this.isActive) return;

    // Simple AI: Move toward player
    const direction = new THREE.Vector3().subVectors(
      playerPosition,
      this.mesh.position
    ).normalize();

    this.mesh.position.add(
      direction.multiplyScalar(this.speed * deltaTime)
    );

    // Rotate to face movement direction
    if (direction.length() > 0) {
      this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    }

    // Check if reached target, set new random target
    if (this.mesh.position.distanceTo(this.targetPosition) < 0.5) {
      this.targetPosition = new THREE.Vector3(
        this.mesh.position.x + (Math.random() * 10 - 5),
        this.mesh.position.y,
        this.mesh.position.z + (Math.random() * 10 - 5)
      );
    }
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.isActive = false;
    this.mesh.parent?.remove(this.mesh);
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }
}