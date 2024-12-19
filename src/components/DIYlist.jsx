import { useOutletContext } from "react-router-dom"
import DIY from "./DIY"

function DIYlist() {
    const {DIYs} = useOutletContext()

    const DIYcomponents = DIYs.map(diy => {
      
        return <DIY key = {diy.id} diy = {diy}/>
    })

    return <ul>
        {DIYcomponents}
    </ul>
}

export default DIYlist