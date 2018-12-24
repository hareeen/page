var config = {
  apiKey: "AIzaSyA2E6QMvs3fhlE0XBcGP5uGgdeIbkjyGzM",
  authDomain: "himyu-playground.firebaseapp.com",
  databaseURL: "https://himyu-playground.firebaseio.com",
  projectId: "himyu-playground",
  storageBucket: "",
  messagingSenderId: "455014135012"
};
firebase.initializeApp(config);
var database=firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
database.settings(settings);

var content_about;
var content_ask;
var content_works;
$( document ).ready(function() {
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
      seen: false
    }, 
    methods: {
      
    }
  });

  content_works = new Vue({
    el: '#content_works',
    data: {
      seen: false
    }
  });

  $('#sidebar_about').click(function() {
    $('#sidebar_about').attr("active", 0);
    $("#sidebar_ask").removeAttr("active");
    $("#sidebar_works").removeAttr("active");
    content_about.seen=true;
    content_ask.seen=false;
    content_works.seen=false;
  });
  $('#sidebar_ask').click(function() {
    $('#sidebar_ask').attr("active", 0);
    $("#sidebar_works").removeAttr("active");
    $("#sidebar_about").removeAttr("active");
    content_ask.seen=true;
    content_works.seen=false;
    content_about.seen=false;
  });
  $('#sidebar_works').click(function() {
    $('#sidebar_works').attr("active", 0);
    $("#sidebar_about").removeAttr("active");
    $("#sidebar_ask").removeAttr("active");
    content_works.seen=true;
    content_about.seen=false;
    content_ask.seen=false;
  });
  
  Number.prototype.padLeft = function(base,chr) {
    var len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  }

  var update_questions = function() {
    content_ask.cards=[];
    database.collection("Ask").get().then(function(querySnapshot) {
      var promises=[]
      querySnapshot.forEach(function(doc) {
        var docRef = database.collection("Ask").doc(doc.id);
        promises.push(docRef.get());
      });
      Promise.all(promises.reverse()).then(function(results) {
        results.forEach(carddoc => {
          content_ask.cards.push(carddoc.data());
        });
      });
    });
  }

  $('#submit').click(function() {
    var question=$("#question").val();
    if(question.replace(/^\s+/, '').replace(/\s+$/, '')=='') {
      alert("질문을 입력해 주세요!!")
      return;
    } 
    var findIP = new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}})
    
    findIP.then(function(ip) {
      var d = new Date,
      dformat = [ d.getFullYear(),
                  (d.getMonth()+1).padLeft(),
                  d.getDate().padLeft()].join('/')+
                  ' ' +
                [ d.getHours().padLeft(),
                  d.getMinutes().padLeft(),
                  d.getSeconds().padLeft()].join(':'), 
      did = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + ("0" + d.getHours() + 1 ).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ("000"+d.getMilliseconds().toString()).slice(-3);
      
      database.collection("Ask").doc(did).set({
        question: question,
        answer: "아직 답변이 되지 않았어요...",
        userip: new Hashes.SHA512().hex(ip), 
        timestamp:dformat
      }).then(function(docRef) {
        alert("질문 등록이 완료되었어요!")
        $("#question").val('');
        update_questions();
      }).catch(function(error) {
        alert(error.message);
      });
    }).catch(function(err) {
      console.error(err)
    });
  });

  update_questions();
});