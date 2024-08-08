import '../../App.css';

import React, { useState } from 'react';

const Topbar = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: any) => {
      const value = event.target.value;
      setSearchTerm(value);
      // Execute your function here with the search term
      console.log('Search Term:', value);
      // You can call another function here if needed
  };

    return (
      <div className="bg-white grid grid-cols-8 items-center w-full p-2 pb-4 border border-b-gray-200 mb-4 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center col-span-1">
          <img src="/path/to/logo.png" alt="Logo" className="h-8 mr-4" />
          
        </div>
  
        {/* Search Bar */}
        <div className='flex justify-between gap-16 pr-6 col-span-7'>
            <div className="hidden w-full max-w-5xl flex-1 pl-4 tall:pl-0 sm:block">
                <div className='w-full relative'>
                    <form>
            <input
            type="text"
            placeholder="Search..."
            className="text-black active:border-none outline-none bg-gray-200 px-4 py-4 rounded-3xl w-full"
            value={searchTerm}
            onChange={handleSearchChange}
             />
             </form>
             </div>
            </div>
  
        {/* Account Button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Account
        </button>
        </div>
      </div>
    );
  };
  
export default Topbar;
