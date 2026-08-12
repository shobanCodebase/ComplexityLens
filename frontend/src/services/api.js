const API_BASE_URL = 'http://localhost:8000';

/**
 * Sends code payload to FastAPI backend /analyze endpoint
 * @param {string} code 
 * @param {string} language 
 * @param {number} inputSize 
 */
export async function analyzeAlgorithm(code, language = 'python', inputSize = 1000) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      language,
      input_size: Number(inputSize)
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend Error (${response.status}): ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Sends code payload to FastAPI backend /benchmark endpoint (for multi-point N curves)
 * @param {string} code 
 * @param {string} language 
 * @param {Array<number>} inputSizes 
 */
export async function benchmarkAlgorithm(code, language = 'python', inputSizes = [10, 50, 100, 500, 1000]) {
  try {
    const response = await fetch(`${API_BASE_URL}/benchmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        input_sizes: inputSizes
      }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('/benchmark endpoint not available on backend yet.');
  }
  return null;
}

/**
 * Checks backend health
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return data.status === 'ok';
    }
  } catch (err) {
    return false;
  }
  return false;
}
