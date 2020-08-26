// Fourier Transform User Drawing

const IDLE = -1;
const USER = 1;
const FOURIER = 2;

let x = [];
let y = [];
let fourierX;
let fourierY;

let time = 0;
let path = [];

let drawing = [];
let state = IDLE;

let prevmouseX = 0;
let prevmouseY = 0;

function dft(x)
{
	// Calculate Discrete Fourier Transform
	let X = [];
	const N = x.length;
	for (let k = 0; k < N; k++)
	{
		let re = 0;
		let im = 0;
		for (let n = 0; n < N; n++)
		{
			let phi = TWO_PI * k * n / N;
			re += x[n] * cos(phi);
			im -= x[n] * sin(phi);
		}

		re = re / N;
		im = im / N;

		let freq = k;
		let amp = sqrt(re * re + im * im);
		let phase = atan2(im, re); 

		X[k] = { 
			re, 
			im,
			freq,
			amp,
			phase,
		};
	}

	return X;
}

function epicycles(x, y, rotation, fourier)
{
	let scale = 75;

	let cycles = fourier.length;

	for (let i = 0; i < cycles; i++)
	{
		let prevx = x;
		let prevy = y;

		let freq = fourier[i].freq;
		let radius = fourier[i].amp;
		let phase = fourier[i].phase;

		if (radius < 15)
		{
			continue;
		}

		x += radius * cos(freq * time + phase + rotation);
		y += radius * sin(freq * time + phase + rotation);

		stroke(255, 100);
		ellipse(prevx, prevy, radius * 2);

		stroke(255);
-		line(prevx, prevy, x, y);
		// ellipse(x, y, 8);
	}

	return createVector(x, y);
}

function mousePressed()
{
	state = USER;
	drawing = [];
	x = [];
	y = [];
	time = 0;
	path = [];
}

function mouseReleased()
{
	state = FOURIER;

	for (let i = 0; i < drawing.length; i++)
	{
		x.push(drawing[i].x);
		y.push(drawing[i].y);
	}

	fourierX = dft(x); 
	fourierY = dft(y); 

	fourierX.sort((a, b) => b.amp - a.amp);
	fourierY.sort((a, b) => b.amp - a.amp);
}

function setup()
{
	createCanvas(800, 600);
}

function draw()
{
	background(0);
	noFill();

	if (state == USER)
	{
		let mx = mouseX - width / 2;
		let my = mouseY - height / 2;
		if (mx != prevmouseX || my != prevmouseY)
		{
			let point = createVector(mx, my);
			drawing.push(point);
		}

		stroke(250);
		noFill();
		beginShape();
		for (let v of drawing)
		{
			vertex(v.x + width / 2, v.y + height / 2);
		}
		endShape();

		prevmouseX = mx;
		prevmouseY = my;
	}
	else if (state == FOURIER)
	{
		let vx = epicycles(width / 2, 75, 0 , fourierX);
		let vy = epicycles(75, height / 2, HALF_PI, fourierY);

		let v = createVector(vx.x, vy.y);
		path.unshift(v);

		stroke(255, 150);
		line(vx.x, vx.y, v.x, v.y);
		line(vy.x, vy.y, v.x, v.y);

		stroke(255);
		beginShape();
		for (let i = 0; i < path.length; i++)
		{
			vertex(path[i].x, path[i].y);
		}
		endShape();

		let dt = TWO_PI / fourierY.length;
		time += dt;

		if (time >= TWO_PI - 0.1)
		{
			path.pop();
		}
	}
}
