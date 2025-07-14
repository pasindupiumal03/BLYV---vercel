import { useNavigate } from 'react-router-dom';
import ParticlesSnow from './ParticlesSnow';
import { 
  RocketLaunchIcon, 
  StarIcon, 
  BellIcon, 
  CodeBracketIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CircleStackIcon
} from '@heroicons/react/24/solid';

function Roadmap() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center font-sans relative overflow-hidden">
      
      <div className="max-w-6xl w-full px-4 py-12 md:py-20 relative z-[1]">
        {/* Header */}
        <div className="bg-gradient-to-t from-bonk-primary-yellow to-bonk-secondary-gold text-white rounded-xl p-8 mb-16 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6 shadow-sm">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Development in Progress
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            BONK Terminal Roadmap
          </h1>
          
          <p className="text-lg max-w-3xl mx-auto text-white/80 mb-8 leading-relaxed">
            Explore what's next for BONK Terminal. We're building in public, shipping new features every week, and listening to your feedback as we grow.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/terminal')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 font-medium"
            >
              Open Terminal <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button
              className="border-2 border-gray-200 bg-white text-gray-700 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 font-medium"
              onClick={() => window.open('https://bonkterminal.gitbook.io/bonkterminal', '_blank')}
            >
              View Documentation
            </button>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        <div className="absolute inset-0 bg-[url('/bonk-transparent.svg')] opacity-60 pointer-events-none"></div>
        </div>
        
        {/* Timeline */}
        <div className="relative mb-20">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-blue-500 to-gray-200 rounded-full absolute top-7"></div>
          <div className="flex justify-between relative">
            <TimelineNode week={1} icon={<CheckCircleIcon className="w-5 h-5 text-white" />} completed={true} progress={100}/>
            <TimelineNode week={2} icon="2" completed={false} progress={10} />
            <TimelineNode week={4} icon="4" completed={false} progress={0} />
            <TimelineNode week={6} icon="6" completed={false} progress={0} />
            <TimelineNode week={8} icon="8" completed={false} progress={0} />
            <TimelineNode week={12} icon="12" completed={false} progress={0} />
          </div>
        </div>
        
        {/* Week Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeekBox 
            week={1} 
            icon={<RocketLaunchIcon className="w-5 h-5 text-orange-500" />} 
            status="Completed" 
            progress={100}
            items={[
              'Token launch ($BONK)',
              'Terminal + website go live',
              'Token analytics: price, volume, holders, liquidity, etc.',
              'Basic price prediction model using probability across key metrics'
            ]}
          />
          
          <WeekBox 
            week={2} 
            icon={<StarIcon className="w-5 h-5 text-blue-500" />} 
            status="In Progress" 
            progress={10}
            items={[
              'Custom token watchlist (save & pin tokens)',
              'Tiered access: holders unlock advanced analytics',
              'Whitepaper Lite: overview of goals and upcoming feature roadmap'
            ]}
          />
          
          <WeekBox 
            week={4} 
            icon={<CircleStackIcon className="w-5 h-5 text-purple-500" />} 
            status="Upcoming"
            items={[
              '$BONK staking (single-sided)',
              'Custom alert builder (on-chain events, LP changes, whale moves)',
              'Wallet portfolio analytics',
              'Advanced dashboards with custom widgets and layouts'
            ]}
          />
          
          <WeekBox 
            week={6} 
            icon={<BellIcon className="w-5 h-5 text-green-500" />} 
            status="Upcoming"
            items={[
              'Telegram bot alerts (price moves, rug warnings, whale activity)',
              'API access for power users and developers',
              'DAO-lite: community voting on features using $BONK'
            ]}
          />
          
          <WeekBox 
            week={8} 
            icon={<CodeBracketIcon className="w-5 h-5 text-amber-500" />} 
            status="Upcoming"
            items={[
              'Cross-chain support for most-demanded ecosystem',
              'Launchpad for internally vetted/audited tokens',
              'WEB3 SDK: integrate analytics into external dApps'
            ]}
          />
          
          <WeekBox 
            week={12} 
            icon={<UserGroupIcon className="w-5 h-5 text-pink-500" />} 
            status="Upcoming"
            items={[
              'Social + on-chain data merge (Twitter/Telegram signals in analytics)',
              'Custom signal builder (e.g., "+50% in 4h + whale entry")',
              'Pro dashboard profiles (share or fork setups across users)'
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ week, icon, completed, progress = 0 }) {
  let bgColor = "bg-gray-200";
  let textColor = "text-gray-400";
  let ringColor = "ring-gray-200";
  
  if (completed) {
    bgColor = "bg-gradient-to-br from-orange-500 to-amber-500";
    textColor = "text-orange-600";
    ringColor = "ring-orange-200";
  } else if (progress > 0) {
    bgColor = "bg-gradient-to-br from-blue-500 to-cyan-500";
    textColor = "text-blue-600";
    ringColor = "ring-blue-200";
  }
  
  return (
    <div className="flex flex-col items-center group">
      <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center z-10 ring-4 ${ringColor} ring-opacity-50 transition-all duration-300 group-hover:scale-110`}>
        {typeof icon === 'string' ? (
          <span className="text-white font-bold text-lg">{icon}</span>
        ) : (
          <div className="text-white">{icon}</div>
        )}
      </div>
      <div className={`mt-3 ${textColor} font-semibold text-sm transition-colors`}>
        Week {week}
      </div>
      {progress > 0 && (
        <div className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${completed ? 'bg-orange-100' : 'bg-blue-100'}`}>
          {progress}%
        </div>
      )}
    </div>
  );
}

function WeekBox({ week, icon, items, status, progress = 0 }) {
  let statusBgColor = "bg-gray-100 text-gray-600";
  let statusBorderColor = "border-gray-200";
  let progressBarBg = "bg-gray-100";
  let progressBarColor = "bg-gray-300";
  
  if (status === "Completed") {
    statusBgColor = "bg-green-50 text-green-700 border-green-100";
    statusBorderColor = "border-green-100";
    progressBarBg = "bg-green-50";
    progressBarColor = "bg-gradient-to-r from-green-400 to-green-500";
  } else if (status === "In Progress") {
    statusBgColor = "bg-blue-50 text-blue-700 border-blue-100";
    statusBorderColor = "border-blue-100";
    progressBarBg = "bg-blue-50";
    progressBarColor = "bg-gradient-to-r from-blue-400 to-blue-500";
  } else {
    statusBgColor = "bg-gray-50 text-gray-500 border-gray-100";
  }
  
  return (
    <div className="h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-opacity-10 bg-current">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">Week {week}</h3>
        </div>
        
        {/* Progress bar */}
        {status !== "Upcoming" && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className={`h-2 w-full ${progressBarBg} rounded-full overflow-hidden`}>
              <div 
                className={`h-full ${progressBarColor} rounded-full transition-all duration-1000`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <ul className="space-y-3 mb-6">
          {items.map((item, index) => (
            <li key={index} className="flex items-start group">
              <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 ${
                status === 'Completed' ? 'bg-green-400' : 
                status === 'In Progress' ? 'bg-blue-400' : 'bg-gray-300'
              }`}></div>
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className={`px-6 py-3 border-t ${statusBorderColor} ${statusBgColor} flex justify-between items-center`}>
        <span className="text-xs font-medium">STATUS</span>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          status === 'Completed' ? 'bg-green-100 text-green-700' :
          status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}

export default Roadmap;