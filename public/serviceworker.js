self.addEventListener("fetch", function(event) {
    console.log("Fetch request for:", event.request.url);
});