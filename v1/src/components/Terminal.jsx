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
      <span className="text-orange-500">BONK</span>
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
        'Welcome to BONK Terminal!\nSearch Solana tokens, view live trades, analyze charts, and get AI-powered price predictions. Use commands like search, token, trades, predict, and more. All data is live from BONK and Solana. Try searching for a token or ask for a price prediction!',
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

  // const formatInfoWithOpenAPI = async (info) => {
  //   setFormattedMsgLoaded(false);
  //   try {
  //     const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${OPENAI_API_KEY}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         model: "gpt-3.5-turbo",
  //         temperature: 0.7,
  //         max_tokens: 300,
  //         messages: [
  //           {
  //             role: "system",
  //             content: `You are a helpful assistant limited to discussing cryptocurrencies. Use the provided token data and format it into a concise and human-friendly summary.`
  //           },
  //           {
  //             role: "user",
  //             content: `Here's the token data:\n${JSON.stringify(info, null, 2)} also use first pool from pools array`
  //           },
  //           {
  //             role: "user",
  //             content: `Format this token data using the following style:
  //                       Alright, let's dive into the token data for {token_name}.
  //                       The token has a market cap of {market_cap} and a 24-hour trading volume of {24h_volume}. 
  //                       The price of the token is {price}, with a 24-hour change of {24h_change}.
  //                       There are currently {no_of_holders} holders. The token has a risk score of {risk_score}. 
  //                       Risk : {key_risk}.
  //                       The token was created by {creator}, and the description reads: {description}.
  //                       `
  //           }
  //         ]
  //       })
  //     });

  //     const result = await response.json();
  //     return result.choices?.[0]?.message?.content?.trim() || "Failed to get a response.";
  //   } catch (error) {
  //     setFormattedMsgLoaded(false);
  //     console.error("OpenAI Error");
  //     return "Failed to get a response from AI.";
  //   }
  // };

  const formatInfoWithOpenAPI = async (info) => {
    setFormattedMsgLoaded(false);

    // Preprocess dynamic values
    const riskScoreInterpretation = info.risk.score <= 3 ? 'low' : info.risk.score <= 6 ? 'moderate' : 'high';
    const sniperInsiderInterpretation =
      info.risk.snipers.count === 0 && info.risk.insiders.count === 0
        ? 'which is a good sign as no snipers or insiders are detected'
        : 'which suggests some early or coordinated buying activity';
    const holderDistributionInterpretation =
      info.holders <= 50 ? 'not very widely distributed' : 'fairly well distributed';
    const socialMediaDetails =
      Object.keys(info.token.strictSocials).length > 0
        ? 'Here are the social media details for this token:\n' +
        Object.entries(info.token.strictSocials)
          .map(([platform, url]) => `${platform}: ${url}`)
          .join('\n')
        : 'No social media links are provided for this token.';
    const riskFactors =
      info.risk.risks.length > 0
        ? 'However, there are a couple of risk factors worth mentioning: ' +
        info.risk.risks.map((r) => r.description).join('; ')
        : 'No major risk factors were noted.';

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 400,
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant specializing in cryptocurrencies. Your task is to format the provided Solana token data into a concise, engaging, and human-friendly summary in a conversational tone. Use the provided preprocessed values for risk score interpretation, sniper/insider details, holder distribution, risk factors, and social media details. Focus on key metrics like token name, symbol, creator, market cap, price, 24-hour change, 24-hour volume, risk score, key risks, number of holders, and transaction activity. Avoid technical jargon and make it approachable for a curious investor.`
            },
            {
              role: 'user',
              content: `Here's the token data:\n${JSON.stringify(info, null, 2)}\n\n` +
                `Preprocessed values:\n` +
                `Risk score interpretation: ${riskScoreInterpretation}\n` +
                `Sniper/insider interpretation: ${sniperInsiderInterpretation}\n` +
                `Holder distribution interpretation: ${holderDistributionInterpretation}\n` +
                `Risk factors: ${riskFactors}\n` +
                `Social media details: ${socialMediaDetails}`
            },
            {
              role: 'user',
              content: `Format the token data into a summary with the following style:
                        Well, the token we're looking at here is called {token.name} with the symbol {token.symbol}. It was created by the address {token.creation.creator}, interesting stuff. Now, let's talk numbers.

                        The market cap of the token is about $${info.pools[0].marketCap.usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}. It's not a huge number, but that's not necessarily a bad thing. The price per token is currently $${info.pools[0].price.usd.toLocaleString('en-US', { maximumFractionDigits: 8 })}, and in the last 24 hours, it's seen a {events.24h.priceChangePercentage}% change. This might be a point of concern for potential investors if it indicates a downward trend. The 24h volume is at $${info.pools[0].txns.volume24h.toLocaleString('en-US')}, which shows there's a decent amount of trading activity happening.

                        Now, onto risks. The token has a risk score of {risk.score}, which is ${riskScoreInterpretation}. Notably, there are {risk.snipers.count} snipers with a total balance of {risk.snipers.totalBalance} and {risk.insiders.count} insiders, ${sniperInsiderInterpretation}. ${riskFactors}

                        The token has seen {buys} buys and {sells} sells with a total of {txns} transactions. It's held by {holders} different addresses, so it's ${holderDistributionInterpretation}.

                        ${socialMediaDetails}

                        So, while there are some potential risks involved, the {token.name} token could be an interesting one to keep an eye on!`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setFormattedMsgLoaded(true);
      return result.choices?.[0]?.message?.content?.trim() || 'Failed to get a response.';
    } catch (error) {
      setFormattedMsgLoaded(false);
      console.error('OpenAI Error:', error);
      return 'Failed to get a response from AI.';
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
    window.open('https://x.com/thebonkterminal', '_blank');
  };

  const handleBONKClick = () => {
    window.open('https://www.bonk.fun', '_blank');
  };

  return (
    <div className="font-mono min-h-screen bg-white flex flex-col items-center justify-start p-2 sm:p-4">
      <div className="w-full max-w-6xl border border-gray-300 rounded-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 border-b border-gray-300 bg-gray-100">
          <div className="text-orange-500 hover:text-purple-500 font-medium text-sm sm:text-base">
            SOL: {solanaPrice}
          </div>
          <div className="text-center text-gray-700 font-bold text-sm sm:text-base">
            <BLVYTerminal />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
            <button
              onClick={handleRocketClick}
              className="text-bonk-primary-orange hover:text-bonk-secondary-gold"
              aria-label="Open roadmap"
            >
              <RocketLaunchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleXClick}
              className="text-bonk-primary-orange hover:text-bonk-secondary-gold"
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
              onClick={handleBONKClick}
              className="bg-orange-500 hover:bg-bonk-secondary-gold text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded"
              aria-label="Open BONK tokens"
            >
              $BONK
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white flex-1 overflow-y-auto p-2 sm:p-4 max-h-[50vh] sm:max-h-[60vh]" role="log" aria-live="polite">
          {messages.map((msg) => (
          <div key={msg.id} className="flex mb-2">
            <div
              className={`w-[70px] sm:w-[80px] flex-shrink-0 text-xs sm:text-sm ${msg.type === 'system' ? 'text-bonk-primary-orange' : 'text-gray-800'
                }`}
            >
              {msg.type === 'user' ? 'USER>' : 'SYSTEM>'}
            </div>
            <div
              className={`flex-1 pl-1 text-xs sm:text-sm ${msg.type === 'system' ? 'text-bonk-primary-yellow' : 'text-gray-800'
                }`}
            >
              {msg.type === 'system' ? (
                <span
                  className="block whitespace-pre-wrap"
                  style={{ marginLeft: '-1px' }}
                  dangerouslySetInnerHTML={{ __html: highlightImportant(msg.content) }}
                />
              ) : (
                <span className="block whitespace-pre-wrap" style={{ marginLeft: '-1px' }}>
                  {msg.content}
                </span>
              )}
            </div>
          </div>
        ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2 flex bg-white">
          <div className="text-bonk-primary-orange mr-2 text-sm">{'>'}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm"
            placeholder="Enter command..."
          />
          <button type="submit" className="text-bonk-primary-orange hover:text-bonk-secondary-gold">
            <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>

        {/* Token Dashboard */}
        {(success || formattedMsgLoaded) && <TokenDashboard tokenData={tokenData} chartData={chartData} />}

        {/* Input */}
        {/* <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2 flex bg-white">
          <div className="text-bonk-primary-orange mr-2 text-sm">{'>'}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm"
            placeholder="Enter command..."
          />
          <button type="submit" className="text-bonk-primary-orange hover:text-bonk-secondary-gold">
            <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form> */}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-bonk-primary-orange"></div>
        </div>
      )}
    </div>
  );
})

// Highlight function for system messages
function highlightImportant(text) {
  const patterns = [
    // Dollar amounts
    { regex: /\$\d[\d,\.]*/g, className: "bg-yellow-300/80 text-black px-1 rounded font-semibold" },
    // Percentages
    { regex: /-?\d+(\.\d+)?%/g, className: "bg-yellow-300/80 text-black px-1 rounded font-semibold" },
    // Market cap, price, risk score, traded, 24 hour change, holders, created by user
    { regex: /(price of|market cap|risk score|traded in the past 24 hours|24 hour change|holders|created by user)/gi, className: "bg-yellow-300/80 text-black px-1 rounded font-semibold" },
    // Solana addresses (32-44 base58 chars)
    { regex: /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g, className: "bg-yellow-300/80 text-black px-1 rounded font-semibold" }
  ];
  let result = text;
  patterns.forEach(({ regex, className }) => {
    result = result.replace(regex, (match) => `<span class=\"${className}\">${match}</span>`);
  });
  return result;
}

export default Terminal;