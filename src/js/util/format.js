export default {
    format: num => {
        if (Math.floor(num) === num) {
            return num.toFixed(0);
        }
        return num.toFixed(2);
    }
};