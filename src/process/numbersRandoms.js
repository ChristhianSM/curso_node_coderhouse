const numberRandoms = (amount) => {
    if (!amount) {
        amount = 10;
    }
    console.log(amount)
    const arrayRandoms = [];
    for (let i = 0; i < amount; i++) {
        const random = Math.floor(Math.random() * 1000);
        arrayRandoms.push(random)
    }
    return arrayRandoms
}

process.on("message", parentMessage => {
    const amount = parseInt(parentMessage.split('-')[1]);
    if (parentMessage.includes('start')) {
        const randoms = numberRandoms(amount);
        process.send(randoms)
    }
})