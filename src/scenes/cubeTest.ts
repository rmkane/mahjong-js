import { AxesViewer } from "@babylonjs/core/Debug";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3, Vector4 } from "@babylonjs/core/Maths/math.vector";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

// If you don't need the standard material you will still need to import it since the scene requires it.
// import "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import cubeTextureDiffuseUrl from "../../assets/textures/Brick_Decorative_Orange_albedo.jpg";
import cubeTextureBumpUrl from "../../assets/textures/Brick_Decorative_Orange_bump.jpg";

import boxSidesTextureUrl from "../../assets/textures/box_sides.png";

import grassTextureUrl from "../../assets/grass.jpg";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Color3, CreateBox } from "@babylonjs/core";

export class DefaultSceneWithTexture implements CreateSceneClass {
  createScene = async (
    engine: Engine,
    canvas: HTMLCanvasElement
  ): Promise<Scene> => {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    void Promise.all([
      import("@babylonjs/core/Debug/debugLayer"),
      import("@babylonjs/inspector"),
    ]).then((_values) => {
      console.log(_values);
      scene.debugLayer.show({
        handleResize: true,
        overlay: true,
        globalRoot: document.getElementById("#root") || undefined,
      });
    });

    // This creates and positions a free camera (non-mesh)
    const camera = new ArcRotateCamera(
      "my first camera",
      -Math.PI / 2,
      Math.PI / 3,
      10,
      new Vector3(0, 0, 0),
      scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = 0.1;

    const sphere = CreateSphere("sphere", { diameter: 1 }, scene);
    sphere.position = new Vector3(1, 1, 1);
    const sphereMaterial = new StandardMaterial("cube material", scene);
    sphereMaterial.diffuseColor = new Color3(1, 0, 0);
    sphere.material = sphereMaterial;

    const cube = CreateBox("cube", { size: 2 }, scene);
    cube.position.y = 1;
    const cubeMaterial = new StandardMaterial("cube material", scene);
    cubeMaterial.diffuseTexture = new Texture(cubeTextureDiffuseUrl, scene);
    cubeMaterial.bumpTexture = new Texture(cubeTextureBumpUrl, scene);
    cube.material = cubeMaterial;

    const faceUV: Vector4[] = [];
    for (let i = 0; i < 6; i++) {
      const x1 = i / 6,
        x2 = x1 + 1 / 6;
      faceUV[i] = new Vector4(x1, 0.0, x2, 1.0);
    }
    const cube2 = CreateBox("cube", { size: 1, faceUV: faceUV }, scene);
    cube2.position.y = 2.5;
    const cube2Material = new StandardMaterial("cube2 material", scene);
    cube2Material.diffuseTexture = new Texture(boxSidesTextureUrl, scene);
    cube2.material = cube2Material;

    const ground = CreateGround("ground", { width: 6, height: 6 }, scene);
    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    const light = new DirectionalLight("light", new Vector3(-2, -2, -2), scene);
    light.intensity = 0.9;
    light.position.y = 10;

    const shadowGenerator = new ShadowGenerator(512, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
    shadowGenerator.setDarkness(0.2);

    shadowGenerator.getShadowMap()!.renderList!.push(cube);
    shadowGenerator.getShadowMap()!.renderList!.push(cube2);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const axes = new AxesViewer(
      scene,
      5,
      2,
      undefined,
      undefined,
      undefined,
      0.25
    );

    return scene;
  };
}

export default new DefaultSceneWithTexture();
