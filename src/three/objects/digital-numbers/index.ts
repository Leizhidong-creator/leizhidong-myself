import { PlaneGeometry, ShaderMaterial, InstancedMesh, Matrix4, InstancedBufferAttribute, Color } from "three";
import vertexShader from "../../shaders/digital-numbers/vertex.glsl";
import fragmentShader from "../../shaders/digital-numbers/fragment.glsl";
import { resources } from "../../../utils/resources";
import { sizes } from "../../../utils/sizes";
import gsap from "gsap";

import type { Object3D, Texture, Vector3 } from "three";

interface Props {
  count: number;
  scene: Object3D;
  position: Vector3;
  scale: number;
  renderOrder?: number;
  color?: Color;
}

export class DigitalNumbers {
  private count: number;
  private scene: Object3D;
  private position: Vector3;
  private scale: number;
  private renderOrder: number;
  private color: Color;
  private mesh: InstancedMesh | null = null;
  private geometry: PlaneGeometry | null = null;
  private material: ShaderMaterial | null = null;
  private frameAttribute: InstancedBufferAttribute | null = null;
  private currentNumber: number = 0;
  private uniforms: {
    uTexture: { value: Texture | null };
    uColor: { value: Color };
  } = {
    uTexture: { value: null },
    uColor: { value: new Color(1, 1, 1) },
  };

  constructor(props: Props) {
    this.count = props.count;
    this.scene = props.scene;
    this.position = props.position;
    this.scale = props.scale;
    this.renderOrder = props.renderOrder || 22;
    this.color = props.color || new Color(1, 1, 1);
    this.uniforms.uColor.value = this.color;
    this.init();

    gsap.ticker.add(this.tick.bind(this));
  }

  private init() {
    this.geometry = new PlaneGeometry(1, 1);

    const texture = resources.items["numbers-bitmap"];

    texture.generateMipmaps = false;
    this.uniforms.uTexture.value = texture;

    this.material = new ShaderMaterial({
      transparent: true,
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    });

    this.mesh = new InstancedMesh(this.geometry, this.material, this.count);

    this.mesh.renderOrder = this.renderOrder;
    this.mesh.scale.set(this.scale, this.scale, this.scale);

    const centerIndex = Math.floor(this.count / 2);
    const spacing = 0.92;

    const matrix = new Matrix4();
    for (let i = 0; i < this.count; i++) {
      const offset = (i - centerIndex) * spacing;
      matrix.makeTranslation(offset, 0, 0);
      this.mesh.setMatrixAt(i, matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;

    // Create instanced buffer attribute for frame
    const frameArray = new Float32Array(this.count);
    this.frameAttribute = new InstancedBufferAttribute(frameArray, 1);
    this.geometry.setAttribute("frame", this.frameAttribute);

    this.mesh.renderOrder = 22;
    this.mesh.position.copy(this.position);

    this.scene.add(this.mesh);
  }

  public updateFrames(number: number) {
    if (!this.frameAttribute || number === this.currentNumber) return;
    this.currentNumber = number;

    // Convert number to string and get digits
    const numStr = number.toString();
    const digits = numStr.split("").map(Number);

    // Pad with zeros at the beginning to match count
    const paddedDigits: number[] = [];
    for (let i = 0; i < this.count; i++) {
      const digitIndex = i - (this.count - digits.length);
      paddedDigits[i] = digitIndex >= 0 ? digits[digitIndex]! : 0;
    }

    // Update frame attribute
    for (let i = 0; i < this.count; i++) {
      this.frameAttribute.setX(i, paddedDigits[i]!);
    }

    this.frameAttribute.needsUpdate = true;
  }

  private tick() {
    if (!this.mesh) return;
    this.mesh.visible = sizes.isLandscape;
  }

  public destroy() {
    gsap.ticker.remove(this.tick);
  }
}
