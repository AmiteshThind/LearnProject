import {withRouter} from "next/router"

function ActiveLink({router,href,children}) {
    (function perfetchPages(){
        if(typeof window != "undefined"){
            router.prefetch(router.pathname);
        }
    })
    const handleClick = event =>{
        event.preventDefault();
        router.push(href);
    }

    const isCurrentPath = router.pathname == href || router.asPath == href;
    return (
        <div>
            <a href={href} onClick={handleClick} style={{
                textDecoration:'none',
                margin:0,
                padding:0,
                fontWeight: isCurrentPath? "bold" : "normal",
                color: isCurrentPath ? "#34d399" : "#ffffff",
                 
                
              


            }}>
            {children}
            </a>
            
        </div>
    )
}

export default withRouter(ActiveLink);
