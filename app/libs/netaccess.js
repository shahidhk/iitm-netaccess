

export var NetAccess = function () {
	var request = require('request');
	var j = request.jar();

	this.username = '';
	this.password = '';
	this.request = request.defaults({jar: j});
	this.base_url = 'https://netaccess.iitm.ac.in/account/';
	this.ip_regex = /<p>You can authorize the machine <span class="label label-primary">\n(\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3})<\/span>/;
	this.login_verify_str_prefix = '/account/revoke/';

	this._USERNAME_PASSWORD_ERR_MSG_ = 'Invalid username/password!';
    this._AUTH_SUCCESS_MSG_ = 'Authentication successfull!';
    this._REVOKE_SUCCESS_MSG_ = 'Logout successfull!';
    this._ERROR_MSG_ = 'Network error! Please try again';
    this._AUTH_VERIFY_STR_ = 'Login failed';

    this.ip = '';
};

NetAccess.prototype.authenticate = function(duration, callback) {
	var session = this;
	var my_ip;
	try {
		session.request.post(
			{
				url: this.base_url + 'login',
				form: { userLogin: session.username, userPassword: session.password }
			},
			function(error, response, body){
				if (error) { callback({status: false, message: session._ERROR_MSG_}); return; }
				try {
					session.request.get(
					{
						url: session.base_url + 'index'
					},
					function(error,response,body){
						if (error) { callback({status: false, message: session._ERROR_MSG_}); return; }
						try {
							if (body.indexOf('<b>Username: </b> '+ session.username) == -1 ){
								callback({status: false, message: session._USERNAME_PASSWORD_ERR_MSG_});
								return;
							}
						}
						catch (e) {
							callback({status: false, message: session._ERROR_MSG_});
							return;
						}
					});

					session.request.post(
						{
							url: session.base_url + 'approve',
							form: { duration: duration, approveBtn: '' }
						},
						function(err, response, body){
							if (error) { callback({status: false, message: session._ERROR_MSG_}); return; }
							try {
								var ip_m;
								if ((ip_m = session.ip_regex.exec(body)) !== null) {
								    if (ip_m.index === session.ip_regex.lastIndex) {
								        ip_regex.lastIndex++;
								    }
								    my_ip = ip_m[1];
								    session.ip = my_ip;
								}

								session.request.get(
									{
										url: session.base_url + 'index'
									},
									function(error,response,body){
										if (error) { callback({status: false, message: session._ERROR_MSG_}); return; }
										try {
											if (body.indexOf(session.login_verify_str_prefix + my_ip) != -1 ){
												callback({status: true, message: session._AUTH_SUCCESS_MSG_});
												return;
											}
										}
										catch (e) {
											callback({status: false, message: session._ERROR_MSG_});
											return;
										}
									});
							}
							catch (e) {
								callback({status: false, message: session._ERROR_MSG_});
								return;
							}	
						}
					);
				}
				catch (e) {
					callback({status: false, message: session._ERROR_MSG_});
					return;
				}
			}
		);
	}
	catch (e) {
		callback({status: false, message: session._ERROR_MSG_});
		return;
	}
};

NetAccess.prototype.revoke = function(callback) {
	var session = this;
	try{
		session.request.get(
			{
				url: session.base_url + 'revoke/' + session.ip
			},
			function(error,response,body){
				if (error) { callback({status: false, message: session._ERROR_MSG_}); return; }
				try {
					if (body.indexOf(session.login_verify_str_prefix + session.ip) == -1 ){
						callback({status: true, message: session._REVOKE_SUCCESS_MSG_});
						return;
					}
				}
				catch (e) {
					callback({status: false, message: session._ERROR_MSG_});
					return;
				}
			});
	}
	catch (e) {
		callback({status: false, message: session._ERROR_MSG_});
		return;
	}
};