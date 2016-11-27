GAME.DRAGON = {

    uniforms: {

        "tDiffuse": { value: null },
        "tMask": {value: null},
        "resolution": { value: new THREE.Vector2(1 / 1024, 1 / 512) }

    },

    vertexShader: [

		"void main() {",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

    ].join("\n"),

    fragmentShader: [

		"uniform sampler2D tDiffuse;",
        "uniform sampler2D tMask;",
		"uniform vec2 resolution;",
		

		"void main() {",
            "vec2 vUv = gl_FragCoord.xy * resolution;",
            "vec4 mask = texture2D(tMask, vUv);",
            "vec4 color = texture2D(tDiffuse, vUv);",
			"gl_FragColor = mix(color, color, 1. - mask.a);",

		"}"

    ].join("\n")

};
