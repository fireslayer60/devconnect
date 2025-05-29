import React from 'react'

function Passwordform({ value, onChange }) {
  return (
    <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-400 tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value ={value}
              onChange={onChange}
              className="
                w-full p-4 rounded-lg
                bg-gray-800 bg-opacity-40
                placeholder-gray-500 text-gray-100 font-normal
                border border-gray-700 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                focus:border-transparent focus:bg-opacity-60 transition
              "
            />
          </div>
  )
}

export default Passwordform
