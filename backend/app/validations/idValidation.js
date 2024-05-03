const isValidID = async (req,res,next) => {
    const Pattern = /^[0-9a-fA-F]{24}$/
    if(Pattern.test(req.params.id)){
        next()
    }else{
        res.status(400).send({error:'Invalid MongDB ID'})
    }
}

module.exports = isValidID
