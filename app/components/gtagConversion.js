export function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof url != "undefined") {
      window.location = url;
    }
  };
  window.gtag("event", "conversion", {
    send_to: "AW-11170461037/Fk6gCJDK8JwYEO3qvs4p",
    event_callback: callback,
  });
  return false;
}
