import { useEffect, useState } from 'react';
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
  const API_URL = import.meta.env.VITE_SOLANA_TRACKER_API_URL;
  const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

  const [input, setInput] = useState('');
  const [tokenData, setTokenData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [solanaPrice, setSolanaPrice] = useState('');
  const [loading, setLoading] = useState(false);
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
        console.error('Failed to fetch Solana price:', error);
      }
    };

    fetchSolanaPrice();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', content: input },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/tokens/${input.trim()}`, {
        method: 'GET',
        headers: { 'x-api-key': API_KEY },
      });
      const data = await res.json();

      const pool = data.pools?.[0];
      const token = {
        name: data.token?.name || 'Unknown',
        address: data.token?.mint,
        price: pool?.price?.usd || null,
        change24h: data.events?.['24h']?.priceChangePercentage || null,
        marketCap: pool?.marketCap?.usd || null,
        volume24h: pool?.txns?.volume || null,
        creator: pool?.deployer || null,
        symbol: data.token?.symbol,
        decimals: data.token?.decimals,
        image: data.token?.image || null,
      };

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const chartRes = await fetch(`${API_URL}/chart/${input.trim()}`, {
        method: 'GET',
        headers: { 'x-api-key': API_KEY },
      });
      const chartData = await chartRes.json();

      if (data.token && chartData.oclhv) {
        setSuccess(true);
        setTokenData(token);
        setChartData(chartData.oclhv);

        const message = (
          `Alright, another BLYV token address: ${token.address}. Let's check this one out on the BLYV platform.\n` +
          `Alright, let's look at ${token.address}. This is ${token.name} (${token.symbol}), the mascot of BLYV.\n` +
          `Here's the lowdown:\n` +
          `Market Cap: ${token.marketCap || "N/A"}\n` +
          `24h Volume: ${token.volume24h || "N/A"}\n` +
          `24h Change: ${token.change24h || "N/A"}%.\n` +
          `The chart data shows some recent price action, bouncing around a bit.\n` +
          `It's the BLYV mascot, so there's that. Volume and market cap are decent for a BLYV token, but that 24h drop in volume and market cap change is something to note. Do your own research, don't just ape in because it's the mascot.`
        );

        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: 'system', content: message },
        ]);
      } else {
        setSuccess(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: 'system', content: "No results found! Check the token and try again..." },
        ]);
      }
    } catch (err) {
      setSuccess(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'system',
          content: 'Something went wrong! Please try again...',
        },
      ]);
      console.log("eee: ", err);
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

        {/* Token Dashboard */}
        {success && <TokenDashboard tokenData={tokenData} chartData={chartData} />}

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