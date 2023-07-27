import { AxesViewer } from "@babylonjs/core/Debug";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

// If you don't need the standard material you will still need to import it since the scene requires it.
// import "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import "@babylonjs/loaders/glTF";

import tileModel from "../../assets/staging/tile.glb";
import tileDiffuseTexture from "../../assets/staging/Tile Base UV Diffuse.png";
import tileBumpTexture from "../../assets/staging/Tile UV Bump.png";

import grassTextureUrl from "../../assets/grass.jpg";

import { HemisphericLight, PBRMaterial, SceneLoader } from "@babylonjs/core";

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

    // Light
    const light = new HemisphericLight("light", new Vector3(0, 0, 0), scene);
    light.intensity = 0.8;

    const tile = await SceneLoader.ImportMeshAsync(
      "",
      "",
      tileModel,
      scene,
      undefined,
      ".glb"
    );
    tile.meshes[0].position.y = 0.63;
    tile.meshes[0].rotation = new Vector3(0.0, 0.0, 0.0); // Needed!

    //const tileMaterial: PBRMaterial = tile.meshes[1].material as PBRMaterial;
    //tileMaterial.albedoTexture = new Texture(tileDiffuseTexture, scene)

    const tileMaterial = new PBRMaterial("tile material", scene);
    tileMaterial.albedoTexture = new Texture(
      tileDiffuseTexture,
      scene,
      undefined,
      false
    );
    tileMaterial.metallic = 0; // Needed!
    tileMaterial.roughness = 0; // Needed!
    //tileMaterial.bumpTexture = new Texture(tileBumpTexture, scene);
    //tile.meshes[0].material = tileMaterial;
    tile.meshes[1].material = tileMaterial;

    const ground = CreateGround("ground", { width: 6, height: 6 }, scene);
    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

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
