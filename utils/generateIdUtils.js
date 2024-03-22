import Randomstring from "randomstring";

const generateId = () => {
    return parseInt(Randomstring.generate({
        length : 4,
        charset: ['numeric']
    }))
}
export default generateId