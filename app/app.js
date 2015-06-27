// -----------------------------------------------------
// Here is the starting point for your own code.
// All stuff below is just to show you how it works.
// -----------------------------------------------------

// Browser modules are imported through new ES6 syntax.
// import { greet } from './hello_world/hello_world';

// // Node modules are required the same way as always.
// var os = require('os');

// // window.env contains data from config/env_XXX.json file.
// var envName = window.env.name;

// document.getElementById('greet').innerHTML = greet();
// document.getElementById('platform-info').innerHTML = os.platform();
// document.getElementById('env-name').innerHTML = envName;
//
require('electron-cookies');
import { NetAccess } from './libs/netaccess';
var inst = new NetAccess();

var btn = document.getElementById("Submit");
var rbtn = document.getElementById("Logout");
var ipbox = document.getElementById("ipbox");

var auth = function () {

	btn.innerHTML = "Please wait...";
	btn.classList.remove("btn-primary");
	btn.classList.remove("btn-success");
	btn.classList.remove("btn-danger");
	btn.classList.add("btn-warning");
	ipbox.innerHTML = 'not connected';

	
	var username = document.getElementById('Username').value;
	var password = document.getElementById('Password').value;

	localStorage.setItem('credentials', JSON.stringify({uname: username, pass: password}));

	inst.username = username;
	inst.password = password;

	inst.authenticate(2, function(data){
		if (data.status === true){
			btn.innerHTML = data.message;
			rbtn.innerHTML = 'Logout';
			btn.classList.remove("btn-primary");
			btn.classList.remove("btn-danger");
			btn.classList.remove("btn-warning");
			btn.classList.add("btn-success");
			ipbox.innerHTML = inst.ip;
            ga('send', 'event', 'actions', 'auth', 'ip', inst.ip);
            ga('send', 'event', 'button', 'click', 'auth button', inst.ip);
		} else {
			btn.innerHTML = data.message;
			btn.classList.remove("btn-primary");
			btn.classList.remove("btn-success");
			btn.classList.remove("btn-warning");
			btn.classList.add("btn-danger");
			ipbox.innerHTML = 'not connected';
		}
	});
};

var deauth = function () {
	rbtn.innerHTML = "Please wait...";

	inst.revoke(function(data){
		if (data.status === true){
			rbtn.innerHTML = data.message;
			btn.innerHTML = 'Authenticate';
			btn.classList.remove("btn-success");
			btn.classList.remove("btn-danger");
			btn.classList.remove("btn-warning");
			btn.classList.add("btn-primary");
			ipbox.innerHTML = 'not connected';
            ga('send', 'event', 'actions', 'deauth', 'ip', inst.ip);
            ga('send', 'event', 'button', 'click', 'deauth button', inst.ip);
		} else {
			rbtn.innerHTML = data.message;
			btn.classList.remove("btn-primary");
			btn.classList.remove("btn-success");
			btn.classList.remove("btn-warning");
			btn.classList.add("btn-danger");
		}
	});
};

var credentials = JSON.parse(localStorage.getItem('credentials'));
if (credentials){
	document.getElementById('Username').value = credentials.uname;
	document.getElementById('Password').value = credentials.pass;
	auth();
}


document.getElementById("Submit").addEventListener("click", function(){
	auth();
});

document.getElementById("Logout").addEventListener("click", function(){
	deauth();
});

document.getElementById("loginform").addEventListener("submit", function(e){
	e.preventDefault();
	auth();
}, false);

 
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
 
ga('create', 'UA-49243395-4', 'auto');
ga('send', 'pageview');
