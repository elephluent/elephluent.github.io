function updateProgress(lesson, profile, after) {
  let req = {
    username: profile.username,
    lesson: lesson
  };
  $.post("/user/update-progress", req, responseJSON => {
    let newProfile = JSON.parse(responseJSON);

    if (newProfile.error) {
      console.log("ERROR");
    } else {
      window.localStorage.setItem("profile", JSON.stringify(newProfile));
    }

    if (after !== undefined) {
      location.href = after;
    }
  });
}
