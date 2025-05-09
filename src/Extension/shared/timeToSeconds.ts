const timeToMS = (time: string): number => {
    let seconds = 0;
    const numbers = time.split(':').reverse();
    numbers.map((num, i) => {
        seconds += +num * (60 ** i);
    })
    return seconds*1000;
}

export default timeToMS;