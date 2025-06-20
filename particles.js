class Particles {
    constructor() {
        // Variables
        this.stars = [];

        // Sprites
        this.starSprites = [];

        // Instantiate Starfield
        this.initStars();
    }
    initStars() {
        this.stars = [];
        this.starSprites = [];
        // Instantiate Stars
        var starVariations = 10;
        var minRad = 1;
        var maxRad = 5;
        var minSpd = 1.0;
        var maxSpd = 1.5;
        for (var i = 0; i < starVariations; i++) {
            var rad = minRad + ((maxRad - minRad) / starVariations) * i;
            var spd = minSpd + ((maxSpd - minSpd) / starVariations) * i;
            this.starSprites.push(this.newStarSprite(rad, spd));
        }
        for (var i = 0; i < drawRef.initialStars; i++) {
            this.stars.push(this.newStar());
        }
    }
    newStarSprite(radius, speed) {
        // Setup a Canvas for this element
        var canvas = document.createElement("canvas");
        canvas.width = Math.ceil(radius);
        canvas.height = Math.ceil(radius);
        var context = canvas.getContext("2d");

        // Radial Gradient - Inner(X,Y,Radius) Outer(X,Y,Radius)
        var gradient = context.createRadialGradient(radius / 2, radius / 2, radius / 6, radius / 2, radius / 2, radius / 2);

        // Gradient
        gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0)');

        // Set the fill style and draw it in a rectangle
        context.fillStyle = gradient;
        context.fillRect(0, 0, radius, radius);

        // Return an object containing the star sprite and its properties
        return {
            canvas,
            radius,
            speed,
        };
    }
    newStar(props) {
        const { x, y, spd } = props || {};
        const randomStarRef = this.starSprites[Math.floor(Math.random() * this.starSprites.length)];
        const radius = randomStarRef.radius;
        const setX = x ? x : Math.random() * (drawRef.width - radius * 2) + radius;
        const setY = y ? y : (drawRef.height + radius * 2) + radius;
        return {
            x: setX,
            y: setY,
            canvas: randomStarRef.canvas,
            radius: randomStarRef.radius,
            speed: spd || randomStarRef.speed,
        };
    }
    update() {
        // Stars
        for (let i = 0; i < this.stars.length; i++) {
            let item = this.stars[i];
            item.y -= item.speed;
            item.speed *= 1.01;
            if (item.y < item.radius * -1) {
                this.stars.splice(i--, 1);
            }
        }
    }
    render() {
        // Reset Opacity
        // drawRef.bgctx.globalAlpha = 1;
        // Stars
        this.stars.forEach(item => {
            drawRef.bgctx.drawImage(item.canvas, item.x, item.y);
        });
    }
}
