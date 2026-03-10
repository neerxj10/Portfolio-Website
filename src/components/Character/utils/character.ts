import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

function paintHeadAndShirt(mesh: THREE.Mesh) {
  const srcGeometry = mesh.geometry as THREE.BufferGeometry;
  const geometry = srcGeometry.clone();
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  if (!bbox) return;

  const pos = geometry.getAttribute("position");
  const colors = new Float32Array(pos.count * 3);
  const skin = new THREE.Color("#B67B63");
  const shirt = new THREE.Color("#111216");

  const size = new THREE.Vector3();
  bbox.getSize(size);
  const centerX = (bbox.min.x + bbox.max.x) * 0.5;
  const centerZ = (bbox.min.z + bbox.max.z) * 0.5;
  const headY = bbox.min.y + size.y * 0.84;
  const neckY = bbox.min.y + size.y * 0.78;
  const halfW = Math.max(size.x * 0.5, 0.0001);
  const halfD = Math.max(size.z * 0.5, 0.0001);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = (x - centerX) / halfW;
    const nz = (z - centerZ) / halfD;
    const radial = nx * nx + nz * nz;
    const inHead = y > headY && radial < 0.16;
    const inNeck = y > neckY && y <= headY && radial < 0.035;
    const c = inHead || inNeck ? skin : shirt;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  mesh.geometry = geometry;

  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((mat: any) => {
    mat.vertexColors = true;
    mat.map = null;
    mat.color.set("#ffffff");
    mat.roughness = 0.62;
    mat.metalness = 0.02;
    mat.emissive?.set?.("#000000");
    mat.emissiveIntensity = 0;
    mat.needsUpdate = true;
  });
}

function applyCharacterColors(mesh: THREE.Mesh) {
  const meshName = (mesh.name || "").toUpperCase();
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map((m) => m.clone());
  } else {
    mesh.material = mesh.material.clone();
  }
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

  // This mesh contains both face and upper body in this asset.
  if (meshName.includes("BODY.SHIRT") || meshName.includes("CUBE.002")) {
    paintHeadAndShirt(mesh);
    return;
  }

  mats.forEach((mat: any) => {
    if (!mat || !mat.color) return;

    // Base skin for this rig uses the default material on several head parts.
    if (mat.name === "default") {
      mat.color.set("#B67B63");
      mat.map = null;
      mat.roughness = 0.46;
      mat.metalness = 0.03;
      mat.emissive?.set?.("#1a0f0d");
      mat.emissiveIntensity = 0.03;
    }

    if (
      meshName.includes("FACE") ||
      meshName.includes("EAR") ||
      meshName.includes("HAND") ||
      meshName.includes("NECK")
    ) {
      mat.color.set("#B67B63");
      mat.map = null;
      mat.roughness = 0.46;
      mat.metalness = 0.03;
      mat.emissive?.set?.("#1a0f0d");
      mat.emissiveIntensity = 0.03;
    }

    if (meshName.includes("PLANE.007")) {
      mat.color.set("#2c2f35");
      mat.map = null;
      mat.roughness = 0.8;
      mat.metalness = 0.02;
      mat.emissive?.set?.("#08080a");
      mat.emissiveIntensity = 0.02;
    }

    if (
      meshName.includes("PANT") ||
      meshName.includes("CUBE.004") ||
      meshName.includes("SHOE") ||
      meshName.includes("SOLE") ||
      meshName.includes("CYLINDER.005") ||
      meshName.includes("CYLINDER.008")
    ) {
      mat.color.set("#111216");
      mat.map = null;
      mat.roughness = 0.84;
      mat.metalness = 0.02;
      mat.emissive?.set?.("#050507");
      mat.emissiveIntensity = 0.02;
    }

    if (meshName.includes("HAIR") || meshName.includes("EYEBROW")) {
      mat.color.set("#151518");
      mat.roughness = 0.72;
      mat.metalness = 0;
    }

    if (meshName.includes("CAP") || meshName.includes("HAT")) {
      mat.color.set("#E8E8EC");
      mat.roughness = 0.35;
      mat.metalness = 0.08;
    }

    mat.needsUpdate = true;
  });
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
                applyCharacterColors(mesh);
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
