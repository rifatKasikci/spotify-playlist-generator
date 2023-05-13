const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: '../../.env' });

const createCompletion = async (prompt) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.data.choices[0].text;
}

module.exports = { createCompletion }