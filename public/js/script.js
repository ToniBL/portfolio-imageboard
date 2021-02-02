console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    Vue.component("image-modal", {
        template: "#modal", // here goes the id from html script-template
        data: function () {
            // each component has it's own data
            return {
                //name: "toni",
                id: "",
                image: [],
                title: "",
                description: "",
                username: "",
                created_at: "",
            };
        },
        props: ["id"],

        mounted: function () {
            var that = this;
            console.log("this.id:", this.id);

            axios.get("/modal/" + this.id).then(function (response) {
                console.log("response from get modal:", response.data);
                console.log("that:", that);
            });
        },
        methods: {
            // increaseCount: function () {
            //     this.count++; this one method aplies to all the components individually
        },
    });
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
            //imgClicked: false,
            id: "",
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
                    // axios will ALWAYS store the info coming from the server inside 'data' property
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
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                var self = this;
                axios // response hier = req.body from server app.post upload
                    .post("/upload", fd)
                    .then((response) => {
                        console.log("response clickHandler:", response);
                        self.images.unshift(response.data);
                    })

                    .catch((err) => console.log("err: ", err));
            },
            //this starts when selecting file, reacts to @change in html / e.target.file = file in form
            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },
            selectImg: function (id) {
                this.id = id;
                console.log("this.id:", this.id);
                imgClicked = true;

                // console.log(e.target);
                // //console.log(this)
                // selectImg = each.id;
                // console.log(each.id);
            },
        },
    });
})(); // IFEE closing
