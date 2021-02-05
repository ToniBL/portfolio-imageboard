console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    Vue.component("comment-component", {
        template: "#commentcomponent", //
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["imageId"],
        mounted: function () {
            var self = this;
            axios
                .get(`/comment/${self.imageId}`)
                .then((response) => {
                    console.log("response from /comments:", response);
                    self.comments = response.data;
                })
                .catch((err) => {
                    console.log("err in mounted comment:", err);
                });
        },
        methods: {
            addComment: function () {
                // create comments obj here
                const commentobj = {
                    comment: this.comment,
                    username: this.username,
                    imageId: this.imageId,
                };
                console.log("commentobj", commentobj);
                axios.post("/comment", commentobj).then((response) => {
                    console.log("response in post comment:", response.data);
                    this.comments.push(response.data);
                });
            },
        },
    });

    Vue.component("image-modal-component", {
        template: "#modal", // here goes the id from html script-template
        data: function () {
            // each component has it's own data
            return {
                //name: "toni",
                url: "",
                title: "",
                description: "",
                username: "",
                created_at: "",
            };
        },
        props: ["imageId"],

        mounted: function () {
            console.log("modal mounted");
            console.log("this.id:", this.imageId);
            var self = this;
            axios
                .get(`/modal/${this.imageId}`)
                .then(function (response) {
                    // console.log("self:", self);
                    // console.log("response from get modal:", response.data);
                    self.url = response.data[0].url;
                    console.log("self.url:", self.url);
                    self.title = response.data[0].title;
                    self.description = response.data[0].description;
                    self.username = response.data[0].username;
                    self.created_at = new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                        timeStyle: "short",
                    }).format(new Date(response.data[0].created_at));
                })
                .catch((err) => {
                    console.log("err in modal axios:", err);
                });
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
            // increaseCount: function () {
            //     this.count++;
            // },
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
            selectImg: null, //location.hash.slice(1),
            latestId: 0,
            moreImg: true,
        },

        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            //    PART 5 updating url with direct hash route to img
            //     addEventListener("hashchange", () => {console.log("hash updated", location.hash)
            // this.imageSelected = local.hash.slice(1)})

            // console.log("my vue instance has mounted");
            // console.log("this outside axios: ", this);
            axios
                .get("/images")
                .then((response) => {
                    console.log("this inside axios: ", this);
                    // axios will ALWAYS store the info coming from the server inside 'data' property
                    // console.log("response from /images: ", response.data);
                    this.images = response.data;
                    // this.latestId = this.images[this.images.length - 1].id;
                })
                .catch((err) => {
                    console.log("err in /images: ", err);
                });
        },

        // methods will store ALL the functions we create!!!
        methods: {
            postImg: function () {
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                axios // response hier = req.body from server app.post upload
                    .post("/upload", fd)
                    .then((response) => {
                        console.log("response clickHandler:", response);
                        this.images.unshift(response.data);
                    })

                    .catch((err) => console.log("err: ", err));
            },
            //this starts when selecting file, reacts to @change in html / e.target.file = file in form
            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },
            closeModal: function () {
                console.log("close modal on instance side");
                this.selectImg = null;
            },

            more: function () {
                // console.log("latest:", latest);
                // latestId = latest.id;s
                // console.log("latestId:", latestId);
                this.latestId = this.images[this.images.length - 1].id;

                axios.get(`/more/${this.latestId}`).then((response) => {
                    console.log(response.data);
                    console.log(
                        "response.data[0].lowestId:",
                        response.data[0].lowestId
                    );
                    console.log("this.latestId:", this.latestId);
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].id === response.data[i].lowestId) {
                            this.moreImg = false;
                        }
                    }
                    this.images = [...this.images, ...response.data];
                });
            },
        },
    });
})(); // IFEE closing
