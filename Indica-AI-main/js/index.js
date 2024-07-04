let isRecording = false;
let recognition;
let flowStep = int = 0;

const chatBox = document.getElementById('chatBox');

function postMessage(text, isUser = false)
{
	const messageClass = isUser ? 'user' : 'bot';
	const messageSide = isUser ? 'justify-content: flex-end;' : '';	
	const message = `<div class="message ${messageClass}" style="${messageSide}"><div class="text">${text}</div></div>`;
	chatBox.innerHTML += message;
	chatBox.scrollTop = chatBox.scrollHeight;	
	document.getElementById('userInput').value = '';		
}

function AIFlow(data, isUser = false)
{
	const chatBox = document.getElementById('chatBox');
	const agent = isUser ? 'user' : 'bot';
	
	switch (flowStep) {
		case 0: // First open
			const botMessage = "Olá! O que você deseja comer hoje?";
			postMessage("<b>Assistente:</b> " + botMessage);
			readMessage(botMessage);
			flowStep = 1;
			break;
		case 1: // Search for recommendations
			flowStep = 2;
			postMessage(data, isUser);
			processUserMessage(data);
			break;
		case 2:
			// Aqui a ideia é receber um JSON para fazer o parse e fazer com que o assistente só leia o que é interessente que ele leia, além de formatar a apresentação dos produtos no chat
			postMessage(data, isUser);
			readMessage(data);
			//flowStep = 3;
			break;
		
		case 3:
			// DoTo...
			const calmacalabreso = "Calma calabreso! Não tá pronto ainda!";
			postMessage("<b>Assistente:</b> " + calmacalabreso);
			readMessage(calmacalabreso);
		default:
			break;
	} 
}

function toggleMinimize()
{
	const chatContainer = document.getElementById('chatContainer');
	chatContainer.classList.toggle('minimized');

	if (!chatContainer.classList.contains('minimized') && (flowStep == 0))
	{
		AIFlow(null, false);
	}
}

document.addEventListener('DOMContentLoaded', () =>
{
	document.getElementById('userInput').addEventListener('input', () =>
	{
		const userInput = document.getElementById('userInput').value.trim();
	});

	document.getElementById('userInput').addEventListener('keypress', (e) =>
	{
		if (e.key === 'Enter')
		{
			const userInput = document.getElementById('userInput').value.trim();
			AIFlow(userInput, true);
		}
	});
});


function buttonClick(){
	const userInput = document.getElementById('userInput').value.trim();
	AIFlow(userInput, true);
}

function toggleRecording()
{
	if (isRecording)
	{
		recognition.stop();
		isRecording = false;
		document.getElementById('recordButton').innerHTML = '<img src="https://raw.githubusercontent.com/Delutto/Indica-AI/main/img/mic.png">';
	}
	else
	{
		startRecording();
	}
}

function startRecording()
{
	recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
	recognition.lang = 'pt-BR';
	recognition.interimResults = true;
	recognition.maxAlternatives = 1;

	recognition.start();
	isRecording = true;
	document.getElementById('recordButton').innerText = '🔴';
	recordButton.style.width = '76px';
	recordButton.style.fontSize = '25px';

	recognition.onresult = function (event)
	{
		const transcript = event.results[0][0].transcript;
		document.getElementById('userInput').value = transcript;
	};

	recognition.onspeechend = function ()
	{
		recognition.stop();
		isRecording = false;
		document.getElementById('recordButton').innerHTML = '<img src="./img/mic2.png">';
		transcript = document.getElementById('userInput').value.trim();
		AIFlow(transcript, true);		
	};

	recognition.onerror = function (event)
	{
		console.error('Speech recognition error detected: ' + event.error);
		isRecording = false;
		document.getElementById('recordButton').innerHTML = '<img src="https://raw.githubusercontent.com/Delutto/Indica-AI/main/img/mic.png">';
	};
}

function readMessage(text)
{
	const speech = new SpeechSynthesisUtterance();
	speech.lang = 'pt-BR';
	speech.text = text;

	speechSynthesis.speak(speech);
}


document.getElementById('alterarContraste').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('chatContainer').classList.toggle('dark-mode');

	// Seleciona todos os botões de imagens dentro da div com classe chat-input-buttons
    var buttons = document.querySelectorAll('img');

    // Array com os caminhos das imagens para o modo claro e escuro
    var lightModeImages = ['./img/send.png','./img/mic2.png', './img/hearing2.png', './img/contrast2.png', './img/zoom.png', './img/chat.png'];
    var darkModeImages = ['./img/send.png','./img/micDark.png', './img/hearingDark.png', './img/contrastDark.png', './img/zoomDark.png', './img/chatDark.png'];

    // Verifica se o body tem a classe dark-mode para decidir qual conjunto de imagens usar
    var modeImages = document.body.classList.contains('dark-mode') ? darkModeImages : lightModeImages;

    // Atualiza o src de cada imagem de acordo com o modo
    buttons.forEach(function(button, index) {
        button.src = modeImages[index];
    });
});


document.getElementById('alterarTamanho').addEventListener('click', (e)=>{
	const texts = document.querySelectorAll('.text');

	texts.forEach((text) =>{
		let currentFontSize = parseFloat(window.getComputedStyle(text).fontSize);

		if (currentFontSize < 22) {
            // Aumenta a fonte em 2px
            text.style.fontSize = (currentFontSize + 2) + 'px';
        } else {
            // Se atingir 22px, volta para o tamanho padrão (16px)
            text.style.fontSize = '16px';
        }
	})
})