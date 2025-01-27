// post web data

async function init(args) {
    let data = await system.fetchURL(args[0])
    system.push(data)
}