/* eslint-disable */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/click-events-have-key-events, jsx-a11y/mouse-events-have-key-events */
// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { createWorld } from '../utils/worldCreator'
import { portfolioItems } from '../data/portfolioData'
import { PlayerController } from './PlayerController'
import { MeEntity } from './MeEntity'
import { ZeppelinEntity } from './ZeppelinEntity'
import { ChestEntity } from './ChestEntity'
import { GameCard } from './ui/GameCard'
import { GameButton } from './ui/GameButton'
import { experiences } from '../data/experienceData'
import { ExperienceHallTitle } from './ui/ExperienceHallTitle'
import { socialLinks } from '../data/socialLinks'
import { SocialHallTitle } from './ui/SocialHallTitle'
import { SocialLinkCard } from './ui/SocialLinkCard'
// import { ProjectShowcaseGame } from './project-showcase/project-showcase-game'
import ProjectsShowcaseV2 from './projects-showcase-v2/ProjectsShowcaseV2'

// Helper types for extended controls state and dialog
type Controls = { update: () => void }
export interface SceneEntitiesProps {
  onProjectActivate: (id: string) => void
  onExperienceActivate: (id: string) => void
  onDialog: (msg: string) => void
}

function SceneEntities({ onProjectActivate, onExperienceActivate, onDialog }: SceneEntitiesProps) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const scene = useThree((state) => state.scene)
  const controls = useThree((state) => state.controls) as Controls
  const playerRef = useRef<PlayerController | null>(null)
  const meRef = useRef<MeEntity | null>(null)
  const zeppelinRef = useRef<ZeppelinEntity | null>(null)
  const chestRef = useRef<ChestEntity | null>(null)

  // Initialize controllers and entities once when controls become available
  useEffect(() => {
    if (!controls || playerRef.current) return

    // Position camera
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 0, 0)

    // Initialize controllers and entities
    const player = new PlayerController(camera, controls, scene)
    playerRef.current = player
    meRef.current = new MeEntity(scene)
    zeppelinRef.current = new ZeppelinEntity(scene, camera, () => onDialog('CONTACT_REQUEST'))
    chestRef.current = new ChestEntity(scene, camera, onDialog)

    // Append hidden player position tracker
    const playerPosElement = document.createElement('div')
    playerPosElement.id = 'player-pos'
    playerPosElement.style.display = 'none'
    playerPosElement.setAttribute(
      'data-player-pos',
      JSON.stringify({ x: 0, y: 0, z: 0 }),
    )
    document.body.appendChild(playerPosElement)

    // Sprite loaded event
    const onSpriteLoaded = () => {
      const el = document.createElement('div')
      el.setAttribute('data-sprite-loaded', 'true')
      el.style.display = 'none'
      document.body.appendChild(el)
    }
    document.addEventListener('sprite-loaded', onSpriteLoaded)

    return () => {
      document.body.removeChild(playerPosElement)
      document.removeEventListener('sprite-loaded', onSpriteLoaded)
      chestRef.current?.dispose()
      zeppelinRef.current?.dispose()
    }
  }, [camera, controls, scene, onDialog])

  useFrame((_, delta) => {
    controls.update()
    playerRef.current?.update(delta)
    meRef.current?.update(delta)
    zeppelinRef.current?.update(delta)
    chestRef.current?.update(delta)
  })

  return (
    <>
      {/* World */}
      <primitive object={createWorld()} />
 
      {/* Work experience 'hall' opposite the Chest */}
      {/* Base position opposite Chest at (5,1,5) */}
      {(() => {
        // Section positioned to the right of the center
        const baseX = 8;
        const baseY = 2;
        const baseZ = -5;
        const spacing = 4;
        // Title placed above the row of cards
        const titleX = baseX + ((experiences.length - 1) * spacing) / 2;
        const titleY = baseY + 1.5;
        return (
          <>
            <ExperienceHallTitle position={[titleX, titleY, baseZ]} />
            {experiences.map((exp, idx) => (
              <GameCard
                key={exp.id}
                position={[baseX + idx * spacing, baseY, baseZ]}
                title={`${exp.role} @ ${exp.company}`}
                description={exp.description.join(' ')}
                startDate={exp.startDate}
                endDate={exp.endDate}
                onClick={() => onExperienceActivate(exp.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onExperienceActivate(exp.id)
                }}
              />
            ))}
          </>
        )
      })()}
      {/* Social links 'hall' to the left of center */}
      {(() => {
        const baseX = -8;
        const baseY = 2;
        const baseZ = -5;
        const spacing = 2;
        const titleX = baseX + ((socialLinks.length - 1) * spacing) / 2;
        const titleY = baseY + 1.5;
        return (
          <>
            <SocialHallTitle position={[titleX, titleY, baseZ]} />
            {socialLinks.map((link, idx) => (
              <SocialLinkCard
                key={link.id}
                link={link}
                position={[baseX + idx * spacing, baseY, baseZ]}
                size={120}
              />
            ))}
          </>
        );
      })()}
      

      {/* Projects showcase */}
      <ProjectsShowcaseV2 onProjectActivate={onProjectActivate} />
    </>
  )
}

export default function Game({ 
  onProjectActivate, 
  onExperienceActivate, 
  onDialog 
}: { 
  onProjectActivate: (id: string) => void; 
  onExperienceActivate: (id: string) => void;
  onDialog: (msg: string) => void 
}) {
  return (
    <Canvas
      onContextLost={(e) => { e.preventDefault(); console.error('WebGL context lost'); }}
      onContextRestored={() => console.log('WebGL context restored')}
      shadows
      gl={{ alpha: false }}
      camera={{ position: [0, 5, 15], fov: 75 }}
    >
      {/* Dark gray scene background */}
      <color attach="background" args={[0x242424]} />
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Controls */}
      <DreiOrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        minDistance={5}
        maxDistance={30}
        enablePan={false}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
        }}
      />
      {/* Scene Entities */}
      <SceneEntities 
        onProjectActivate={onProjectActivate} 
        onExperienceActivate={onExperienceActivate}
        onDialog={onDialog} 
      />
    </Canvas>
  )
}
