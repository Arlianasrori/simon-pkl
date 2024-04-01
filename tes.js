
    const date = new Date()
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour : "numeric",
        minute : "numeric",
        second : "numeric"
    };
    const tanggal = date.toLocaleDateString("id",options)
    console.log(tanggal);