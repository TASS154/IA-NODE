import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} from "@google/generative-ai";

import chalk from 'chalk';

import ora from 'ora';

import prompt from 'prompt-sync';

const promptSync = prompt();

const MODEL_NAME = "gemini-1.0-pro";

const API_KEY = "AIzaSyBR6maEvDuZlKCu1t5dY2JWwSKI17c0840";

const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const SAFETY_SETTING = [{
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    { 
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
];

async function runChat() {
    const spinner = ora('inicializando chat...').start();
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME
        })

        const chat = model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTING,
            history: [],
        });

        spinner.stop();

        while(true) {
            const userInput = promptSync(chalk.green('Você: '));

            if (userInput.toLowerCase() === 'exit') {
                console.log(chalk.yellow('Até breve!'));
                process.exit(0);
            }

            const result = await chat.sendMessage(userInput);

            if (result.error) {
                console.error(chalk.red('AI Erro:'), result.error.message);
                continue;
            }

            const response = result.response.text();

            console.log(chalk.blue('AI:'), response);
        }
    } catch (error) {
        spinner.stop();
        console.error(chalk.red('Erro encontrado:'), error.message);
        process.exit(1);
    }
}

runChat();