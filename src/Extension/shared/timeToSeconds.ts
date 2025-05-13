const timeToMS = (time: string): number => {
    let seconds = 0;
    const numbers = time.split(':');
    numbers.map((num, i) => {
        seconds += +num * (60 ** (2-i));
    })
    return seconds*1000;
}

export default timeToMS;