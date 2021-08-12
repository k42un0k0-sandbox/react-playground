import { useEffect, useRef } from "react";
import point_vert from "@/pagesComponents/three/shader/canvas/vtf/point_vert.glsl";
import point_frag from "@/pagesComponents/three/shader/canvas/vtf/point_frag.glsl";
import mapping_vert from "@/pagesComponents/three/shader/canvas/vtf/mapping_vert.glsl";
import mapping_frag from "@/pagesComponents/three/shader/canvas/vtf/mapping_frag.glsl";
import { matIV } from "@/pagesComponents/three/shader/canvas/minmatrix";
import {
  create_framebuffer,
  create_ibo,
  create_program,
  create_shader,
  create_vbo,
  set_attribute,
  sphere
} from "@/pagesComponents/three/shader/canvas/lib";

export default function Canvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    var i, j;
    // canvasエレメントを取得
    const c = ref.current;
    c.width = 512;
    c.height = 512;

    // webglコンテキストを取得
    var gl = c.getContext("webgl");

    // 頂点テクスチャフェッチが利用可能かどうかチェック
    i = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    if (i > 0) {
      console.log("max_vertex_texture_imaeg_unit: " + i);
    } else {
      alert("VTF not supported");
      return;
    }

    // シェーダ用変数
    var v_shader;
    var f_shader;

    // 点のレンダリングを行うシェーダ
    v_shader = create_shader(gl, "vert", point_vert);
    f_shader = create_shader(gl, "frag", point_frag);
    var pPrg = create_program(gl, v_shader, f_shader);

    // locationの初期化
    var pAttLocation = new Array();
    pAttLocation[0] = gl.getAttribLocation(pPrg, "index");
    var pAttStride = new Array();
    pAttStride[0] = 1;
    var pUniLocation = new Array();
    pUniLocation[0] = gl.getUniformLocation(pPrg, "mvpMatrix");
    pUniLocation[1] = gl.getUniformLocation(pPrg, "texture");

    // テクスチャへの描き込みを行うシェーダ
    v_shader = create_shader(gl, "vert", mapping_vert);
    f_shader = create_shader(gl, "frag", mapping_frag);
    var mPrg = create_program(gl, v_shader, f_shader);

    // locationの初期化
    var mAttLocation = new Array();
    mAttLocation[0] = gl.getAttribLocation(mPrg, "position");
    mAttLocation[1] = gl.getAttribLocation(mPrg, "index");
    var mAttStride = new Array();
    mAttStride[0] = 3;
    mAttStride[1] = 1;

    // 球体モデル
    var sphereData = sphere(15, 15, 1.0);

    // 位置座標
    var position = sphereData.p;

    // 頂点インデックス
    var indices = new Array();

    // 頂点の数分だけインデックスを格納
    j = position.length / 3;
    for (i = 0; i < j; i++) {
      indices.push(i);
    }

    // 頂点情報からVBO生成
    var pos = create_vbo(gl, position);
    var idx = create_vbo(gl, indices);
    var pVBOList = [idx];
    var mVBOList = [pos, idx];

    // 各種行列の生成と初期化
    var m = new matIV();
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());

    // ビュー×プロジェクション座標変換行列
    m.lookAt([0.0, 0.0, 5.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(45, c.width / c.height, 0.1, 10.0, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);

    // フレームバッファの生成
    var fBufferWidth = 16;
    var fBufferHeight = 16;
    var fBuffer = create_framebuffer(gl, fBufferWidth, fBufferHeight);

    // フレームバッファをバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer.f);

    // ビューポートを設定
    gl.viewport(0, 0, 16, 16);

    // フレームバッファを初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // プログラムオブジェクトの選択
    gl.useProgram(mPrg);

    // テクスチャへ頂点情報をレンダリング
    set_attribute(gl, mVBOList, mAttLocation, mAttStride);
    gl.drawArrays(gl.POINTS, 0, j);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // ビューポートを設定
    gl.viewport(0, 0, 512, 512);

    // プログラムオブジェクトの選択
    gl.useProgram(pPrg);

    // VBOの紐付け
    set_attribute(gl, pVBOList, pAttLocation, pAttStride);

    // フレームバッファをテクスチャとしてバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fBuffer.t);
    gl.uniform1i(pUniLocation[1], 0);

    // フラグ有効化
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // カウンタ他
    var count = 0;
    var rad;
    var timer;

    // 恒常ループ
    function draw() {
      // canvasを初期化
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // カウンタからラジアンを算出
      count++;
      rad = ((count % 360) * Math.PI) / 180;

      // 点を描画
      m.identity(mMatrix);
      m.rotate(mMatrix, rad, [0.0, 1.0, 0.0], mMatrix);
      m.multiply(tmpMatrix, mMatrix, mvpMatrix);
      gl.uniformMatrix4fv(pUniLocation[0], false, mvpMatrix);
      gl.drawArrays(gl.POINTS, 0, j);

      // コンテキストの再描画
      gl.flush();

      // ループのために再帰呼び出し
      setTimeout(draw, 1000 / 30);
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
