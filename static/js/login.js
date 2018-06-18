$(document).ready(() => {
  $("#login-button").on("click", function(event) {
    let username = $("#loginUsername").val();
    let password = $("#loginPassword").val();

    password = CryptoJS.enc.Hex.stringify( CryptoJS.SHA1(password, "string"));

    let req = {
      username: username,
      password: password
    };
    $.post("/user/login", req, responseJSON => {
      let data = JSON.parse(responseJSON);

      if(data.error) {
        alert(data.error);
      }
      else {
        window.localStorage.setItem("profile", JSON.stringify(data));
        window.location = "/dashboard";
      }
    });
  });
  $(document).keypress(function(event) {
    if(event.which == 13) {
        let username = $("#loginUsername").val();
        let password = $("#loginPassword").val();

        password = CryptoJS.enc.Hex.stringify( CryptoJS.SHA1(password, "string"));

        let req = {
            username: username,
            password: password
        };
        $.post("/user/login", req, responseJSON => {
            let data = JSON.parse(responseJSON);

            if(data.error) {
                alert(data.error);
            }
            else {
                window.localStorage.setItem("profile", JSON.stringify(data));
                window.location = "/dashboard";
            }
        });
      }
  });
});
