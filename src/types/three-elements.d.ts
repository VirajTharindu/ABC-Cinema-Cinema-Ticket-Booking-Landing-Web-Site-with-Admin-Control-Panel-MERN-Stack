import { ThreeElement } from '@react-three/fiber'
import LiquidDistortionMaterial from '../components/Three/LiquidDistortionMaterial'

declare module '@react-three/fiber' {
    interface ThreeElements {
        liquidDistortionMaterial: ThreeElement<typeof LiquidDistortionMaterial>
    }
}

// Ensure this is treated as a module
export { }
