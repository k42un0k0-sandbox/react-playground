export function create_framebuffer(gl: WebGLRenderingContext, width, height) {
  // フレームバッファの生成
  var frameBuffer = gl.createFramebuffer();

  // フレームバッファをWebGLにバインド
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

  // 深度バッファ用レンダーバッファの生成とバインド
  var depthRenderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);

  // レンダーバッファを深度バッファとして設定
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

  // フレームバッファにレンダーバッファを関連付ける
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthRenderBuffer
  );

  // フレームバッファ用テクスチャの生成
  var fTexture = gl.createTexture();

  // フレームバッファ用のテクスチャをバインド
  gl.bindTexture(gl.TEXTURE_2D, fTexture);

  // フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );

  // テクスチャパラメータ
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // フレームバッファにテクスチャを関連付ける
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    fTexture,
    0
  );

  // 各種オブジェクトのバインドを解除
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // オブジェクトを返して終了
  return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };
}

export function set_attribute(gl, vbo, attL, attS) {
  // 引数として受け取った配列を処理する
  for (var i in vbo) {
    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

    // attributeLocationを有効にする
    gl.enableVertexAttribArray(attL[i]);

    // attributeLocationを通知し登録する
    gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
  }
}
// トーラスを生成する関数
export function torus(row, column, irad, orad) {
  var pos = new Array(),
    nor = new Array(),
    col = new Array(),
    idx = new Array();
  for (var i = 0; i <= row; i++) {
    var r = ((Math.PI * 2) / row) * i;
    var rr = Math.cos(r);
    var ry = Math.sin(r);
    for (var ii = 0; ii <= column; ii++) {
      var tr = ((Math.PI * 2) / column) * ii;
      var tx = (rr * irad + orad) * Math.cos(tr);
      var ty = ry * irad;
      var tz = (rr * irad + orad) * Math.sin(tr);
      var rx = rr * Math.cos(tr);
      var rz = rr * Math.sin(tr);
      pos.push(tx, ty, tz);
      nor.push(rx, ry, rz);
      var tc = hsva((360 / column) * ii, 1, 1, 1);
      col.push(tc[0], tc[1], tc[2], tc[3]);
    }
  }
  for (i = 0; i < row; i++) {
    for (ii = 0; ii < column; ii++) {
      r = (column + 1) * i + ii;
      idx.push(r, r + column + 1, r + 1);
      idx.push(r + column + 1, r + column + 2, r + 1);
    }
  }
  return [pos, nor, col, idx];
}

export function sphere(row, column, rad, color?) {
  var pos = new Array(),
    nor = new Array(),
    col = new Array(),
    st = new Array(),
    idx = new Array();
  for (var i = 0; i <= row; i++) {
    var r = (Math.PI / row) * i;
    var ry = Math.cos(r);
    var rr = Math.sin(r);
    for (var ii = 0; ii <= column; ii++) {
      var tr = ((Math.PI * 2) / column) * ii;
      var tx = rr * rad * Math.cos(tr);
      var ty = ry * rad;
      var tz = rr * rad * Math.sin(tr);
      var rx = rr * Math.cos(tr);
      var rz = rr * Math.sin(tr);
      if (color) {
        var tc = color;
      } else {
        tc = hsva((360 / row) * i, 1, 1, 1);
      }
      pos.push(tx, ty, tz);
      nor.push(rx, ry, rz);
      col.push(tc[0], tc[1], tc[2], tc[3]);
      st.push(1 - (1 / column) * ii, (1 / row) * i);
    }
  }
  r = 0;
  for (i = 0; i < row; i++) {
    for (ii = 0; ii < column; ii++) {
      r = (column + 1) * i + ii;
      idx.push(r, r + 1, r + column + 2);
      idx.push(r, r + column + 2, r + column + 1);
    }
  }
  return { p: pos, n: nor, c: col, t: st, i: idx };
}

export function cube(side, color) {
  var hs = side * 0.5;
  var pos = [
    -hs,
    -hs,
    hs,
    hs,
    -hs,
    hs,
    hs,
    hs,
    hs,
    -hs,
    hs,
    hs,
    -hs,
    -hs,
    -hs,
    -hs,
    hs,
    -hs,
    hs,
    hs,
    -hs,
    hs,
    -hs,
    -hs,
    -hs,
    hs,
    -hs,
    -hs,
    hs,
    hs,
    hs,
    hs,
    hs,
    hs,
    hs,
    -hs,
    -hs,
    -hs,
    -hs,
    hs,
    -hs,
    -hs,
    hs,
    -hs,
    hs,
    -hs,
    -hs,
    hs,
    hs,
    -hs,
    -hs,
    hs,
    hs,
    -hs,
    hs,
    hs,
    hs,
    hs,
    -hs,
    hs,
    -hs,
    -hs,
    -hs,
    -hs,
    -hs,
    hs,
    -hs,
    hs,
    hs,
    -hs,
    hs,
    -hs,
  ];
  var nor = [
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
    1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
  ];
  var col = new Array();
  for (var i = 0; i < pos.length / 3; i++) {
    if (color) {
      var tc = color;
    } else {
      tc = hsva((360 / pos.length / 3) * i, 1, 1, 1);
    }
    col.push(tc[0], tc[1], tc[2], tc[3]);
  }
  var st = [
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
  ];
  var idx = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ];
  return { p: pos, n: nor, c: col, t: st, i: idx };
}

function hsva(h: number, s: number, v: number, a: number) {
  if (s > 1 || v > 1 || a > 1) {
    return;
  }
  var th = h % 360;
  var i = Math.floor(th / 60);
  var f = th / 60 - i;
  var m = v * (1 - s);
  var n = v * (1 - s * f);
  var k = v * (1 - s * (1 - f));
  var color = new Array();
  if (s > 0 && s < 0) {
    color.push(v, v, v, a);
  } else {
    var r = new Array(v, n, m, m, k, v);
    var g = new Array(k, v, v, n, m, m);
    var b = new Array(m, m, k, v, v, n);
    color.push(r[i], g[i], b[i], a);
  }
  return color;
}
export function create_vbo(gl: WebGLRenderingContext, data: any) {
  // バッファオブジェクトの生成
  var vbo = gl.createBuffer();

  // バッファをバインドする
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // バッファにデータをセット
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  // バッファのバインドを無効化
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // 生成した VBO を返して終了
  return vbo;
}

export function create_ibo(gl: WebGLRenderingContext, data) {
  // バッファオブジェクトの生成
  var ibo = gl.createBuffer();

  // バッファをバインドする
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  // バッファにデータをセット
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

  // バッファのバインドを無効化
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // 生成したIBOを返して終了
  return ibo;
}

export function create_shader(
  gl: WebGLRenderingContext,
  type: string,
  text: string
) {
  // シェーダを格納する変数
  var shader;

  // scriptタグのtype属性をチェック
  switch (type) {
    // 頂点シェーダの場合
    case "vert":
      shader = gl.createShader(gl.VERTEX_SHADER);
      break;

    // フラグメントシェーダの場合
    case "frag":
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      break;
    default:
      return;
  }

  // 生成されたシェーダにソースを割り当てる
  gl.shaderSource(shader, text);

  // シェーダをコンパイルする
  gl.compileShader(shader);

  // シェーダが正しくコンパイルされたかチェック
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // 成功していたらシェーダを返して終了
    return shader;
  } else {
    // 失敗していたらエラーログをアラートする
    alert(gl.getShaderInfoLog(shader));
  }
}

export function create_program(gl: WebGLRenderingContext, vs, fs) {
  // プログラムオブジェクトの生成
  var program = gl.createProgram();

  // プログラムオブジェクトにシェーダを割り当てる
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  // シェーダをリンク
  gl.linkProgram(program);

  // シェーダのリンクが正しく行なわれたかチェック
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // 成功していたらプログラムオブジェクトを有効にする
    gl.useProgram(program);

    // プログラムオブジェクトを返して終了
    return program;
  } else {
    // 失敗していたらエラーログをアラートする
    alert(gl.getProgramInfoLog(program));
  }
}
