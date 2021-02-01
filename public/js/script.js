console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    new Vue({
        // el - element in our html that has access to our Vue code!
        el: "#main",
        // data - an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            //name: "Toni",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },

        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            // console.log("my vue instance has mounted");
            // console.log("this outside axios: ", this);
            var self = this;

            axios
                .get("/images")
                .then(function (response) {
                    console.log("this inside axios: ", self);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    console.log("response from /images: ", response.data);

                    self.images = response.data;
                })
                .catch(function (err) {
                    console.log("err in /images: ", err);
                });
        },

        // methods will store ALL the functions we create!!!
        methods: {
            clickHandler: function () {
                console.log("this:", this);
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                axios
                    .post("/upload", fd)
                    .then((response) => console.log("response:", response))
                    .catch((err) => console.log("err in clickHandler:", err));
            },

            fileSelectHandler: function (e) {
                console.log("e:", e);
                this.file = e.target.files[0];
            },
        },
    });
})(); // IFEE closing
