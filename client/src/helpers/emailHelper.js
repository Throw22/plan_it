import "isomorphic-fetch";
import ApiResponseHelper from "./apiResponseHelper";

export function emailFeedback(message) {
  alert(message);
}

export function shareByEmail(form) {
  return dispatch => {
    const myHeaders = new Headers({
      "Content-Type": "application/json"
    });
    const options = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(form)
    };
    return fetch(
      "https://julie-server.herokuapp.com/api/service/email",
      options
    )
      .then(ApiResponseHelper.responseChecker)
      .then(ApiResponseHelper.parseToJSON)
      .then(data => {
        console.log("email", data);
        emailFeedback("Email sent successfully!");
      })
      .catch(err => {
        console.log("sending email failure", err);
        emailFeedback("Email did not send. Try again");
      });
  };
}
