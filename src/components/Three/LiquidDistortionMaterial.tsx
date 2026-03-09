import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const LiquidDistortionMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(0, 0),
    uHover: 0,
    uResolution: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Liquid distortion logic
    float distortion = sin(uv.y * 10.0 + uTime) * 0.02 * uHover;
    distortion += cos(uv.x * 10.0 + uTime) * 0.02 * uHover;
    
    // Mouse influence
    float dist = distance(uv, uMouse);
    float mouseInfluence = (1.0 - smoothstep(0.0, 0.4, dist)) * 0.05 * uHover;
    
    vec2 distortedUv = uv + vec2(distortion + mouseInfluence);
    
    vec4 tex = texture2D(uTexture, distortedUv);
    
    // Vignette / Cinematic look
    float vignette = 1.0 - distance(vUv, vec2(0.5)) * 0.5;
    
    gl_FragColor = vec4(tex.rgb * vignette, tex.a);
  }
  `
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      liquidDistortionMaterial: any;
    }
  }
}

extend({ LiquidDistortionMaterial });

export default LiquidDistortionMaterial;
