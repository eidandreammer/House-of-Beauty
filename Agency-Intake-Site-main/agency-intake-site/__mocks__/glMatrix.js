module.exports = {
  mat4: {
    create: () => new Float32Array(16),
    multiply: () => {},
    targetTo: () => {},
    invert: () => {},
    perspective: () => {},
    fromTranslation: () => new Float32Array(16),
    fromScaling: () => new Float32Array(16),
    copy: () => {}
  },
  vec2: {
    create: () => new Float32Array(2),
    fromValues: (x, y) => new Float32Array([x, y]),
    set: () => {},
    sub: () => new Float32Array(2),
    add: () => new Float32Array(2),
    scale: () => {},
    sqrLen: () => 0
  },
  vec3: {
    create: () => new Float32Array(3),
    fromValues: (x, y, z) => new Float32Array([x, y, z]),
    normalize: (_, a) => a,
    dot: () => 0,
    transformQuat: (_, a) => a,
    negate: (_, a) => a,
    cross: () => new Float32Array(3),
    scale: () => {},
    squaredDistance: () => 0
  },
  quat: {
    create: () => new Float32Array(4),
    setAxisAngle: () => {},
    slerp: () => {},
    normalize: () => {},
    conjugate: () => new Float32Array(4),
    multiply: () => new Float32Array(4)
  }
}


