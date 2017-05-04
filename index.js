(function () {
    const container = document.getElementById('container');

    class ParabolicMotion {
        // u0 - initial speed, meters per second
        // a0 - initial angle, deg
        constructor(u0, a0) {
            const g = 9.81;
            const a0Rad = this.toRadians(a0);

            this.x = (t) => u0 * t * Math.cos(a0Rad)
            this.y = (t) => u0 * t * Math.sin(a0Rad) - g * t * t / 2;
            this.time = (2 * u0 * Math.sin(a0Rad) / g).toFixed(2);
        }

        toRadians(angle) {
            return angle * Math.PI / 180
        }

        // interval - interval in ms
        getPath(interval) {
            const timeInMs = this.time * 1000;
            const output = [];

            for (let tMs = 0; tMs < timeInMs; tMs += interval) {
                const tS = tMs / 1000;
                output.push({
                    x: this.x(tMs / 1000).toFixed(2),
                    y: this.y(tMs / 1000).toFixed(2)
                })
            }

            return output;
        }
    }

    class Renderer {
        render(arr) {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            container.appendChild(canvas);

            const context = canvas.getContext('2d');
            context.beginPath(0, 0);

            const render = ({ x, y }) => {
                context.lineTo(x + 10, 10 - y);
                context.stroke();
            };
            const renderAfterTimeout = ({x, y}, cb) => {
                setTimeout(() => {
                    render({x, y});
                    cb();
                }, 50);
            }
            const createDeferredRenderFn = ({x, y}) => {
                return (cb) => {
                    renderAfterTimeout({x, y}, cb);
                }
            }

            series(arr.map(createDeferredRenderFn))
                .then(() => {
                    context.closePath();
                    container.appendChild('Success!');
                });
        }
    }

    // create new motion with 20 m/s speed and 30 deg angle
    const motion = new ParabolicMotion(20, 30);

    // log motion path with interval in 50 ms
    const path = motion.getPath(50);

    const renderer = new Renderer();
    renderer.render(path);
}());