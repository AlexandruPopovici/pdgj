GAME.Audio = function () {
    this.ambient = undefined;
    this.fireEffects = [];
    this.roar = undefined;
}

GAME.Audio.prototype = {
    constructor: GAME.Audio,

    init: function () {
        // instantiate a listener
        var audioListener = new THREE.AudioListener();

        // add the listener to the camera
        GAME.camera.add(audioListener);

        // instantiate audio object
        this.ambient = new THREE.Audio(audioListener);

        // add the audio object to the scene
        GAME.scene.add(this.ambient);

        // instantiate a loader
        var loader = new THREE.AudioLoader();
        // load a resource
        loader.load(
            // resource URL
            'assets/extra/ambient.mp3',
            // Function when resource is loaded
            function (audioBuffer) {
                // set the audio object buffer to the loaded object
                this.ambient.setBuffer(audioBuffer);

                // play the audio
                this.ambient.setLoop(true);
                this.ambient.setVolume(0.4);
                this.ambient.play();
            }.bind(this),
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened');
            }
        );

        loader.load(
            // resource URL
            'assets/extra/fire1.mp3',
            // Function when resource is loaded
            function (audioBuffer) {
                // set the audio object buffer to the loaded object
                var sound = new THREE.Audio(audioListener);
                sound.setBuffer(audioBuffer);
                sound.setVolume(0.1);
                // play the audio
                this.fireEffects.push(sound);
            }.bind(this),
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened');
            }
        );

        loader.load(
            // resource URL
            'assets/extra/fire2.mp3',
            // Function when resource is loaded
            function (audioBuffer) {
                // set the audio object buffer to the loaded object
                var sound = new THREE.Audio(audioListener);
                sound.setBuffer(audioBuffer);
                sound.setVolume(0.1);
                // play the audio
                this.fireEffects.push(sound);
            }.bind(this),
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened');
            }
        );

        loader.load(
            // resource URL
            'assets/extra/fire3.mp3',
            // Function when resource is loaded
            function (audioBuffer) {
                // set the audio object buffer to the loaded object
                var sound = new THREE.Audio(audioListener);
                sound.setBuffer(audioBuffer);
                sound.setVolume(0.1);
                // play the audio
                this.fireEffects.push(sound);
            }.bind(this),
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened');
            }
        );

        loader.load(
           // resource URL
           'assets/extra/wings.mp3',
           // Function when resource is loaded
           function (audioBuffer) {
               // set the audio object buffer to the loaded object
               var sound = new THREE.Audio(audioListener);
               sound.setBuffer(audioBuffer);
               sound.setVolume(0.4);
               sound.setLoop(true);
               // play the audio
               sound.play();
           }.bind(this),
           // Function called when download progresses
           function (xhr) {
               console.log((xhr.loaded / xhr.total * 100) + '% loaded');
           },
           // Function called when download errors
           function (xhr) {
               console.log('An error happened');
           }
       );

        loader.load(
           // resource URL
           'assets/extra/roar.mp3',
           // Function when resource is loaded
           function (audioBuffer) {
               // set the audio object buffer to the loaded object
               var sound = new THREE.Audio(audioListener);
               sound.setBuffer(audioBuffer);
               sound.setVolume(0.1);
               this.roar = sound;
           }.bind(this),
           // Function called when download progresses
           function (xhr) {
               console.log((xhr.loaded / xhr.total * 100) + '% loaded');
           },
           // Function called when download errors
           function (xhr) {
               console.log('An error happened');
           }
       );
    },

    playFireSound: function () {
        var index = Math.floor(Math.random() * this.fireEffects.length);
        if (this.fireEffects[index])
            if (!this.fireEffects[index].isPlaying)
                this.fireEffects[index].play();
    },

    playRoar: function () {
        if (this.roar) {
            this.roar.play();
        }
    }
}