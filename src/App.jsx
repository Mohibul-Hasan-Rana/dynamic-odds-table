import React, { useState, useEffect } from 'react';


import data2 from './data2.json';

// --- Helper Components ---

const SearchBar = ({ query, setQuery, suggestions, onSelectMatch }) => (
    <div className="relative w-full max-w-md mx-auto">
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Match ID (e.g., 1000)"
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
                {suggestions.map((match) => (
                    <li
                        key={match.gid}
                        onClick={() => onSelectMatch(match)}
                        className="px-4 py-2 text-white cursor-pointer hover:bg-gray-600"
                    >
                        {match.gid}: {match.matches.match.localteam.name} vs {match.matches.match.awayteam.name}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const MatchInfo = ({ match }) => {
    if (!match) return null;

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const [day, month, year] = match.matches.match.date.split('.');
            const [hours, minutes] = match.matches.match.time.split(':');
            const matchDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
            
            const difference = matchDate - now;

            if (difference > 0) {
                const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const m = Math.floor((difference / 1000 / 60) % 60);
                const s = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft('00 : 00 : 00');
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [match]);

    return (
        <div className="text-center text-white my-8 p-6 bg-gray-800 rounded-xl shadow-2xl">
            <div className="text-4xl font-bold tracking-widest mb-4">
                {timeLeft}
            </div>
            <div className="flex items-center justify-center space-x-8">
                <span className="text-xl font-semibold">{match.matches.match.localteam.name}</span>
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold">{match.matches.match.time}</span>
                    <span className="text-lg">{match.matches.match.date.replace(/\./g, '/')}</span>
                </div>
                <span className="text-xl font-semibold">{match.matches.match.awayteam.name}</span>
            </div>
        </div>
    );
};

const OddsTable = ({ odds }) => {
    // Sections are collapsed by default
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (id) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderBookmakerRows = (bookmakers, headers) => {
        const allRows = [];
        bookmakers.forEach(bm => {
            if (bm.odd) {
                const rowData = {};
                headers.forEach(header => {
                    const odd = bm.odd.find(o => o.name === header);
                    rowData[header] = odd ? odd.value : 'N/A';
                });
                allRows.push(rowData);
            }
        });
        return allRows.map((row, index) => (
            <tr key={index} className="border-b border-gray-700">
                {headers.map(header => <td key={header} className="py-3 px-4 text-center">{row[header]}</td>)}
            </tr>
        ));
    };

    const renderHandicapRows = (bookmakers) => {
        const allRows = [];
        bookmakers.forEach(bm => {
            const handicaps = Array.isArray(bm.handicap) ? bm.handicap : [bm.handicap];
            handicaps.forEach(h => {
                const homeOdd = h.odd.find(o => o.name === 'Home')?.value || 'N/A';
                const awayOdd = h.odd.find(o => o.name === 'Away')?.value || 'N/A';
                allRows.push({ handicap: h.name, home: homeOdd, away: awayOdd });
            });
        });

        return allRows.map((row, index) => (
             <tr key={index} className="border-b border-gray-700">
                <td className="py-3 px-4 text-center">{row.handicap}</td>
                <td className="py-3 px-4 text-center">{row.home}</td>
                <td className="py-3 px-4 text-center">{row.handicap}</td>
                <td className="py-3 px-4 text-center">{row.away}</td>
            </tr>
        ));
    };
    
    const renderTotalRows = (bookmakers) => {
        const allRows = [];
        bookmakers.forEach(bm => {
            const totals = Array.isArray(bm.total) ? bm.total : [bm.total];
            totals.forEach(t => {
                const overOdd = t.odd.find(o => o.name === 'Over')?.value || 'N/A';
                const underOdd = t.odd.find(o => o.name === 'Under')?.value || 'N/A';
                allRows.push({ total: t.name, over: overOdd, under: underOdd });
            });
        });

        return allRows.map((row, index) => (
            <tr key={index} className="border-b border-gray-700">
                <td className="py-3 px-4 text-center">{row.total}</td>
                <td className="py-3 px-4 text-center">{row.over}</td>
                <td className="py-3 px-4 text-center">{row.total}</td>
                <td className="py-3 px-4 text-center">{row.under}</td>
            </tr>
        ));
    };


    return (
        <div className="space-y-4">
            {odds.type.map(oddType => {
                const isSectionOpen = openSections[oddType.id] === true;
                let headers = [];
                let content;

                switch (oddType.value) {
                    case '3Way Result':
                        headers = ['Home', 'Draw', 'Away'];
                        content = renderBookmakerRows(oddType.bookmaker, headers);
                        break;
                    case 'Home/Away':
                        headers = ['Home', 'Away'];
                        content = renderBookmakerRows(oddType.bookmaker, headers);
                        break;
                    case 'Asian Handicap':
                        headers = ['Handicap', 'Home', 'Handicap', 'Away'];
                        content = renderHandicapRows(oddType.bookmaker);
                        break;
                    case 'Over/Under':
                        headers = ['Total', 'Over', 'Total', 'Under'];
                        content = renderTotalRows(oddType.bookmaker);
                        break;
                    default:
                        return null;
                }

                return (
                    <div key={oddType.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <button
                            onClick={() => toggleSection(oddType.id)}
                            className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 focus:outline-none"
                        >
                            <h3 className="text-lg font-semibold text-white">{oddType.value}</h3>
                            <svg className={`w-6 h-6 text-white transform transition-transform ${isSectionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {isSectionOpen && (
                            <div className="p-4">
                                <table className="w-full text-white">
                                    <thead>
                                        <tr className="border-b-2 border-gray-600">
                                            {headers.map(h => <th key={h} className="py-2 px-4 font-semibold">{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {content}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [matches, setMatches] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        // Load data from data2.json
        setMatches(data2.data);
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = matches.filter(match =>
                match.gid.includes(searchQuery)
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, matches]);
    
    // Remove pre-select logic. Only show match after user selects from search bar.

    const handleSelectMatch = (match) => {
        setSelectedMatch(match);
        setSearchQuery('');
        setSuggestions([]);
    };

    return (
        <div className="bg-gray-900 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-center text-white mb-4">Match Odds</h1>
                    <SearchBar
                        query={searchQuery}
                        setQuery={setSearchQuery}
                        suggestions={suggestions}
                        onSelectMatch={handleSelectMatch}
                    />
                </header>
                
                <main>
                    {selectedMatch ? (
                        <>
                            <MatchInfo match={selectedMatch} />
                            <OddsTable odds={selectedMatch.matches.match.odds} />
                        </>
                    ) : (
                        <div className="text-center text-gray-400 mt-20">
                            <p className="text-xl">Please search for a match to see the odds.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
