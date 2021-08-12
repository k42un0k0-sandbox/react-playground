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
