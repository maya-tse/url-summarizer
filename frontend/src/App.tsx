import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Keep App.css for now, or remove if not needed

interface ApiResponseSuccess {
  status: 'success';
  summary: string;
  title?: string; // title can be optional
}

interface ApiResponseError {
  status: 'error';
  message: string;
}

type ApiResponse = ApiResponseSuccess | ApiResponseError;


function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSummary('');
    setTitle('');

    if (!url.trim()) {
      setError('URLを入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      // バックエンドのPORTを3001に設定しているので、それに合わせる
      const response = await axios.post<ApiResponse>('http://localhost:3001/api/summarize', { url });
      if (response.data.status === 'success') {
        setSummary(response.data.summary);
        setTitle(response.data.title || 'タイトルなし');
      } else {
        setError(response.data.message || '要約中にエラーが発生しました。');
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = '要約リクエスト中にエラーが発生しました。サーバーが起動しているか確認してください。';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">URL Summarizer</h1>
      <p className="text-lg text-gray-700 mb-8">
        Paste a URL to get a concise summary.
      </p>
      {/* Input field and button will be added later */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input 
          type="text" 
          placeholder="ここにURLを入力してください..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          disabled={isLoading}
        />
        <button 
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? '要約中...' : '要約する'}
        </button>
      </form>
          {isLoading && (
        <div className="mt-8">
          <p className="text-blue-500">要約を生成しています...</p>
          {/* Optional: Add a spinner animation here */}
        </div>
      )}
      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md w-full max-w-md">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
        </div>
      )}
      {summary && !isLoading && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg w-full max-w-md text-left">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
