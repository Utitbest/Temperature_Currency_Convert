import dotenv from 'dotenv';
dotenv.config();

export async function handler(event) {
  const { from, to, amount } = event.queryStringParameters;

  const apiKey = process.env.EXCHANGE_API_KEY;

  const url = `https://api.exchangerate.host/convert?access_key=${apiKey}&from=${from}&to=${to}&amount=${amount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('API Response:', data);

    if (!data.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Conversion failed', details: data.error })
      };    
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API failed', details: error.message })
    };
  }
}





