const a = [1,2,3]
const h = () => {
    for (let i = 0; i < a.length; i++) {
        if (a.indexOf(a[i]) !== a.lastIndexOf(a[i])) {
          return true
        }
      }
    return false

}

console.log(h());

const Now = new Date()

const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
const hourNow = datelocal.split(" ")[1]

console.log(datelocal);
console.log(hourNow);