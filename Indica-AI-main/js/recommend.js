// Função para carregar arquivos JSON
async function loadJSON(url)
{
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para encontrar recomendações com base em palavras-chave
function findRecommendations(data, msgkeywords)
{
    const recommendations = [];

    Object.values(data).forEach(page => {
        page.forEach(item => {
            const tags = item.tags.map(tag => tag.toLowerCase());
            // Aqui tem que mudar essa função para um loop que conta quantos matchs de tags cada item terá e envia somente os itens com mais matchs
            if (msgkeywords.some(keyword => tags.includes(keyword.toLowerCase()))) {
                recommendations.push(item);
            }
        });
    });
	
    return recommendations;
}

// Função para exibir recomendações no chat
function displayRecommendations(recommendations)
{
	const recommendationn = "Entendido! Aqui estão alguns itens que escolhi para você:";
	AIFlow(recommendationn);
	
    recommendations.forEach(item => {
        const message = `<b>${item.item}</b><br>${item.description}<br><I>R$${item.price}</I><br><a href="${item.url}">Comprar</a>`;
        AIFlow(message);
    });
}

// Função para processar a mensagem do usuário
async function processUserMessage(message)
{
    const data 			= await loadJSON("https://raw.githubusercontent.com/Delutto/Indica-AI/main/json/store.json");
    const keywordData 	= await loadJSON("https://raw.githubusercontent.com/Delutto/Indica-AI/main/json/keywords.json");
    const predefinedKeywords = keywordData.keywords;
    const words = message.split(' ');
    const msgkeywords = words.filter(word => predefinedKeywords.includes(word.toLowerCase()));

    if (msgkeywords.length > 0)
	{
        const recommendations = findRecommendations(data, msgkeywords);
        if (recommendations.length > 0)
		{
            displayRecommendations(recommendations);
        }
		else
		{
            AIFlow("Desculpe, mas não encontrei um produto que se encaixe ao seu pedido.");
        }
    }
	else
	{
        AIFlow("Desculpe, não encontrei nenhuma palavra-chave válida para o seu pedido.");
    }
    flowStep = 3;
}