import { Children } from 'react'
import App from './components/App.jsx'
import DIYlist from './components/DIYlist.jsx'
import NewDiyForm from './components/NewDiyForm.jsx'

const routes = [
    {
        path: "/",
        element: <App/>,
        errorElement: <h1>Opps wrong page</h1>,
        children: [
            {
                path: "/",
                element: <DIYlist/>
            },
            {
                path: "/add-diy",
                element: <NewDiyForm/>
            }
        ]
        
    }
]

export default routes