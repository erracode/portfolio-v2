import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { createWorld } from "../utils/worldCreator"
import { portfolioItems } from "../data/portfolioData"
import { PlayerController } from "./PlayerController"
import { MeEntity } from "./MeEntity"
import { ZeppelinEntity } from "./ZeppelinEntity"
import { ChestEntity } from "./ChestEntity"

interface GameProps {
  onProjectActivate: (projectId: string) => void
}

const Game = ({ onProjectActivate }: GameProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const playerRef = useRef<PlayerController | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const meEntityRef = useRef<MeEntity | null>(null)
  const zeppelinRef = useRef<ZeppelinEntity | null>(null)
  const chestRef = useRef<ChestEntity | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x666666) // Medium gray background

    // Initialize clock for delta time
    const clock = new THREE.Clock()
    clockRef.current = clock

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2.1 // Limit camera angle to prevent seeing below the ground
    controls.minPolarAngle = Math.PI / 6 // Prevent looking too high
    controls.minDistance = 5
    controls.maxDistance = 30
    controls.enablePan = false // Disable right-click panning
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: undefined // Disable right-click
    }
    controlsRef.current = controls

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Create world (simplified)
    const world = createWorld()
    scene.add(world)

    // Add simple markers for portfolio items
    portfolioItems.forEach((item) => {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
          color: 0xaaaaaa, // Light gray
          transparent: true,
          opacity: 0.7,
        }),
      )
      marker.position.set(item.position.x, item.position.y, item.position.z)
      marker.userData = { id: item.id, type: "portfolioItem" }
      scene.add(marker)
    })

    // Add hidden element for player position tracking
    const playerPosElement = document.createElement("div")
    playerPosElement.id = "player-pos"
    playerPosElement.style.display = "none"
    playerPosElement.setAttribute("data-player-pos", JSON.stringify({ x: 0, y: 0, z: 0 }))
    document.body.appendChild(playerPosElement)

    // Initialize player controller
    const player = new PlayerController(camera, controls, scene)
    playerRef.current = player

    // Initialize MeEntity
    const meEntity = new MeEntity(scene)
    meEntityRef.current = meEntity

    // Initialize ZeppelinEntity
    const zeppelin = new ZeppelinEntity(scene)
    zeppelinRef.current = zeppelin

    // Initialize ChestEntity
    const chest = new ChestEntity(scene, camera)
    chestRef.current = chest

    // Add sprite loaded event listener
    document.addEventListener("sprite-loaded", () => {
      const spriteLoadedElement = document.createElement("div")
      spriteLoadedElement.setAttribute("data-sprite-loaded", "true")
      spriteLoadedElement.style.display = "none"
      document.body.appendChild(spriteLoadedElement)
    })

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object
        if (object.userData && object.userData.type === "portfolioItem") {
          onProjectActivate(object.userData.id)
          break
        }
      }
    }

    window.addEventListener("click", handleClick)

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      const delta = clock.getDelta()

      if (controls) controls.update()
      if (player) player.update(delta)
      if (meEntity) meEntity.update(delta)
      if (zeppelin) zeppelin.update(delta)
      if (chest) chest.update(delta)

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("click", handleClick)
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement)
      }
      if (playerPosElement) {
        playerPosElement.remove()
      }
      if (chest) {
        chest.dispose()
      }
      const spriteLoadedElement = document.querySelector("[data-sprite-loaded]")
      if (spriteLoadedElement) {
        spriteLoadedElement.remove()
      }
    }
  }, [onProjectActivate])

  return <div ref={mountRef} className="w-full h-full" />
}

export default Game
