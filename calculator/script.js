const display = document.getElementById('display');

// 100% Safe Pre-embedded Mechanical Click Sound (Base64)
// Yeh direct browser memory mein sound run karega bina kisi file security restrictions ke
const clickAudio = new Audio("data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAAAA/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+");
clickAudio.volume = 20;

function pressButton(input) {
    // Zero-delay sound playback workaround
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => console.log("Audio trigger ignored by browser policies"));

    if (input === 'equal') {
        calculate();
    } else if (input === 'clear') {
        clearDisplay();
    } else {
        appendValue(input);
    }
}

function appendValue(val) {
    if (display.value === '0' || display.value === 'Error') {
        display.value = val;
    } else {
        display.value += val;
    }
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        if (display.value) {
            let logic = display.value.replace(/×/g, '*').replace(/÷/g, '/');
            display.value = String(eval(logic));
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Global Key Listeners for Keyboard Support
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key >= '0' && key <= '9') pressButton(key);
    if (key === '+') pressButton('+');
    if (key === '-') pressButton('-');
    if (key === '*') pressButton('*');
    if (key === '/') pressButton('/');
    if (key === 'Enter' || key === '=') pressButton('equal');
    if (key === 'Escape' || key === 'c' || key === 'C') pressButton('clear');
    if (key === 'Backspace') {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(() => {});
        display.value = display.value.slice(0, -1);
    }
});