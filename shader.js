skyVertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
skyFragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
  }
`



const fragmentShader = `
  varying vec2 vUv;
  vec2 random( vec2 p ) {
    return fract(
      sin(
        vec2(
          dot(p,vec2(127.1,311.7)),
          dot(p,vec2(269.5,183.3))
        )
      )*43758.5453
    );
  }
  float noise_perlin (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = dot(random(i),f);
    float b = dot(random(i + vec2(1., 0.)),f - vec2(1., 0.));
    float c = dot(random(i + vec2(0., 1.)),f - vec2(0., 1.));
    float d = dot(random(i + vec2(1., 1.)),f - vec2(1., 1.));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    // vec2 u = f*f*(3.0-2.0*f);
    vec2 u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
  }
  float get_F1(vec2 st) {
    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float min_dist = 1.;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 neighbor = vec2(float(i),float(j));
        vec2 point = random(i_st + neighbor);
        float d = length(point + neighbor - f_st);
        min_dist = min(min_dist,d);
      }
    }
    return pow(min_dist,2.);
  }
  float get_F2_F1(vec2 st) {
    // Tile the space
    float dists[27];
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float min_dist = 10.;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 neighbor = vec2(float(i),float(j));
        vec2 point = random(i_st + neighbor);
        float d = length(point + neighbor - f_st);
        dists[(i + 1) * 3 + (j + 1) ] = d;
        min_dist = min(min_dist,d);
      }
    }
    float sec_min_dist = 10.;
    for (int i = 0; i < 9; i++) {
      if (dists[i] != min_dist) {
        sec_min_dist = min(sec_min_dist,dists[i]);
      }
    }
    return pow(sec_min_dist - min_dist,.5);
  }
  float noise_sum_abs(vec2 p)
  {
    float f = 0.0;
    p = p * 4.0;
    float a = 1.;
    for (int i = 0; i < 5; i++) {
      f += a * abs(noise_perlin(p));
      p = 2.0 * p;
      a /= 2.;
    }

    return f;
  }
  void main( void ) {
    vec3 color = vec3(0.0);
        float dist = get_F2_F1(vUv);
        color += dist;

    gl_FragColor = vec4( color, 1.0 );

  }
  `

const vertexShader = `
  varying vec2 vUv;
  uniform vec2 scale;
  uniform vec2 offset;

  void main( void ) {
    vUv = uv * scale + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
