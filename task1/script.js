const tempSlider = document.getElementById('temperature');
const tempValue = document.getElementById('tempValue');
tempSlider.addEventListener('input', () => {
    tempValue.textContent = tempSlider.value;
});

const generateButton = document.getElementById('generateButton');
const promptInput = document.getElementById('prompt');
const outputDiv = document.getElementById('output');
const maxLength = document.getElementById('maxLength');

generateButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        outputDiv.innerHTML = '<span class="text-red-500">Please enter a prompt first</span>';
        return;
    }

    outputDiv.innerHTML = '<div class="typing-animation">Generating</div>';
    generateButton.disabled = true;

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                temperature: tempSlider.value,
                maxLength: maxLength.value
            })
        });

        const data = await response.json();
        outputDiv.innerHTML = '';
        let i = 0;
        const text = data.output;

        const typeWriter = () => {
            if (i < text.length) {
                outputDiv.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 10);
            } else {
                generateButton.disabled = false;
            }
        };
        typeWriter();
    } catch (error) {
        outputDiv.innerHTML = '<span class="text-red-500">Failed to generate text. Try again.</span>';
        generateButton.disabled = false;
    }
});
