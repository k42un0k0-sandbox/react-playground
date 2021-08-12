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
  if (!s > 0 && !s < 0) {
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
