const illo = new Zdog.Illustration({
    element: '.here',
    rotate: { y: Zdog.TAU/8, x: -Zdog.TAU/12 },
    dragRotate: true,
    onDragStart: function() {
        isSpinning = false;
    },
});

// RED
new Zdog.Shape({
    addTo: illo,
    stroke: 2,
    path: [{z: -200}, {z: 200}],
    color: 'rgba(255,65,54,0.8)'
});

new Zdog.Cone({
    addTo: illo,
    translate: { z: 200 },
    diameter: 10,
    length: 20,
    stroke: false,
    color: 'rgba(255,65,54,0.8)'
});

// GREEN
new Zdog.Shape({
    addTo: illo,
    stroke: 2,
    path: [{x: -200}, {x: 200}],
    color: 'rgba(46,204,64,0.8)'
});

new Zdog.Cone({
    addTo: illo,
    translate: { x: 200 },
    rotate: { y: -Zdog.TAU/4 },
    diameter: 10,
    length: 20,
    stroke: false,
    color: 'rgba(46,204,64,0.8)'
});

// BLUE
new Zdog.Shape({
    addTo: illo,
    stroke: 2,
    path: [{y: -200}, {y: 200}],
    color: 'rgba(0,116,217,0.8)'
});

new Zdog.Cone({
    addTo: illo,
    translate: { y: -200 },
    rotate: { x: Zdog.TAU/4 },
    diameter: 10,
    length: 20,
    stroke: false,
    color: 'rgba(0,116,217,0.8)'
});

// origin
new Zdog.Shape({
    addTo: illo,
    stroke: 6,
    color: '#111',
});

new Zdog.Shape({
    addTo: illo,
    stroke: 200,
    color: 'rgba(200,225,255,0.5)',
});

new Zdog.Ellipse({
    addTo: illo,
    rotate: { x: Zdog.TAU/4 },
    width: 200,
    height: 200,
    stroke: 2,
    color: 'rgba(200,225,255,0.9)',
});

const p = new Zdog.Shape({
    addTo: illo,
    stroke: 6,
    color: '#0366d6'
});

const xyz = {};

const op = new Zdog.Shape({
    addTo: illo,
    path: [{}, xyz],
    stroke: 3,
    color: '#0366d6'
});

let isSpinning = true;

function animate() {
    if (isSpinning) {
        illo.rotate.y += 0.01;
    }
    illo.updateRenderGraph();
    requestAnimationFrame(animate);
}
animate();

const $ = s => document.querySelector(s);

function $on(target, type, callback, capture) {
	target.addEventListener(type, callback, !!capture);
}

function movePoint(phi, theta) {
    const x = 100*Math.sin(phi)*Math.sin(theta);
    const y = -100*Math.cos(theta);
    const z = 100*Math.cos(phi)*Math.sin(theta);

    xyz.x = x;
    xyz.y = y;
    xyz.z = z;

    p.translate = xyz;
    op.updatePath();
    isSpinning = true;
}

let alpha = Complex(), beta = Complex(), phi = Complex(), theta = Complex();

const $alpha = $('#alpha'), $beta = $('#beta'), $phi = $('#phi'), $theta = $('#theta');

function fromAlphaBeta() {
    try {
        alpha = Complex($alpha.value);
        beta = Complex($beta.value);

        const l = alpha.pow(2).add(beta.pow(2)).sqrt();
        alpha = alpha.div(l);
        beta = beta.div(l);
            
        const r0 = alpha.abs(), r1 = beta.abs();
        const f0 = alpha.arg(), f1 = beta.arg();
        console.log(r0, r1);
        console.log(f0, f1);
        console.log(r0*r0+r1*r1)

        phi = f1 - f0;
        // if (phi < 0) phi += Math.PI;
        theta = 2*Math.acos(r0) || 2*Math.asin(r1);
        console.log(2*Math.asin(r0), 2*Math.acos(r1))
        
        $phi.value = phi;
        $theta.value = theta;
        movePoint(phi, theta);
    } catch {}
}

$on($alpha, 'input', fromAlphaBeta);
$on($beta, 'input', fromAlphaBeta);

function fromPhiTheta() {
    try {
        phi = Complex($phi.value);
        theta = Complex($theta.value);

        alpha = theta.div(2).cos();
        beta = phi.mul(Complex.I).exp().mul(theta.div(2).sin());

        $alpha.value = alpha;
        $beta.value = beta;
        movePoint(phi, theta);
    } catch {}
}

$on($phi, 'input', fromPhiTheta);

$on($theta, 'input', fromPhiTheta);