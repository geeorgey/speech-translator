import axios from 'axios';

const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;
const DEEPL_API_URL = '/api/v2/translate';  // プロキシを経由するURL

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    console.log('Translating:', text, 'to', targetLang);
    console.log('API URL:', DEEPL_API_URL);
    console.log('API Key:', DEEPL_API_KEY ? 'Set' : 'Not set');

    if (!DEEPL_API_KEY) {
      throw new Error('DeepL API key is not set');
    }

    const response = await axios.post(
      DEEPL_API_URL,
      {
        text: [text],
        target_lang: targetLang,
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Translation response:', response.data);

    if (response.data && response.data.translations && response.data.translations.length > 0) {
      return response.data.translations[0].text;
    } else {
      throw new Error('Unexpected response format from DeepL API');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API response error:', error.response.data);
        console.error('Status code:', error.response.status);
        return `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        console.error('No response received:', error.request);
        return 'Network Error: No response received from the server';
      } else {
        console.error('Error setting up the request:', error.message);
        return `Request Setup Error: ${error.message}`;
      }
    } else {
      console.error('Unexpected error:', error);
      return `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}