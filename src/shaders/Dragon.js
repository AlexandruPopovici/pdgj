GAME.DRAGON = {

    uniforms: {

        "tDiffuse": { value: null },
        "tMask": {value: null},
        "resolution": { value: new THREE.Vector2(1 / 512, 1 / 256) }

    },

    vertexShader: [
        "varying vec2 skewedUv;",

		"void main() {",
            // Set regular texture coords
            "vec3 pos = position;",
            "skewedUv = ((vec2(pos.xy) + 1.0) / 2.0);",

            // How much we want to skew each axis by
            "float xSkew = 0.0;",
            "float ySkew = 0.5;",

            // Create a transform that will skew our texture coords
            "mat3 trans = mat3(",
               "1.0       , tan(xSkew), 0.0,",
               "tan(ySkew), 1.0,        0.0,",
               "0.0       , 0.0,        1.0",
            ");",

            // Apply the transform to our tex coords
            //"skewedUv = (trans * (vec3(skewedUv.xy, 0.0))).xy;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

    ].join("\n"),

    fragmentShader: [
        "varying vec2 skewedUv;",
		"uniform sampler2D tDiffuse;",
        "uniform sampler2D tMask;",
		"uniform vec2 resolution;",
		

		"void main() {",
            "vec2 vUv = gl_FragCoord.xy * resolution;",
            "vec4 mask = texture2D(tMask, vec2(skewedUv.x, skewedUv.y));",
            "vec4 color = texture2D(tDiffuse, vUv);",
			"gl_FragColor = color;//mix(color*mask.r, color, 1.-mask.a);",

		"}"

    ].join("\n")

};
