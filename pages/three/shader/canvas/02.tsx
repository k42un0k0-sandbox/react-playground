import { useEffect, useRef } from "react";
import vert from "@/pagesComponents/three/shader/canvas/vert.glsl";
import frag from "@/pagesComponents/three/shader/canvas/frag.glsl";
import { matIV } from "@/pagesComponents/three/shader/canvas/minmatrix";
import {
  create_ibo,
  create_program,
  create_shader,
  create_vbo,
  set_attribute,
  torus,
} from "@/pagesComponents/three/shader/canvas/lib";

export default function Canvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    console.log(vert);
    const canvas = ref.current;
    console.log(canvas);
    if (canvas == null) return;
    const gl = canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);

    // 頂点シェーダとフラグメントシェーダの生成
    var v_shader = create_shader(gl, "vert", vert);
    var f_shader = create_shader(gl, "frag", frag);

    // プログラムオブジェクトの生成とリンク
    var prg = create_program(gl, v_shader, f_shader);

    // attributeLocationを配列に取得
    var attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, "position");
    attLocation[1] = gl.getAttribLocation(prg, "normal");
    attLocation[2] = gl.getAttribLocation(prg, "color");

    // attributeの要素数を配列に格納
    var attStride = new Array();
    attStride[0] = 3;
    attStride[1] = 3;
    attStride[2] = 4;

    // トーラスの頂点データを生成
    var torusData = torus(32, 32, 1.0, 2.0);
    var position = torusData[0];
    var normal = torusData[1];
    var color = torusData[2];
    var index = torusData[3];

    // VBOの生成
    var pos_vbo = create_vbo(gl, position);
    var nor_vbo = create_vbo(gl, normal);
    var col_vbo = create_vbo(gl, color);

    // VBO を登録する
    set_attribute(gl, [pos_vbo, nor_vbo, col_vbo], attLocation, attStride);

    // IBOの生成
    var ibo = create_ibo(gl, index);

    // IBOをバインドして登録する
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // uniformLocationを配列に取得
    var uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, "mvpMatrix");
    uniLocation[1] = gl.getUniformLocation(prg, "invMatrix");
    uniLocation[2] = gl.getUniformLocation(prg, "lightDirection");

    // minMatrix.js を用いた行列関連処理
    // matIVオブジェクトを生成
    var m = new matIV();

    // 各種行列の生成と初期化
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());
    var invMatrix = m.identity(m.create());

    // ビュー×プロジェクション座標変換行列
    m.lookAt([0.0, 0.0, 20.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(45, canvas.width / canvas.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);

    // 平行光源の向き
    var lightDirection = [-0.5, 0.5, 0.5];

    // カウンタの宣言
    var count = 0;

    // カリングと深度テストを有効にする
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);

    function draw() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // カウンタをインクリメントする
      count++;

      // カウンタを元にラジアンを算出
      var rad = ((count % 360) * Math.PI) / 180;

      // モデル座標変換行列の生成
      m.identity(mMatrix);
      m.rotate(mMatrix, rad, [0, 1, 1], mMatrix);
      m.multiply(tmpMatrix, mMatrix, mvpMatrix);

      // モデル座標変換行列から逆行列を生成
      m.inverse(mMatrix, invMatrix);

      // uniform変数の登録
      gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
      gl.uniformMatrix4fv(uniLocation[1], false, invMatrix);
      gl.uniform3fv(uniLocation[2], lightDirection);

      // モデルの描画
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

      // コンテキストの再描画
      gl.flush();

      requestAnimationFrame(draw);
    }
    draw();
  }, []);
  return (
    <canvas
      ref={ref}
      width="500"
      height="500"
      style={{ border: "1px solid black" }}
    />
  );
}
