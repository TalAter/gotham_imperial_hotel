self.addEventListener("fetch", function(event) {
  if (event.request.url.includes("/img/logo.png")) {
     event.respondWith(
        fetch("/img/logo-flipped.png")
     );
   }
});