let lastReadings = localStorage.getItem('lastReadings');

function updateReading() {
	// Get current inputs
	const sysel = document.getElementById('sys').value;
	const diadel = document.getElementById('dia').value;
	const heartrate = document.getElementById('heart-rate').value;
	const tempcel = document.getElementById('temperature').value;
	const osel = document.getElementById('os').value;
	const resprate = document.getElementById('respiratory').value;

	if (sysel && diadel && heartrate && tempcel && osel && resprate) {
		// Save to localStorage
		lastReadings = JSON.stringify({
			bloodPressure: { sys: Number(sysel), dia: Number(diadel) },
			heartRate: Number(heartrate),
			respiratoryRate: Number(resprate),
			temperature: Number(tempcel),
			oxygenSaturation: Number(osel)
		});

		localStorage.setItem('lastReadings', lastReadings);

		// Update results
		updateResults();
    
		// Show sample data if not already shown
		const samples = document.querySelectorAll('.sample');
		samples.forEach(sample => sample.style.display = 'block');
	} else {
		alert('Please fill in all fields');
	}
}

function updateResults() {
	let bpStatus, hrStatus, rrStatus, tempStatus, osStatus;
	let bpColor, hrColor, rrColor, tempColor, osColor;

	// Blood Pressure Status
	const sys = parseFloat(document.getElementById('sys').value);
	const dia = parseFloat(document.getElementById('dia').value);

	if (sys >= 180 || dia >= 120) {
		bpStatus = 'Critical';
		bpColor = 'red';
	} else if (sys >= 140 || dia >= 90) {
		bpStatus = 'High Stage 2';
		bpColor = '#ffab36';
	} else if (sys >= 130 || dia >= 80) {
		bpStatus = 'High Stage 1';
		bpColor = '#cabd5e';
	} else if (sys >= 120 && dia >= 80) {
		bpStatus = 'Elevated';
		bpColor = '#b3c6f9';
	} else {
		bpStatus = 'Normal';
		bpColor = '#22c55e';
	}

	// Heart Rate Status
	const hr = parseFloat(document.getElementById('heart-rate').value);

	if (hr >= 100) {
		hrStatus = 'High';
		hrColor = 'red';
	} else if (hr < 60) {
		hrStatus = 'Low';
		hrColor = '#ffab36';
	} else {
		hrStatus = 'Normal';
		hrColor = '#22c55e';
	}

	// Respiratory Rate Status
	const rr = parseFloat(document.getElementById('respiratory').value);

	if (rr >= 20) {
		rrStatus = 'High';
		rrColor = 'red';
	} else if (rr < 12) {
		rrStatus = 'Low';
		rrColor = '#ffab36';
	} else {
		rrStatus = 'Normal';
		rrColor = '#22c55e';
	}

	// Temperature Status
	const temp = parseFloat(document.getElementById('temperature').value);

	if (temp > 37.5) {
		tempStatus = 'High Fever';
		tempColor = 'red';
	} else if (temp >= 36.8 && temp <= 37.49) {
		tempStatus = 'Normal';
		tempColor = '#22c55e';
	} else if (temp >= 36 && temp < 36.8) {
		tempStatus = 'Normal';
		tempColor = '#22c55e';
	} else {
		tempStatus = 'Low';
		tempColor = '#d4edda';
	}

	// Oxygen Saturation Status
	const osat = parseFloat(document.getElementById('os').value);

	if (osat < 90) {
		osStatus = 'Critical';
		osColor = 'red';
	} else if (osat >= 90 && osat <= 94) {
		osStatus = 'Low';
		osColor = '#d1a8e5';
	} else {
		osStatus = 'Normal';
		osColor = '#22c55e';
	}

	// Create result elements
	const results = document.querySelectorAll('.result');
	results.forEach((res, index) => {
		if (index === 0) {
			res.textContent = `Blood Pressure: ${sys}/${dia} mmHg - ${bpStatus}`;
			res.style.color = bpColor;
			res.style.borderLeftColor = bpColor;
		} else if (index === 1) {
			res.textContent = `Heart Rate: ${hr} bpm - ${hrStatus}`;
			res.style.color = hrColor;
			res.style.borderLeftColor = hrColor;
		} else if (index === 2) {
			res.textContent = `Respiratory Rate: ${rr} bpm - ${rrStatus}`;
			res.style.color = rrColor;
			res.style.borderLeftColor = rrColor;
		} else if (index === 3) {
			res.textContent = `Temperature: ${temp}°C - ${tempStatus}`;
			res.style.color = tempColor;
			res.style.borderLeftColor = tempColor;
		} else if (index === 4) {
			res.textContent = `O2 Saturation: ${osat}% - ${osStatus}`;
			res.style.color = osColor;
			res.style.borderLeftColor = osColor;
		}
	});

	// Update health score
	const scoreBar = document.getElementById('health-score');
	let score = 100;

	if (bpStatus === 'Critical' || osStatus === 'Critical') score -= 30;
	else if (bpStatus === 'High Stage 2' || osStatus === 'Low') score -= 20;
	else if (bpStatus === 'High Stage 1') score -= 15;

	if (hrStatus === 'High') score -= 15;
	else if (hrStatus === 'Low') score -= 10;

	if (rrStatus === 'High') score -= 15;
	else if (rrStatus === 'Low') score -= 10;

	if (tempStatus === 'High Fever') score -= 20;
	else if (tempStatus === 'Low') score -= 10;

	score = Math.max(0, score);

	scoreBar.style.width = `${score}%`;
	scoreBar.textContent = `${score}%`;

	// Change color based on score
	if (score >= 80) {
		scoreBar.style.background = 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)';
	} else if (score >= 60) {
		scoreBar.style.background = 'linear-gradient(90deg, #eab308 0%, #ca8a04 100%)';
	} else if (score >= 40) {
		scoreBar.style.background = 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)';
	} else {
		scoreBar.style.background = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
	}
}

// Load saved readings on page load
window.addEventListener('DOMContentLoaded', function() {
	if (lastReadings) {
		try {
			const readings = JSON.parse(lastReadings);
			document.getElementById('sys').value = readings.bloodPressure.sys;
			document.getElementById('dia').value = readings.bloodPressure.dia;
			document.getElementById('heart-rate').value = readings.heartRate;
			document.getElementById('respiratory').value = readings.respiratoryRate;
			document.getElementById('temperature').value = readings.temperature;
			document.getElementById('os').value = readings.oxygenSaturation;
			updateResults();
			const samples = document.querySelectorAll('.sample');
			samples.forEach(sample => sample.style.display = 'block');
		} catch (e) {
			console.log('Could not load saved readings');
		}
	}
});