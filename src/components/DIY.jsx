function DIY({diy}) {
    console.log(diy)
    return <li>
        <h1>DIY item {diy.id}</h1>
        <h2>Name: {diy.name}</h2>
    </li>
}

export default DIY