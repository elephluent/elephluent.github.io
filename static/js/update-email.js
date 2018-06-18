function updateEmail(username, module, lesson, score, missed, time) {
    let req = {
        username  : username,
        module    : module,
        lesson    : lesson,
        score     : score,
        missed    : missed,
        totalTime : time
    }
    $.post("/user/emailupdate", req, responseJSON => {
        let success = JSON.parse(responseJSON);
        console.log('sent update email:' + success)
    });
}