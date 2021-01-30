console.log("script is linked");
// this file will hold all our vue code

(function () {
    new Vue({
        el: "#main", //which element to connect in html
        data: {
            name: "Adobo",
            seen: false,
            cities: [],
        },
        methods: {
            // is an object where we write all our functions
        },
    });
})();
