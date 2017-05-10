# Gotham Imperial Hotel

Welcome to the completely fictional Gotham Imperial Hotel.

<a href="https://pwabook.com/oreillyrepo"><img align="right" src="https://github.com/TalAter/awesome-progressive-web-apps/raw/master/images/mpwa.png" alt="Building Progressive Web Apps"></a>

As you read through the <a href="https://pwabook.com/oreillyrepo">Building Progressive Web Apps book</a>, you will take this simple site ([branch: ch02-start](https://github.com/TalAter/gotham_imperial_hotel/tree/ch02-start)), and turn it into a full featured progressive web app ([branch: ch12-end](https://github.com/TalAter/gotham_imperial_hotel/tree/ch12-end)).

You will use service workers so that it loads almost instantly (even on the slowest connections), making sure all of its features are available even when your users are completely offline (including seeing their reservations and even making new ones). You will learn how to let users add an icon to launch your progressive web app from their device's homescreen. Finally, you will complete the native app-like experience by adding the ability to reach your users with push notifications, even after they have left your site.

### Working with the code

To get started, open your computer's command prompt (the console), change to the directory you would like to download the code to, and run the following commands:

````
git clone -b ch02-start git@github.com:TalAter/gotham_imperial_hotel.git
cd gotham_imperial_hotel
npm install
````

These commands will clone the source code for the Gotham Imperial Hotel web app, change to the branch named `ch02-start`, and install the dependencies needed to run it.

Next, you can go ahead and start a local server to serve the site with the following command:

````
npm start
````

If you now open [http://localhost:8443/](http://localhost:8443/) in your browser, you should see the Gotham Imperial Hotel site.

As the code of each chapter builds on changes made in previous chapters, at the beginning of each chapter your code will need to include all of those changes. If you skipped over any of the coding exercises in the book, or even whole chapters, you can always bring the code to the state it should be at in the beginning of that chapter by checking out the branch for that chapter.

For example, before starting chapter 5 you can run the following:

````
git reset --hard
git checkout ch05-start
````

> Detailed instructions for working with the code are available in chapter 2 of the book.

### Prerequisites

* <a href="https://pwabook.com/oreillyrepo">Building Progressive Web Apps</a>
* Git
* Node.js
* NPM

### Author

Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License

Licensed under [MIT](https://github.com/TalAter/Progressive-UI-KITT/blob/master/LICENSE).
