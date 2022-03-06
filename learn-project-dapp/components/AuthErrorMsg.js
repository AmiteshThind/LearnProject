import React from 'react';

function AuthErrorMsg({authErrorMsg}) {
  return <div>

<div className="flex  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 text-center mt-12 text-4xl justify-center items-center">
            {authErrorMsg}
        </div>
        
  </div>;
}

export default AuthErrorMsg;
