import { useEffect, useRef } from "react";
import vert from "@/pagesComponents/three/shader/canvas/vert.glsl";
import frag from "@/pagesComponents/three/shader/canvas/frag.glsl";
import { matIV } from "@/pagesComponents/three/shader/canvas/minmatrix";
import {
  create_program,
  create_shader,
  create_vbo,
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
    console.log(
      gl.COLOR_BUFFER_BIT.toString(2),
      gl.DEPTH_BUFFER_BIT.toString(2),
      (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT).toString(2)
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const v_shader = create_shader(gl, "vert", vert);
    const f_shader = create_shader(gl, "frag", frag);

    // プログラムオブジェクトの生成とリンク
    const prg = create_program(gl, v_shader, f_shader);

    // attributeLocationの取得
    var attLocation = new Array(2);
    attLocation[0] = gl.getAttribLocation(prg, "position");
    attLocation[1] = gl.getAttribLocation(prg, "color");

    // attributeの要素数を配列に格納
    var attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;

    // モデル(頂点)データ
    const vertex_position = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0];
    const vertex_color = [
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      1.0,
    ];

    // VBOの生成
    var position_vbo = create_vbo(gl, vertex_position);
    var color_vbo = create_vbo(gl, vertex_color);

    // VBOをバインドし登録する(位置情報)
    gl.bindBuffer(gl.ARRAY_BUFFER, position_vbo);
    gl.enableVertexAttribArray(attLocation[0]);
    gl.vertexAttribPointer(attLocation[0], attStride[0], gl.FLOAT, false, 0, 0);

    // VBOをバインドし登録する(色情報)
    gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo);
    gl.enableVertexAttribArray(attLocation[1]);
    gl.vertexAttribPointer(attLocation[1], attStride[1], gl.FLOAT, false, 0, 0);

    // minMatrix.js を用いた行列関連処理
    // matIVオブジェクトを生成
    var m = new matIV();

    // uniformLocationの取得
    var uniLocation = gl.getUniformLocation(prg, "mvpMatrix");

    // 各種行列の生成と初期化
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());

    // ビュー×プロジェクション座標変換行列
    m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);
    let count = 0;
    function draw() {
      // canvasを初期化
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // // 一つ目のモデルを移動するためのモデル座標変換行列
      // m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);

      // // モデル×ビュー×プロジェクション(一つ目のモデル)
      // m.multiply(tmpMatrix, mMatrix, mvpMatrix);

      // // uniformLocationへ座標変換行列を登録し描画する(一つ目のモデル)
      // gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
      // gl.drawArrays(gl.TRIANGLES, 0, 3);

      // カウンタをインクリメントする
      count++;

      // カウンタを元にラジアンを算出
      var rad = ((count % 360) * Math.PI) / 180;
      // モデル1は円の軌道を描き移動する
      var x = Math.cos(rad);
      var y = Math.sin(rad);
      m.identity(mMatrix);
      m.translate(mMatrix, [x, y, 0.0], mMatrix);
      const mul = Math.sin(((count % 200) / 100) * Math.PI) + 1.25;
      m.scale(mMatrix, [mul, mul, mul], mMatrix);

      // モデル×ビュー×プロジェクション(二つ目のモデル)
      m.multiply(tmpMatrix, mMatrix, mvpMatrix);

      // uniformLocationへ座標変換行列を登録し描画する(二つ目のモデル)
      gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // コンテキストの再描画
      gl.flush();
      // ループのために再帰呼び出し
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
