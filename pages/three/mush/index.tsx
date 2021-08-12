import { useEffect } from "react";
import * as THREE from "three";

export default function Mush() {
  useEffect(() => {
    // シーンの初期化 -----------------------------
    const scene = new THREE.Scene();

    // オブジェクトの初期化 ----------------------------

    // ジオメトリーの作成
    let geometry = new THREE.BoxGeometry(100, 18, 60);
    console.log(geometry.attributes)
    // 面(face)のマテリアル番号をすべて 0 にする(単一テクスチャーを使うように)
    geometry.attributes.face.forEach((face) => {
      face.materialIndex = 0;
    });

    // テクスチャマッピングデータ(topleftはくり抜きたい部品の向きを正したときの左上にあたる頂点の番号)
    let tex = {
      resolution: { width: 408, height: 458 },
      uv: [
        { tag: "left", x: 4, y: 231, w: 54, h: 174, topleft: 1 },
        { tag: "right", x: 354, y: 231, w: 54, h: 174, topleft: 3 },
        { tag: "top", x: 57, y: 231, w: 298, h: 174, topleft: 0 },
        { tag: "bottom", x: 54, y: 0, w: 298, h: 174, topleft: 2 },
        { tag: "front", x: 57, y: 404, w: 298, h: 54, topleft: 0 },
        { tag: "back", x: 57, y: 176, w: 298, h: 54, topleft: 2 },
      ],
    };

    let points = [];
    for (let i = 0; i < 6; i++) {
      // テクスチャデータから矩形情報を作成 ( 座標を width または height で割る )
      // また、座標系はボトムアップの為、垂直座標の上下を反転させる
      let rect = {
        left: tex.uv[i].x / tex.resolution.width,
        top: 1 - tex.uv[i].y / tex.resolution.height,
        right: (tex.uv[i].x + tex.uv[i].w) / tex.resolution.width,
        bottom: 1 - (tex.uv[i].y + tex.uv[i].h) / tex.resolution.height,
      };

      // 矩形情報から頂点(UV Vertex)データを作成
      // order は 画像の回転を修正する為の情報
      points[i] = [
        { x: rect.left, y: rect.top, order: (tex.uv[i].topleft + 0) % 4 },
        { x: rect.right, y: rect.top, order: (tex.uv[i].topleft + 1) % 4 },
        { x: rect.right, y: rect.bottom, order: (tex.uv[i].topleft + 2) % 4 },
        { x: rect.left, y: rect.bottom, order: (tex.uv[i].topleft + 3) % 4 },
      ];

      // ソートを使ってテクスチャの左上から順になるようにする(画像は上下反転)
      //  3 _____ 2
      //   |    /|
      //   |  /  |
      //   |/____|
      //  0       1
      points[i] = points[i].sort((a, b) => {
        return b.order - a.order;
      });
    }

    // 頂点データから三角形データ(THREE.Vector2 の Array)を作成する関数
    // point   : 4点の頂点座標の array
    // indices : 作成する3点の頂点のindexを指定する array
    //           Geometry.face[] の頂点順に従って指定する必要がある
    // shift   : テクスチャの向きを回転させる時は 1 ～ 3 加算する
    let triangle = (point, indices, shift) => {
      shift = shift ? shift : 0;
      indices = indices.map((v) => (v + shift) % 4);
      return [
        new THREE.Vector2(point[indices[0]].x, point[indices[0]].y),
        new THREE.Vector2(point[indices[1]].x, point[indices[1]].y),
        new THREE.Vector2(point[indices[2]].x, point[indices[2]].y),
      ];
    };

    // テクスチャ頂点情報をジオメトリへ追加(THREE.Geometry.faceVertexUvs)
    geometry.faceVertexUvs[0] = [
      // right
      triangle(points[0], [1, 2, 0]),
      triangle(points[0], [2, 3, 0]),
      // left
      triangle(points[1], [1, 2, 0]),
      triangle(points[1], [2, 3, 0]),
      // top
      triangle(points[2], [1, 2, 0], 2),
      triangle(points[2], [2, 3, 0], 2),
      // bottom
      triangle(points[3], [1, 2, 0]),
      triangle(points[3], [2, 3, 0]),
      // front
      triangle(points[4], [1, 2, 0], 2),
      triangle(points[4], [2, 3, 0], 2),
      // back
      triangle(points[5], [1, 2, 0], 2),
      triangle(points[5], [2, 3, 0], 2),
    ];

    // ジオメトリの更新フラグを立てる
    geometry.uvsNeedUpdate = true;

    // IMGタグからテクスチャオブジェクトを作成
    let texture = new THREE.CanvasTexture(document.querySelector("#texture"));
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.type = THREE.FloatType;

    // Meshオブジェクトの作成
    let box = new THREE.Mesh(geometry, [
      new THREE.MeshLambertMaterial({ map: texture }),
    ]);

    // シーンへ追加
    scene.add(box);

    // レンダリング開始 -----------------------------
    Render();

    function Render() {
      // initialize renderer --------------------------
      const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#myCanvas"),
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.setClearColor(0xffffff, 0);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // initilalize camera --------------------------
      var viewSize = 300;

      var aspectRatio = window.innerWidth / window.innerHeight;

      const camera = new THREE.PerspectiveCamera(20, aspectRatio, 1, 1000);

      camera.position.set(-viewSize / 2, viewSize * 0.8168, viewSize);
      camera.lookAt(scene.position);
      camera.zoom = 1.0;
      camera.updateProjectionMatrix();
      controls = new THREE.OrbitControls(camera, renderer.domElement);

      window.onresize = function () {
        w = window.innerWidth;
        h = window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      // Lighting -------------------------------------------------------------------------------------

      const dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.intensity = 0.46;
      dirLight.position.set(-1, 2.25, 1.24).normalize();
      dirLight.castShadow = true;
      scene.add(dirLight);
      var ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.intensity = 0.618;
      scene.add(ambientLight);

      // Run tick -------------------------------------------------------------------------------------

      tick();

      function tick() {
        // Rendering
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
    }
  });
  return (
    <div>
      <canvas id="myCanvas"></canvas>
      <img src="/mush.png" alt="mush" />
    </div>
  );
}
