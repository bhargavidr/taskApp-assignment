const obj = {
    custom : (a=10)=>{
        return a+10
    },
    prop: this.custom
}

console.log(obj.prop)