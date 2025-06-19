// Variables
const drawRef = {
    // Tick Rate
    updateTime: 16,
    // Properties
    particles: null,
    initialStars: 100,
    // Canvas
    canvas: null,
    ctx: null,
    width: null,
    height: null,
    background: 1,
    backgroundModSpd: 1,
    // BG Canvas
    bgcanvas: null,
    bgctx: null,
    opacity: 1,
};
// For tick-rate calculations
let __updater = 0;
let __lastTime = 0;
function drawLoop(time) {
    window.requestAnimationFrame(drawLoop);
    // Calculate Elapsed Time
    let elapsedTime = time - __lastTime;
    if (elapsedTime) {
        __updater += elapsedTime;
    }

    // Update & Render
    let hasUpdated = false;
    while (__updater > drawRef.updateTime) {
        hasUpdated = true;
        __updater -= drawRef.updateTime;
        drawUpdate(elapsedTime);
    }
    hasUpdated && drawRender(elapsedTime);

    // Update last time called
    __lastTime = time;
}
// Updates any drawing objects
function drawUpdate() {
    notesPlaying = Object.keys(sustainedNotes);
    notesPlaying.forEach((note) => {
        drawNote(note, 10);
    });
    drawRef.particles.update();
}
// Performs the rendering
function drawRender() {
    // Clear main context
    drawRef.bgctx.clearRect(0, 0, drawRef.width, drawRef.height);
    // drawRef.bgctx.globalAlpha = drawRef.opacityFade;
    // drawRef.bgctx.drawImage(drawRef.canvas, 0, 0);
    drawRef.ctx.clearRect(0, 0, drawRef.width, drawRef.height);
    // Render particles
    if (!document.querySelector("#effects").checked) {
        drawRef.particles.render();
    }
    // Draw the Background
    drawRef.ctx.drawImage(drawRef.bgcanvas, 0, 0);
}
function drawNote(note, particleCount = 100) {
    const sliceWidth = drawRef.width / noteCount;
    const slice = noteId[note.substr(0, note.length - 1)] - 1;
    for (i = 0; i < particleCount; i++) {
        const x = Math.floor(Math.random() * sliceWidth + slice * sliceWidth);
        const props = {
            x,
            spd: Math.random() * 1 + 2
        }
        drawRef.particles.stars.push(drawRef.particles.newStar(props));
    }
}
// Initialize
function drawInit() {
    // References
    drawRef.canvas = document.querySelector("canvas#draw");
    const bcr = drawRef.canvas.getBoundingClientRect();
    drawRef.canvas.width = bcr.width;
    drawRef.canvas.height = bcr.height;
    drawRef.ctx = drawRef.canvas.getContext("2d");
    drawRef.width = drawRef.canvas.width;
    drawRef.height = drawRef.canvas.height;

    // Background
    drawRef.bgcanvas = document.createElement("canvas");
    drawRef.bgcanvas.width = drawRef.width;
    drawRef.bgcanvas.height = drawRef.height;
    drawRef.bgctx = drawRef.bgcanvas.getContext("2d");

    // Particles
    drawRef.particles = new Particles();
    // Start the drawLoop
    drawLoop();
}