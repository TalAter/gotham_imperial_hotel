var responseContent = "<html>" +
  "<body>" +
  "<style>" +
  "body {text-align: center; background-color: #333; color: #eee;}" +
  "</style>" +
  "<h1>Gotham Imperial Hotel</h1>" +
  "<p>There seems to be a problem with your connection.</p>" +
  "<p>Come visit us at 1 Imperial Plaza, Gotham City for free WiFi.</p>" +
  "</body>" +
  "</html>";

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response(responseContent, {headers: {"Content-Type": "text/html"}});
    })
  );
});