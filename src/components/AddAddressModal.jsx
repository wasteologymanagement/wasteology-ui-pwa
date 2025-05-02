import React, { useEffect, useState } from 'react';

const cities = ['Delhi', 'Gurugram', 'Noida', 'Faridabad'];

const AddAddressModal = ({ open, onClose, onAdd }) => {
  const [newAddress, setNewAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [pinCheckMsg, setPinCheckMsg] = useState('');
  const [isServiceable, setIsServiceable] = useState(true);
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  const handleAdd = () => {
    if (newAddress && city && pincode.length === 6 && isServiceable) {
      onAdd({ address: newAddress, city, pincode });
      onClose();
    }
  };

  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length === 6) {
        setIsCheckingPin(true);
        const response = await fakeCheckPincodeAPI(pincode);
        if (response.available) {
          setIsServiceable(true);
          setPinCheckMsg('✅ Service available in your area.');
        } else {
          setIsServiceable(false);
          setPinCheckMsg('❌ Sorry, service is not available at this pincode.');
        }
        setIsCheckingPin(false);
      } else {
        setPinCheckMsg('');
        setIsServiceable(true);
        setIsCheckingPin(false);
      }
    };
    checkPincode();
  }, [pincode]);

  const fakeCheckPincodeAPI = async (pin) => {
    await new Promise((res) => setTimeout(res, 1000));
    const available = /^11|12|20/.test(pin); // Only '11xxx' and '12xxx' and '20xxx' are serviceable
    return { available };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

        <input
          className="w-full mb-3 p-3 border rounded-lg"
          placeholder="Enter address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />

        <select
          className="w-full mb-3 p-3 border rounded-lg"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Pincode with loader */}
        <div className="relative">
          <input
            type="text"
            maxLength="6"
            className="w-full mb-2 p-3 border rounded-lg pr-10"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/, ''))}
          />
          {isCheckingPin && (
            <div className="absolute right-3 top-2.5">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {pinCheckMsg && (
          <p className={`text-sm mb-3 ${isServiceable ? 'text-green-600' : 'text-red-600'}`}>
            {pinCheckMsg}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            disabled={!newAddress || !city || pincode.length !== 6 || !isServiceable || isCheckingPin}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
