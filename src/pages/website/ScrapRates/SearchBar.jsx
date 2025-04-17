import { FiSearch, FiX } from 'react-icons/fi';
import { MdKeyboardVoice } from 'react-icons/md';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-md px-4 sm:px-6 md:px-0 mb-6">
      <input
        type="text"
        placeholder="Search for scrap items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-12 py-3 bg-white text-sm text-gray-800 placeholder-gray-400 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 ease-in-out"
      />

      {/* Search icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 w-5 h-5" />
      </div>

      {/* Clear (X) button */}
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-10 inset-y-0 flex items-center text-gray-400 hover:text-gray-600 transition"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
export default SearchBar;
