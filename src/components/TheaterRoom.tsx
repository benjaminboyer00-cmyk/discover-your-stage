import { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Box, Plane, Text } from '@react-three/drei';
import * as THREE from 'three';

interface TheaterRoomProps {
  onReachStage: () => void;
}

function Room({ onReachStage }: { onReachStage: () => void }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [velocity] = useState(() => new THREE.Vector3());
  const [direction] = useState(() => new THREE.Vector3());
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  useEffect(() => {
    camera.position.set(0, 1.6, 8);

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyZ':
        case 'KeyW':
        case 'ArrowUp':
          setMoveForward(true);
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMoveBackward(true);
          break;
        case 'KeyQ':
        case 'KeyA':
        case 'ArrowLeft':
          setMoveLeft(true);
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMoveRight(true);
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyZ':
        case 'KeyW':
        case 'ArrowUp':
          setMoveForward(false);
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMoveBackward(false);
          break;
        case 'KeyQ':
        case 'KeyA':
        case 'ArrowLeft':
          setMoveLeft(false);
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMoveRight(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 25.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 25.0 * delta;

    controlsRef.current.moveRight(-velocity.x * delta);
    controlsRef.current.moveForward(-velocity.z * delta);

    // Limites de la pièce
    camera.position.x = Math.max(-6, Math.min(6, camera.position.x));
    camera.position.z = Math.max(-8, Math.min(8, camera.position.z));

    // Vérifier si proche de la scène
    if (camera.position.z < -6) {
      onReachStage();
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      {/* Éclairage */}
      <ambientLight intensity={0.2} />
      <spotLight
        position={[0, 8, -5]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#ffd700"
        castShadow
      />
      <pointLight position={[-5, 3, 0]} intensity={0.5} color="#ff6b6b" />
      <pointLight position={[5, 3, 0]} intensity={0.5} color="#ff6b6b" />

      {/* Sol */}
      <Plane
        args={[15, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#2a1810" />
      </Plane>

      {/* Plafond */}
      <Plane
        args={[15, 20]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 5, 0]}
      >
        <meshStandardMaterial color="#1a1010" />
      </Plane>

      {/* Murs */}
      {/* Mur du fond (scène) */}
      <Plane args={[15, 5]} position={[0, 2.5, -10]}>
        <meshStandardMaterial color="#8b0000" />
      </Plane>

      {/* Rideaux de scène */}
      <Box args={[2, 4, 0.2]} position={[-5, 2, -9]}>
        <meshStandardMaterial color="#800020" />
      </Box>
      <Box args={[2, 4, 0.2]} position={[5, 2, -9]}>
        <meshStandardMaterial color="#800020" />
      </Box>

      {/* Mur arrière */}
      <Plane args={[15, 5]} position={[0, 2.5, 10]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#1a1010" />
      </Plane>

      {/* Murs latéraux */}
      <Plane args={[20, 5]} position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#2a1515" />
      </Plane>
      <Plane args={[20, 5]} position={[7.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#2a1515" />
      </Plane>

      {/* Scène */}
      <Box args={[12, 0.5, 4]} position={[0, 0.25, -8]}>
        <meshStandardMaterial color="#3d2817" />
      </Box>

      {/* Sièges de théâtre */}
      {[-4, -2, 0, 2, 4].map((x) =>
        [2, 4, 6].map((z) => (
          <Box key={`${x}-${z}`} args={[1.2, 1, 0.8]} position={[x, 0.5, z]}>
            <meshStandardMaterial color="#800020" />
          </Box>
        ))
      )}

      {/* Texte indicatif */}
      <Text
        position={[0, 3.5, -9.5]}
        fontSize={0.5}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        ★ LA SCÈNE ★
      </Text>
    </>
  );
}

export const TheaterRoom = ({ onReachStage }: TheaterRoomProps) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  const handleClick = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
    }
  };

  return (
    <div className="w-full h-screen relative bg-background">
      <Canvas shadows camera={{ position: [0, 1.6, 8], fov: 75 }}>
        <color attach="background" args={['#141010']} />
        <fog attach="fog" args={['#141010', 5, 25]} />
        <Room onReachStage={onReachStage} />
      </Canvas>

      {!isLocked && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-background/90 cursor-pointer z-10"
          onClick={handleClick}
        >
          <div className="text-center">
            <h2 className="theater-title mb-4">Bienvenue au Théâtre</h2>
            <p className="text-muted-foreground text-xl mb-8">
              Clique pour entrer et explore la salle
            </p>
            <p className="text-foreground text-lg">
              Utilise <span className="text-primary font-bold">ZQSD</span> ou les <span className="text-primary font-bold">flèches</span> pour te déplacer
            </p>
            <p className="text-muted-foreground mt-4">
              Dirige-toi vers la scène...
            </p>
          </div>
        </div>
      )}

      {isLocked && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
          <p className="text-primary text-sm bg-background/50 px-4 py-2 rounded">
            Appuie sur <span className="font-bold">ESC</span> pour libérer la souris
          </p>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <p className="text-gold animate-pulse text-lg">
          → Avance vers la scène ←
        </p>
      </div>
    </div>
  );
};
