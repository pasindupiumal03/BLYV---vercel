import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { 
  RocketLaunchIcon, 
  PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import TokenDashboard from './TokenDashBoard';
import React from 'react';

function BLVYTerminal() {
  return (
    <span className="flex items-center gap-1">
      <span className="text-green-500">BLYV</span>
      <span>Terminal</span>
    </span>
  );
}

const Terminal = React.memo(function Terminal() {
  const SOLANA_API_URL = import.meta.env.VITE_SOLANA_TRACKER_API_URL;
  const SOLANA_API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const [input, setInput] = useState('');
  const [tokenData, setTokenData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [solanaPrice, setSolanaPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [formattedMsgLoaded, setFormattedMsgLoaded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content:
        'Welcome to BLYV Terminal!\nSearch Solana tokens, view live trades, analyze charts, and get AI-powered price predictions. Use commands like search, token, trades, predict, and more. All data is live from BLYV and Solana. Try searching for a token or ask for a price prediction!',
    },
  ]);

  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
        const data = await response.json();
        setSolanaPrice(data.solana.usd);
      } catch (error) {
        console.error('Failed to fetch Solana price');
      }
    };

    fetchSolanaPrice();
  }, []);

  const formatInfoWithOpenAPI = async (info) => {
    setFormattedMsgLoaded(false);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant limited to discussing cryptocurrencies. Use the provided token data and format it into a concise and human-friendly summary.`
            },
            {
              role: "user",
              content: `Here's the token data:\n${JSON.stringify(info, null, 2)} also use first pool from pools array`
            },
            {
              role: "user",
              content: `Format this token data using the following style:
                        Alright, let's dive into the token data for {token_name}.
                        The token has a market cap of {market_cap} and a 24-hour trading volume of {24h_volume}. 
                        The price of the token is {price}, with a 24-hour change of {24h_change}.
                        There are currently {no_of_holders} holders. The token has a risk score of {risk_score}. 
                        Risk : {key_risk}.
                        The token was created by {creator}, and the description reads: {description}.
                        `
            }
          ]
        })
      });      
  
      const result = await response.json();
      return result.choices?.[0]?.message?.content?.trim() || "Failed to get a response.";
    } catch (error) {
      setFormattedMsgLoaded(false);
      console.error("OpenAI Error");
      return "Failed to get a response from AI.";
    }
  };
  

  const fetchOpenAIResponse = async (userPrompt, tokenDetails) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant limited to discussing cryptocurrencies, Solana tokens, trading, technical analysis, and blockchain technology. Do not answer unrelated questions. ${tokenDetails ? "use this token data to answer questions if needed: " + JSON.stringify(tokenDetails) : ""}`,
            },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 250,
        }),
      });
  
      const result = await response.json();
      return result.choices?.[0]?.message?.content?.trim() || "Failed to get a response.";
    } catch (error) {
      console.error("OpenAI Error");
      return "Failed to get a response from AI.";
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    const userMessage = { id: Date.now(), type: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const isLikelyTokenAddress = (input) => {
      try {
        new PublicKey(input);
        return true;
      } catch {
        return false;
      }
    };

    try {
      if (isLikelyTokenAddress(userInput)) {
        setSuccess(false);
        const res = await fetch(`${SOLANA_API_URL}/tokens/${userInput}`, {
          method: 'GET',
          headers: { 'x-api-key': SOLANA_API_KEY },
        });

        const token = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const chartRes = await fetch(`${SOLANA_API_URL}/chart/${userInput}`, {
          method: 'GET',
          headers: { 'x-api-key': SOLANA_API_KEY },
        });
        const chartData = await chartRes.json();

        if (token.token && chartData.oclhv) {
          setTokenData(token);
          setChartData(chartData.oclhv);

          // const systemMsg = (
          //   `Token: ${token.name} (${token.symbol})\n` +
          //   `Address: ${token.address}\n` +
          //   `Price: ${token.price || "N/A"} USD\n` +
          //   `Market Cap: ${token.marketCap || "N/A"}\n` +
          //   `24h Volume: ${token.volume24h || "N/A"}\n` +
          //   `24h Change: ${token.change24h || "N/A"}%\n` +
          //   `Deployer: ${token.creator || "N/A"}`
          // );

          const aiFormmatedDetails = await formatInfoWithOpenAPI(token);
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: 'system', content: aiFormmatedDetails },
          ]);
          setSuccess(true);
          setFormattedMsgLoaded(true);
        } else {
          setSuccess(false);
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: 'system', content: "No token found. Try a valid Solana token address." },
          ]);
        }
      } else {
        const aiMessage = await fetchOpenAIResponse(userInput, tokenData);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: 'system', content: aiMessage },
        ]);
      }
    } catch (err) {
      setSuccess(false);
      setTokenData({});
      setChartData([]);
      console.error('Error');
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: 'system', content: 'An error occurred. Try again.' },
      ]);
    }
    setInput('');
    setLoading(false);
  };
  

  const handleRocketClick = () => {
    window.open('/', '_blank');
  };

  const handleXClick = () => {
    window.open('https://x.com/theblyvterminal', '_blank');
  };

  const handleBLYVClick = () => {
    window.open('https://www.solanatracker.io/tokens', '_blank');
  };

  return (
    <div className="font-mono min-h-screen bg-white flex flex-col items-center justify-start p-2 sm:p-4">
      <div className="w-full max-w-6xl border border-gray-300 rounded-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 border-b border-gray-300 bg-gray-100">
          <div className="text-green-500 font-medium text-sm sm:text-base">
            SOL: {solanaPrice}
          </div>
          <div className="text-center text-gray-700 font-bold text-sm sm:text-base">
            <BLVYTerminal />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
            <button
              onClick={handleRocketClick}
              className="text-green-500 hover:text-green-600"
              aria-label="Open roadmap"
            >
              <RocketLaunchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleXClick}
              className="text-green-500 hover:text-green-600"
              aria-label="Open Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={handleBLYVClick}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded"
              aria-label="Open BLYV tokens"
            >
              $BLYV
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white flex-1 overflow-y-auto p-2 sm:p-4 max-h-[50vh] sm:max-h-[60vh]" role="log" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className="flex mb-2">
              <div
                className={`w-[70px] sm:w-[80px] flex-shrink-0 text-xs sm:text-sm ${
                  msg.type === 'system' ? 'text-green-500' : 'text-gray-800'
                }`}
              >
                {msg.type === 'user' ? 'USER>' : 'SYSTEM>'}
              </div>
              <div
                className={`flex-1 pl-1 text-xs sm:text-sm ${
                  msg.type === 'system' ? 'text-green-400' : 'text-gray-800'
                }`}
              >
                <span className="block whitespace-pre-wrap" style={{ marginLeft: '-1px' }}>
                  {msg.content}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2 flex bg-white">
          <div className="text-green-500 mr-2 text-sm">{'>'}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm"
            placeholder="Enter command..."
          />
          <button type="submit" className="text-green-500 hover:text-green-600">
            <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>

        {/* Token Dashboard */}
        {(success || formattedMsgLoaded) && <TokenDashboard tokenData={tokenData} chartData={chartData} />}

        {/* Input */}
        {/* <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2 flex bg-white">
          <div className="text-green-500 mr-2 text-sm">{'>'}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm"
            placeholder="Enter command..."
          />
          <button type="submit" className="text-green-500 hover:text-green-600">
            <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form> */}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-green-500"></div>
        </div>
      )}
    </div>
  );
})

export default Terminal;