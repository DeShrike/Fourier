// Fourier Transform and Epicycles

let x = [];
let fourierX;
let currentK = 0;

let time = 0;
let path0 = [];
let path1 = [];
let path2 = [];
let path3 = [];
let cycleCount = 0;

let pointcount = 360;

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

function epicycles(x, y, rotation, fourier, count)
{
	let cycles = fourier.length;

	for (let i = 0; i < cycles; i++)
	{
		let prevx = x;
		let prevy = y;

		let freq = fourier[i].freq;
		let radius = fourier[i].amp;
		let phase = fourier[i].phase;

		if (i + 1 > count)
		{
			continue;
		}

		if (radius < 1)
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

function setup()
{
	createCanvas(800, 500);
	
	let a = 1;
	let b = 7;
	let c = -2;
	let d = 13;

	let h = 50;
	let scale = h / (a * c);
	for (let i = 0; i < TWO_PI; i += TWO_PI / pointcount)
	{
		let xx = a * cos(b * i) + c * sin(d * i);
		x.push(xx * scale);
	}

	fourierX = dft(x); 
	fourierX.sort((a, b) => b.amp - a.amp);

	for (let f of fourierX)
	{
		if (f.amp > 1)
		{
			cycleCount++;
		}
	}
}

function draw()
{
	background(0);
	noFill();

	let waveposx = width - pointcount - 25;

	stroke(255, 50);
	beginShape();
	for (let i = 0; i < x.length; i++)
	{
		vertex(i + waveposx, x[i] + 100);
	}
	endShape();

	let v0 = epicycles(100, 100, HALF_PI, fourierX, cycleCount);
	stroke(255, 150);
	line(v0.x, v0.y, waveposx + currentK, v0.y);
	path0.push(createVector(waveposx + currentK, v0.y));

	let v1 = epicycles(100, 200, HALF_PI, fourierX, cycleCount - 1);
	stroke(255, 150);
	line(v1.x, v1.y, waveposx + currentK, v1.y);
	path1.push(createVector(waveposx + currentK, v1.y));

	let v2 = epicycles(100, 300, HALF_PI, fourierX, cycleCount - 2);
	stroke(255, 150);
	line(v2.x, v2.y, waveposx + currentK, v2.y);
	path2.push(createVector(waveposx + currentK, v2.y));

	let v3 = epicycles(100, 400, HALF_PI, fourierX, cycleCount - 3);
	stroke(255, 150);
	line(v3.x, v3.y, waveposx + currentK, v3.y);
	path3.push(createVector(waveposx + currentK, v3.y));

	stroke(255);
	beginShape();
	for (let i = 0; i < path0.length; i++)
	{
		vertex(path0[i].x, path0[i].y);
	}
	endShape();

	stroke(255);
	beginShape();
	for (let i = 0; i < path1.length; i++)
	{
		vertex(path1[i].x, path1[i].y);
	}
	endShape();

	stroke(255);
	beginShape();
	for (let i = 0; i < path2.length; i++)
	{
		vertex(path2[i].x, path2[i].y);
	}
	endShape();

	stroke(255);
	beginShape();
	for (let i = 0; i < path3.length; i++)
	{
		vertex(path3[i].x, path3[i].y);
	}
	endShape();

	let dt = TWO_PI / fourierX.length;
	time += dt;
	currentK++;

	if (time >= TWO_PI)
	{
		path0 = [];
		path1 = [];
		path2 = [];
		path3 = [];
		time = 0;
		currentK = 0;
	}
}
