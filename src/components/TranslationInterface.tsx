import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../services/speechRecognition';
import { translateText } from '../services/translation';
import LanguageSelector from './LanguageSelector';

interface TranslationEntry {
  original: string;
  translated: string;
}

const TranslationInterface: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('en');
  const [translationHistory, setTranslationHistory] = useState<TranslationEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { isListening, startListening, stopListening, finalTranscript, setFinalTranscript } = useSpeechRecognition(sourceLang);

  useEffect(() => {
    const translateSource = async () => {
      if (finalTranscript) {
        try {
          const result = await translateText(finalTranscript, targetLang);
          if (result.startsWith('API Error:') || result.startsWith('Network Error:') || result.startsWith('Unexpected error:')) {
            setError(result);
          } else {
            setTranslationHistory(prev => [...prev, { original: finalTranscript, translated: result }]);
            setFinalTranscript(''); // トランスクリプトをクリア
            setError(null);
          }
        } catch (err) {
          setError(`Translation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    };

    translateSource();
  }, [finalTranscript, targetLang, setFinalTranscript]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Real-time Speech Translator</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <LanguageSelector value={sourceLang} onChange={setSourceLang} label="Source Language" />
        <LanguageSelector value={targetLang} onChange={setTargetLang} label="Target Language" />
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={isListening ? stopListening : startListening}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isListening ? 'red' : 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h2>Original Text</h2>
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            minHeight: '300px',
            padding: '10px',
            whiteSpace: 'pre-wrap'
          }}>
            {translationHistory.map((entry, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>{entry.original}</div>
            ))}
            {finalTranscript && <div>{finalTranscript}</div>}
          </div>
        </div>
        <div style={{ width: '48%' }}>
          <h2>Translated Text</h2>
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            minHeight: '300px',
            padding: '10px',
            whiteSpace: 'pre-wrap'
          }}>
            {translationHistory.map((entry, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>{entry.translated}</div>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TranslationInterface;