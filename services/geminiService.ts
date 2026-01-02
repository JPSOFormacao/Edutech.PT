import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCourseOutline = async (topic: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Cria um esboço detalhado para um curso de formação profissional sobre: "${topic}".
      O público alvo são adultos em requalificação tecnológica.
      A resposta deve estar em formato Markdown, em Português de Portugal.
      Inclui: Título sugerido, Duração estimada, Objetivos, e 4 Módulos principais com tópicos.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar o conteúdo.";
  } catch (error) {
    console.error("Error generating course:", error);
    return "Erro ao contactar a IA. Por favor tente novamente.";
  }
};

export const generateQuizQuestion = async (context: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Erro: API Key em falta.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Com base neste tema: "${context}", cria uma questão de escolha múltipla difícil em formato JSON.
            Estrutura desejada: { "pergunta": "...", "opcoes": ["A", "B", "C", "D"], "resposta_correta": "A" }`,
            config: {
                responseMimeType: "application/json"
            }
        });
        return response.text || "{}";
    } catch (e) {
        console.error(e);
        return "{}";
    }
}