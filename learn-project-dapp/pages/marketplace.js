import UserNavbar from "../components/user/UserNavBar"
import {useMoralis} from 'react-moralis'
import InstructorNavbar from "../components/instructor/InstructorNavBar";
import Banner from "../components/Banner";

function marketplace() {
    // apart from nav the list of courses avaible and screens will be same for isntructors 
    const {user,isAuthenticated} = useMoralis();

    return (
        <div className="     min-h-screen  ">
            { isAuthenticated && user.attributes.role == 'instructor'?
             <InstructorNavbar/> :
                <UserNavbar/>
            }
            <Banner title={"Marketplace"}/>
        </div>
    )
}

export default marketplace
