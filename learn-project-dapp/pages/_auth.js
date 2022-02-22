import { useRouter } from 'next/router'
import Moralis from 'moralis'
import { useMoralis } from 'react-moralis'

export const AuthCheck = (props) => {
  const router = useRouter()
  const {user,isAuthenticated} = useMoralis(); // you need to implement this. In this example, undefined means things are still loading, null means user is not signed in, anything truthy means they're signed in
    
  if (!isAuthenticated) {router.push('/marketplace')}

  return props.children
}