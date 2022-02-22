import React from 'react';

function AuthErrorMsg({authErrorMsg}) {
  return <div>

<div className="flex font-semibold text-rose-400 text-center mt-12 text-4xl justify-center items-center">
            {authErrorMsg}
        </div>
        
  </div>;
}

export default AuthErrorMsg;
