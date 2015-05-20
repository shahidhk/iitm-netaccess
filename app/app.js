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
import { NetAccess } from './libs/netaccess';

var auth = function () {
	var btn = document.getElementById("Submit");
	btn.innerHTML = "Please wait...";
	btn.classList.remove("btn-primary");
	btn.classList.remove("btn-success");
	btn.classList.remove("btn-danger");
	btn.classList.add("btn-warning");
	
	var username = document.getElementById('Username').value;
	var password = document.getElementById('Password').value;

	localStorage.setItem('credentials', JSON.stringify({uname: username, pass: password}));

	var inst = new NetAccess(username, password);

	inst.authenticate(2, function(data){
		if (data.status === true){
			btn.innerHTML = data.message;
			btn.classList.remove("btn-primary");
			btn.classList.remove("btn-danger");
			btn.classList.remove("btn-warning");
			btn.classList.add("btn-success");
		} else {
			btn.innerHTML = data.message;
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