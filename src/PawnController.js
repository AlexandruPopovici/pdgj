/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

//==============================================================================
THREE.CharacterController = function (speedBlendCharacter) {

    var scope = this;
    var duration = 1;
    var keys = {
        LEFT: { code: 37, isPressed: false },
        UP: { code: 38, isPressed: false },
        RIGHT: { code: 39, isPressed: false },
        A: { code: 65, isPressed: false },
        D: { code: 68, isPressed: false },
        W: { code: 87, isPressed: false }
    };

    this.character = speedBlendCharacter;
    this.walkSpeed = 3;
    this.runSpeed = 7;
    this.speed = 0;

    // ---------------------------------------------------------------------------
    this.update = function (dt) {

        var newSpeed = this.speed;

        if (keys.UP.isPressed || keys.W.isPressed)
            newSpeed += dt / duration;
        else
            newSpeed -= dt / duration;

        newSpeed = Math.min(1, Math.max(newSpeed, 0));

        if (keys.LEFT.isPressed || keys.A.isPressed)
            this.character.rotation.y += dt * 2;
        else if (keys.RIGHT.isPressed || keys.D.isPressed)
            this.character.rotation.y -= dt * 2;

        var forward = new THREE.Vector3();
        forward.set(
			-this.character.matrix.elements[8],
			-this.character.matrix.elements[9],
			-this.character.matrix.elements[10]
		);
        var finalSpeed = (newSpeed > 0.5) ? newSpeed * this.runSpeed : (newSpeed / 0.5) * this.walkSpeed;
        forward.multiplyScalar(finalSpeed)
        this.speed = newSpeed;
        this.blend();
        this.character.update(dt);
        this.character.position.add(forward);
    };

    this.blend = function () {
        if (this.speed < 0.5) {

            var idleWeight = 1 - this.speed / 0.5;
            var walkWeight = this.speed / 0.5;
            this.character.applyWeight('idle', idleWeight);
            this.character.applyWeight('walk', walkWeight);
            this.character.play('idle', idleWeight);
            this.character.play('walk', walkWeight);

        } else {

            var walkWeight = 1 - (this.speed - 0.5) / 0.5;
            var runWeight = (this.speed - 0.5) / 0.5;
            this.character.applyWeight('walk', walkWeight);
            this.character.applyWeight('run', runWeight);
            this.character.play('walk', walkWeight);
            this.character.play('run', runWeight);
        }
    };


    // ---------------------------------------------------------------------------
    var onKeyDown = function (event) {

        for (var k in keys) {

            if (event.keyCode === keys[k].code) {

                keys[k].isPressed = true;

            }

        }

    };

    // ---------------------------------------------------------------------------
    var onKeyUp = function (event) {

        for (var k in keys) {

            if (event.keyCode === keys[k].code) {

                keys[k].isPressed = false;

            }

        }
    };

    // ---------------------------------------------------------------------------
    var onDurationChange = function (event) {

        duration = event.detail.duration;

    };

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('change-duration', onDurationChange, false);


}