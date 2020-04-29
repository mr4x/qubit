const illo = new Zdog.Illustration({
    element: '.here',
    rotate: { y: Zdog.TAU / 8, x: -Zdog.TAU / 12 },
    dragRotate: true,
    onDragStart: function () {
        isSpinning = false;
    },
});

// RED
new Zdog.Shape({
    addTo: illo,
    stroke: 2,
    path: [{ z: -200 }, { z: 200 }],
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
    path: [{ x: -200 }, { x: 200 }],
    color: 'rgba(46,204,64,0.8)'
});

new Zdog.Cone({
    addTo: illo,
    translate: { x: 200 },
    rotate: { y: -Zdog.TAU / 4 },
    diameter: 10,
    length: 20,
    stroke: false,
    color: 'rgba(46,204,64,0.8)'
});

// BLUE
new Zdog.Shape({
    addTo: illo,
    stroke: 2,
    path: [{ y: -200 }, { y: 200 }],
    color: 'rgba(0,116,217,0.8)'
});

new Zdog.Cone({
    addTo: illo,
    translate: { y: -200 },
    rotate: { x: Zdog.TAU / 4 },
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
    rotate: { x: Zdog.TAU / 4 },
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
const ce = e => document.createElement(e);

function $on(target, type, callback, capture) {
    target.addEventListener(type, callback, !!capture);
}

function movePoint(phi, theta) {
    const x = 100 * Math.sin(phi) * Math.sin(theta);
    const y = -100 * Math.cos(theta);
    const z = 100 * Math.cos(phi) * Math.sin(theta);

    xyz.x = x;
    xyz.y = y;
    xyz.z = z;

    p.translate = xyz;
    op.updatePath();
    isSpinning = true;
}

let alpha = Complex(), beta = Complex(), phi = 0, theta = 0;

const $alpha = $('#alpha'), $beta = $('#beta'), $phi = $('#phi'), $theta = $('#theta');

function fromAlphaBeta() {
    try {
        alpha = Complex($alpha.value);
        beta = Complex($beta.value);

        const r0 = alpha.abs(), r1 = beta.abs();
        const f0 = alpha.arg(), f1 = beta.arg();

        phi = f1 - f0;
        theta = 2 * Math.acos(r0);

        $b4 = ce('div');
        $b4.textContent = `$$ r_0 = | \\alpha | =  ${r0}, r_1 = | \\beta | = ${r1} $$`;
        $solution.appendChild($b4);

        $b5 = ce('div');
        $b5.textContent = `$$ \\phi_0 = \\arg(\\alpha) = ${f0}, \\phi_1 = \\arg(\\beta) = ${f1} $$`;
        $solution.appendChild($b5);

        $b6 = ce('div');
        $b6.textContent = `$$ \\theta = 2 \\arccos(r_0) = ${theta}, \\phi = \\phi_1 - \\phi_0 = ${phi} $$`;
        $solution.appendChild($b6);

        $phi.value = phi;
        $theta.value = theta;
        movePoint(phi, theta);
    } catch { }
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
    } catch { }
}

$on($phi, 'input', fromPhiTheta);
$on($theta, 'input', fromPhiTheta);

const variants = [
    { n: 0.8, m: 0.6, W: 6 },
    { n: 0.77, m: 0.638044, W: 4 },
    { n: 0.75, m: 0.661438, W: 8 },
    { n: 0.723333, m: 0.690499, W: 6 },
    { n: 0.698333, m: 0.715773, W: 4 },
    { n: 0.673333, m: 0.739339, W: 3 },
    { n: 0.648333, m: 0.761357, W: 6 },
    { n: 0.623333, m: 0.781956, W: 4 },
    { n: 0.598333, m: 0.801247, W: 3 },
    { n: 0.573333, m: 0.819322, W: 6 },
    { n: 0.548333, m: 0.83626, W: 4 },
    { n: 0.523333, m: 0.852128, W: 3 },
    { n: 0.498333, m: 0.866986, W: 6 },
];

const $variant = $('#variant'), $solution = $('#solution');
$on($variant, 'change', e => {
    computeVariant(e.target.selectedIndex);
});

function computeVariant(i) {
    const { n, m, W } = variants[i];
    const x1 = n * Math.cos(Math.PI / W);
    const x2 = n * Math.sin(Math.PI / W);
    const x3 = m * Math.cos(Math.PI / W);
    const x4 = m * Math.sin(Math.PI / W);

    $solution.innerHTML = '';
    const $b1 = ce('div');
    $b1.textContent = `$$ x_1 = n \\cdot cos(\\pi / W) = ${x1} \\newline
    x_2 = n \\cdot sin(\\pi / W) = ${x2} \\newline
    x_3 = m \\cdot cos(\\pi / W) = ${x3} \\newline
    x_4 = m \\cdot sin(\\pi / W) = ${x4} $$`;
    $solution.appendChild($b1);

    const $b2 = ce('div');
    $b2.textContent = `$$ \\alpha = x_1+x_2i = ${x1}+${x2}i \\newline \\beta = x_3+x_4i = ${x3}+${x4}i $$`;
    $solution.appendChild($b2);

    $alpha.value = `${x1}+${x2}i`;
    $beta.value = `${x3}+${x4}i`;
    fromAlphaBeta();

    const $b3 = ce('div');
    $b3.textContent = `$$ |\\psi\\rang = \\alpha |0\\rang + \\beta |1\\rang = (${x1}+${x2}i)|0\\rang + (${x3}+${x4}i)|1\\rang $$`;
    $solution.appendChild($b3);

    const $b7 = ce('div');
    $b7.textContent = `$$ |\\psi\\rang = cos(\\theta / 2) |0\\rang + e^{i\\phi} sin(\\theta / 2) |1\\rang = cos(${theta / 2})|0\\rang + e^{i (${phi})}sin(${theta / 2})|1\\rang $$`;
    $solution.appendChild($b7);

    renderMathInElement(document.body);
}