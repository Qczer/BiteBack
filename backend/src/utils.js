const serverError = (err, res) => {
    console.log(err)
    res.status(500).json({
        error: err
    })
}

export { serverError }