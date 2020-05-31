

# Calendar Widget thingy

Simple calendar to save notes and events in localStorage.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install Calendar Widget thingy.

```bash
npm install
```

**NOTE:** All installs are totally optional.
You can drag and drop the index.html in the browser. And you can set your IDE to auto-compile .scss on save.

I got [serve.js](https://www.npmjs.com/package/serve) to send the index.html to the browser as browsers sometimes have their own opinion on opening .html from a folder directly.
Since it's starting with file://... instead of http://... browsers sometimes throwing errors because of ``file-access-from-files``.

## Quick start
Just to take a look at a static page with the widget initiated.

```bash
npm start           # starts a simple server at localhost:8080 and all URLs redirected to index.html

npm run build-css   # this will compile the sass into css
npm run watch-scss  # start a watcher for it and will
npm run dev         # all of the above
```

## Usage

```js
const calendar = new CalendarWidget({
    container: '#calendar-container', //mandatory
    locale: ['en', { //optional it uses the browser metadata if not provided (these are moment.js locales)
        week: {
            dow : 1 //0 => sunday is first day of the week 1 monday is the first day of the week
        }
    }],
    currentYear: '2020',  //optional it uses the current Time if not provided YYYY/2020
    currentMonth: '01',  //optional it uses the current Time if not provided MM/02
});
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
