var config = {
    apiKey: "AIzaSyA2E6QMvs3fhlE0XBcGP5uGgdeIbkjyGzM",
    authDomain: "himyu-playground.firebaseapp.com",
    databaseURL: "https://himyu-playground.firebaseio.com",
    projectId: "himyu-playground",
    storageBucket: "",
    messagingSenderId: "455014135012"
};
firebase.initializeApp(config);
var db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

var content_about;
var content_ask;

$(document).ready(function () {

    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }

    content_about = new Vue({
        el: '#content_about',
        data: {
            seen: true
        }
    });

    content_ask = new Vue({
        el: '#content_ask',
        data: {
            cards: [],
            question: "",
            seen: false
        },
        methods: {
            submit_question: function () {
                $('#question_form').removeClass("success");
                $('#question_form').removeClass("error");
                var submit_data = this.question;
                submit_data = submit_data.replace(/^\s+/, '').replace(/\s+$/, '');
                if (submit_data == '' || submit_data.length > 140) {
                    $('#question_form').addClass("error");
                    return;
                }
                $.getJSON('http://ip-api.com/json?callback=?', function (data) {
                    var ip = data["query"];
                    var d = new Date,
                        dformat = [d.getFullYear(),
                            (d.getMonth() + 1).padLeft(),
                d.getDate().padLeft()].join('/') +
                        ' ' + [d.getHours().padLeft(),
                  d.getMinutes().padLeft(),
                  d.getSeconds().padLeft()].join(':'),
                        did = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + ("0" + d.getHours() + 1).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ("000" + d.getMilliseconds().toString()).slice(-3);

                    db.collection("Ask").doc(did).set({
                        question: submit_data,
                        answer: "아직 답변이 되지 않았어요...",
                        userip: new Hashes.SHA512().hex(ip),
                        timestamp: dformat
                    }).then(function (docRef) {
                        update_questions();
                        $('#question_form').addClass("success");
                    }).catch(function (error) {
                        alert(error.message);
                    });
                });
            }
        },
        updated: function () {
            if (this.question.length > 140) {
                $('#question_form>.field').addClass("error");
            } else {
                $('#question_form>.field').removeClass("error");
            }
        }
    });

    var update_questions = () => {
        content_ask.cards = [];
        db.collection("Ask").get().then((queryS) => {
            var promises = []
            queryS.forEach((doc) => {
                var docRef = db.collection("Ask").doc(doc.id);
                promises.push(docRef.get());
            });
            Promise.all(promises.reverse()).then((results) => {
                results.forEach(carddoc => {
                    content_ask.cards.push(carddoc.data());
                });
                content_ask.question = "";
            });
        });
    }
    update_questions();


    $("#menu_about").click(() => {
        $("#menu_about").addClass("active");
        $("#menu_ask").removeClass("active");
        content_about.seen = true;
        content_ask.seen = false;
    });

    $("#menu_ask").click(() => {
        $("#menu_about").removeClass("active");
        $("#menu_ask").addClass("active");
        content_about.seen = false;
        content_ask.seen = true;
    });

    $("#menu_social").click(() => {
        $('.ui.sidebar')
            .sidebar('toggle');
    });
});
