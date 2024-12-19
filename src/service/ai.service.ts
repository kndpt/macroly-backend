import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private readonly openai: OpenAI;
  private readonly ai_model: string;
  private readonly ai_temperature: number;
  private readonly ai_max_tokens: number;
  private readonly ai_top_p: number;
  private readonly ai_frequency_penalty: number;
  private readonly ai_presence_penalty: number;
  private readonly logger: Logger;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.logger = new Logger(AIService.name);
    this.ai_model = process.env.AI_MODEL ?? 'no-model';
    this.ai_temperature = parseFloat(process.env.AI_TEMPERATURE ?? '0.1');
    this.ai_max_tokens = parseInt(process.env.AI_MAX_TOKENS ?? '40');
    this.ai_top_p = parseFloat(process.env.AI_TOP_P ?? '0.7');
    this.ai_frequency_penalty = parseFloat(
      process.env.AI_FREQUENCY_PENALTY ?? '0.5',
    );
    this.ai_presence_penalty = parseFloat(
      process.env.AI_PRESENCE_PENALTY ?? '0.2',
    );
  }

  /**
   * Récupère la teneur moyenne d'un constituant pour un aliment. Retourne null si la teneur n'est pas trouvée ou que l'IA répond autre chose que la teneur.
   * @param alimentName { string }
   * @param constituantName { string }
   * @returns { string | null }
   */
  public async getTeneur(
    alimentName: string,
    constituantName: string,
  ): Promise<number | null> {
    const prompt = this.generateQuery(alimentName, constituantName);
    const response = await this.createChatCompletion(prompt);
    const content = response.choices[0].message.content;
    return this.extractTeneur(content) ?? null;
  }

  private extractTeneur(content: string): number | null {
    const regexPatterns = [
      /(\d*[.,]?\d+)\s*(?:mg|g|kcal|µg)\/100\s*g/i, // Format complet avec unité/100g
      /:\s*environ\s*(\d*[.,]?\d+)\s*(?:à|-)\s*(\d*[.,]?\d+)\s*(?:mg|g|kcal|µg)\b/i, // Format avec fourchette (à ou -)
      /:\s*environ\s*(\d*[.,]?\d+)\s*(?:mg|g|kcal|µg)\b/i, // Format avec "environ"
      /:\s*(\d*[.,]?\d+)\s*(?:mg|g|kcal|µg)(?:\.|$)/i, // Format avec deux points et unité
      /est à environ\s*(\d*[.,]?\d+)\s*(?:mg|g|kcal|µg)\b/i, // Format sans deux points
      /:\s*(\d*[.,]?\d+)/, // Dernier recours: nombre après ":"
    ];

    for (const regex of regexPatterns) {
      const match = regex.exec(content);
      if (match) {
        // Cas spécial pour la fourchette de valeurs
        if (match.length > 2 && match[2]) {
          const val1 = parseFloat(match[1].replace(',', '.'));
          const val2 = parseFloat(match[2].replace(',', '.'));
          const moyenne = (val1 + val2) / 2;
          this.logger.debug(
            `Found range ${val1}-${val2}, using average: ${moyenne}`,
          );
          return moyenne;
        }
        // Cas normal
        return parseFloat(match[1].replace(',', '.'));
      }
    }

    this.logger.warn(`No match found in content: ${content}`);
    return null;
  }

  private generateQuery(aliment: string, constituant: string): string {
    return `Quelle est la teneur moyenne de ${constituant} pour ${aliment} ? Écrit ta réponse comme ceci: La teneur moyenne en ${constituant} pour ${aliment} est à :`;
  }

  private async createChatCompletion(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: this.ai_model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.ai_temperature,
      max_tokens: this.ai_max_tokens,
      top_p: this.ai_top_p,
      frequency_penalty: this.ai_frequency_penalty,
      presence_penalty: this.ai_presence_penalty,
    });

    this.logger.debug({
      prompt: prompt,
      response: response,
    });

    return response;
  }
}
