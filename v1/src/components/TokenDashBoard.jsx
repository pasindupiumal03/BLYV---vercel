import { Copy } from 'lucide-react';
import React, { memo } from 'react';
import Chart from 'react-apexcharts';

const TokenDetailsComponent = React.memo(function TokenDetailsComponent({ tokenData, chartData }) {
  const series = [
    {
      data: chartData.map(item => ({
        x: new Date(item.time * 1000),
        y: [item.open, item.high, item.low, item.close]
      }))
    }
  ];

  const options = {
    chart: {
      type: 'candlestick',
      height: 250,
      toolbar: { show: true },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      background: '#ffffff'
    },
    plotOptions: {
      candlestick: {
        candleWidth: 20,
        colors: {
          upward: '#48bb78', // Green
          downward: '#f44336', // Red
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const [open, high, low, close] = data.y;
        const formatPrice = (value) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
          if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
          return `$${value.toFixed(6)}`;
        };

        return `
          <div style="padding: 8px; font-size: 12px; background-color: #f9fafb; border: 1px solid #ccc;">
            <div><strong>Time:</strong> ${new Date(data.x).toLocaleString()}</div>
            <div><strong>Open:</strong> ${formatPrice(open)}</div>
            <div><strong>High:</strong> ${formatPrice(high)}</div>
            <div><strong>Low:</strong> ${formatPrice(low)}</div>
            <div><strong>Close:</strong> ${formatPrice(close)}</div>
          </div>
        `;
      }
    },
    title: {
      text: 'Price Chart (1m)',
      align: 'left',
      style: { color: '#1f2937', fontSize: '14px' }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
      labels: {
        show: true,
        rotate: -45,
        style: { colors: '#4b5563', fontSize: '10px' }
      },
      axisBorder: { color: '#e5e7eb' }
    },
    yaxis: {
      tickAmount: 6,
      tooltip: { enabled: true },
      labels: {
        style: { colors: '#4b5563', fontSize: '10px' },
        formatter: function (val) {
          if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
          if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
          return `$${val.toFixed(6)}`;
        }
      },
      axisBorder: { color: '#e5e7eb' }
    },
    grid: {
      borderColor: '#e5e7eb'
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard'))
      .catch(err => console.error('Failed to copy'));
  };

  return (
    <div className="bg-white text-gray-800 w-full rounded-xl shadow-md overflow-hidden m-auto border border-gray-100">
      {/* Token header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
              <img 
                src={tokenData.token?.image} 
                alt={tokenData.token?.name} 
                className="w-8 h-8 object-contain" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2022C17.5228%2022%2022%2017.5228%2022%2012C22%206.47715%2017.5228%202%2012%202C6.47715%202%202%206.47715%202%2012C2%2017.5228%206.47715%2022%2012%2022Z%22%20stroke%3D%22%23F97316%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M12%208V16%22%20stroke%3D%22%23F97316%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M8%2012H16%22%20stroke%3D%22%23F97316%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E';
                }}
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-white">{tokenData.token?.name || 'Unknown Token'}</h2>
              <p className="text-gray-300 text-sm">${tokenData.pools?.[0].price.usd.toFixed(6)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              tokenData.events?.['24h']?.priceChangePercentage >= 0 
                ? 'bg-green-100 text-green-500' 
                : 'bg-red-100 text-red-500'
            }`}>
              {tokenData.events?.['24h']?.priceChangePercentage >= 0 ? '↑' : '↓'} 
              {Math.abs(tokenData.events?.['24h']?.priceChangePercentage || 0).toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Token address */}
        <div className="mt-4 flex items-center justify-between bg-black bg-opacity-20 rounded-lg p-2">
          <span className="text-gray-300 text-xs font-mono truncate max-w-xs">
            {tokenData.token?.mint || 'No address available'}
          </span>
          <button
            onClick={() => copyToClipboard(tokenData.token?.mint)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Copy token address"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Chart section */}
      <div className="p-4 border-b border-gray-100">
        <div className="h-64">
          <Chart options={options} series={series} type="candlestick" height={250} />
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">Market Cap</p>
            <p className="text-base font-semibold">
  {(() => {
    const cap = tokenData.pools?.[0]?.marketCap?.usd;
    if (cap === undefined || cap === null) return '--';
    if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(2)}M`;
    if (cap >= 1_000) return `$${(cap / 1_000).toFixed(2)}K`;
    return `$${cap.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  })()}
</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">24h Volume</p>
            <p className="text-base font-semibold">${(tokenData.pools?.[0].txns?.volume / 1000).toFixed(2)}K</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">Creator</p>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-800 truncate">
                {tokenData.token.creation?.creator ? (
                  <span className="font-mono">{tokenData.token.creation.creator}</span>
                ) : (
                  'No creator found'
                )}
              </span>
              {tokenData.token.creation?.creator && (
                <button
                  onClick={() => copyToClipboard(tokenData.token.creation.creator)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  aria-label="Copy creator address"
                >
                  <Copy size={12} />
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">Network</p>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-800">Solana</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default TokenDetailsComponent;
