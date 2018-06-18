$(document).ready(() => {
  $("#reg-button").on("click", function(event) {
    let username = $("#regUsername").val();
    let password = $("#regPassword").val();
    let email = $("#regEmail").val();
    let language = $('input[name=language]:checked', '#registerForm').val();

    password = CryptoJS.enc.Hex.stringify( CryptoJS.SHA1(password, "string"));

    let req = {
      username: username,
      password: password,
      email   : email,
      language: language
    }
    $.post("/user/register", req, responseJSON => {
      let data = JSON.parse(responseJSON);

      if(data.error) {
        alert(data.error);
      }
      else {
        alert(data.success);

        req = {
            username: username,
            email: email
        }
        $.post("/user/welcome", req, responseJSON => {
            let data = JSON.parse(responseJSON);
        });

        req = {
          username: username,
          password: password
        }
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
        window.localStorage.setItem("profile", JSON.stringify(data));
      }
    });
  });
  $(document).keypress(function(event) {
    if(event.which == 13) {
        let username = $("#regUsername").val();
        let password = $("#regPassword").val();
        let email = $("#regEmail").val();
        let language = $('input[name=language]:checked', '#registerForm').val();

        password = CryptoJS.enc.Hex.stringify( CryptoJS.SHA1(password, "string"));

        let req = {
            username: username,
            password: password,
            email   : email,
            language: language
        }
        $.post("/user/register", req, responseJSON => {
            let data = JSON.parse(responseJSON);

            if(data.error) {
                alert(data.error);
            }
            else {
                alert(data.success);

                req = {
                    username: username,
                    email: email
                }
                $.post("/user/welcome", req, responseJSON => {
                    let data = JSON.parse(responseJSON);
                });

                req = {
                    username: username,
                    password: password
                }
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


                window.localStorage.setItem("profile", JSON.stringify(data));
            }
        });
        }
    });
});
