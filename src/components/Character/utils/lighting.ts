import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // Warm key light (skin tone shaping)
  const directionalLight = new THREE.DirectionalLight(0xffc19f, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(3.2, 11.5, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Soft cool fill to avoid over-contrast
  const fillLight = new THREE.PointLight(0x8ab8ff, 0, 120, 2.5);
  fillLight.position.set(-4.5, 10, 6);
  scene.add(fillLight);

  // Purple rim to match reference glow
  const rimLight = new THREE.PointLight(0xbe8dff, 0, 140, 2.2);
  rimLight.position.set(0, 9, -8);
  scene.add(rimLight);

  // Screen glow light (animated later by monitor emissive)
  const pointLight = new THREE.PointLight(0xc89aff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.8, 85.8, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.72,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1.1,
      duration: duration,
      ease: ease,
    });
    gsap.to(fillLight, {
      intensity: 0.32,
      duration: duration,
      ease: ease,
    });
    gsap.to(rimLight, {
      intensity: 0.82,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
