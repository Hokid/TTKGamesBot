function init_fun(){


function add_fun(){


		this.post_code = function(input_id, cnt_id){

							var
								_url = "/ajax/action2015/activate_code.php",
								val = jQuery("#"+input_id).val(),
								post_data = {};

								val = val.toUpperCase();

							for( i = 1, s = 0; i <= 4; i++, s += 4){

								post_data["c"+i] = val.substr( s, 4);

							}

							console.log(post_data);

							jQuery.ajax({

								type: "POST",
								data: post_data,
								url: _url,
								dataType: "json",
								success: function(data){

											jQuery("#"+cnt_id).html(JSON.stringify(data));

								},
								error: function(xhr,status,errorThrown){

											jQuery("#"+cnt_id).html(errorThrown);

								}

							});
		};

		this.check_img_code = function ( start, end, rand_time, callback ){

			this.start = start;
			this.end = end;
			this.rand_time = rand_time;
			this.callback = callback;
			this.resp_cnt = $("#el_response");
			this.between_r_cnt = $("#between_r_resp");
			this.img_cnt = $("#el_img");
			this.audio_cnt = $("#el_audio")[0];
			this.start_date;
			this.end_date;
			this.req_len = 0;
			this.count = 0;	
			this.img_code = window.img_code.length ? window.img_code[window.img_code.length-1] : [];
			this.toggle_check_arr = window.img_code.length ? true : false;
			this.lock_req = false;
			this.req_id = (function(){

				var
					s = this.start,
					e = this.end,
					result = []; // массив с id, которые будут запрашиваться
					// console.log(this);
					// console.log(s);
					// console.log(e);

				while( s <= e ){

					if(this.img_code.length){

						if( this.img_code.indexOf(s) == -1 ) result.push(s);

					} else result.push(s);

				s++}

				// console.log(result);
				// if(!result.length) return;
				this.req_len = result.length;
				return result;

			}).call(this);		
			this.lock = function(){this.lock_req = true};					           
            this.go = function(){

            		  if(!this.req_len) {

            		  	console.log("Число запросов равно 0"); 
            		  	return;

            		  }

            		  if( this.lock_req ) return;
            		  // if( this.count == Math.round(this.req_len/2) ) this.req_between(this);
                   	  if( !this.count ) this.start_date = new Date; 
                      if( this.count < this.req_len ) this.get_code(this); 
                      if( this.count == this.req_len ){

                      	// console.log(this.count+" / "+this.req_len);

                      	this.end_date = new Date;
                      	$("#time_info").append("<span>-/ "+((this.end_date-this.start_date)/1000)+" сек. /</span>");

                      	if($("#time_info > span").length == 4) $("#time_info > span:first-child").remove();
                      	
                      	$("#already_ac").append("<span>-| "+this.img_code.length+" |-</span>");

                      	if($("#already_ac > span").length == 4) $("#already_ac > span:first-child").remove();

                      	this.callback(this.img_code);

                      }

                      return; 
            };
            this.get_code = function(context){
			var
				req_id = context.req_id[context.count],
				_url;

			_url = '/BigGameTTK2015/cache_code/'+req_id+'.png';

			$.ajax({
		
				type: "HEAD",
				url: _url,
				success: function(d,s,xhr){

					if(xhr.status == 200) {

						if(context.toggle_check_arr){
							// console.log("!");

							if(window.img_code[window.img_code.length-1].indexOf(req_id) == -1){

								console.log("Новый: "+req_id);
								context.audio_cnt.play();
								// window.last_code = req_id;
								context.img_cnt.html('<img src="/BigGameTTK2015/cache_code/'+req_id+'.png" width="570" height="80" alt="" />');
								// context.lock_req = true;
								window.img_code[window.img_code.length-1].push(req_id);
								return;

							}

						}
						context.img_code.push(req_id);

					}

                    ++context.count;
                    setTimeout(function(){context.go()} ,context.rand_time);
                    // context.go();
                    
							
				},

				error: function(xhr,status,errorThrown){
                    ++context.count;
                    // console.log(xhr);
                    setTimeout(function(){context.go()} ,context.rand_time);
				}

			});
            };
    		this.req_between = function(context){

				var 
					_url = "/ajax/action2015/get_code.php";

				$.ajax({
			
					type: "GET",
					url: _url,
					dataType: "json",
					success: function(data){

						// console.log("I'm Betweem");

								if(!data.error){

									if(!context.toggle_check_arr) { 

										window.last_code = data.id_code;
										context.between_r_cnt.html("Недавний код:");
										context.img_cnt.html('<img src="/BigGameTTK2015/cache_code/'+data.id_code+'.png" width="570" height="80" alt="" />');
										return;
										console.log("Недавний: "+data.id_code);
									}

									if(window.last_code != data.id_code){

										console.log("Новый: "+data.id_code);
										context.lock_req = true;
										context.audio_cnt.play();
										context.img_cnt.html('<img src="/BigGameTTK2015/cache_code/'+data.id_code+'.png" width="570" height="80" alt="" />');
										window.last_code = data.id_code;

										if(context.toggle_check_arr) window.img_code[window.img_code.length-1].push(data.id_code);

										return;
																				
									}else window.last_code = data.id_code;

								}else context.between_r_cnt.html(JSON.stringify(data));
					},

					error: function(xhr,status,errorThrown){

								context.between_r_cnt.html(errorThrown);

					}

				});

			};
            return this;
		};
}




var 
	timer_id, 
	count_response = 0, 
	html_code, 
	style_code;

style_code = '<style>\
\
	#fix_wrap{\
\
		position:fixed;\
		top:0; left:0;right:0;bottom:0;\
		overflow:auto;\
		background-color:rgba(255,255,255,.8);\
		display:none;\
\
	}\
\
	#fix_toggle{\
\
		position:fixed;\
		opacity:.1;\
		font-size: 1.5em;\
		cursor: pointer;\
		color: #fff;\
		width: 70px;\
		height: 30px;\
		z-index:667;\
		left:40px;bottom:40px;\
		background-color:rgba(85, 126, 134, 0.8);\
\
	}\
\
	#center_wrap{\
\
		width: 570px;\
		height: 400px;\
		position:absolute;\
		padding: 30px;\
		background-color: #639BAE;\
		z-index:666;\
		top:0; left:0;right:0;bottom:0;\
		margin: auto auto;\
\
	}\
\
	#el_response{\
\
		text-align: center;\
		background-color: #EAFBFF;\
		padding: 16px 0;\
		min-height: 20px;\
		margin: 10px 0;\
		font-size: 1.5em;\
\
	}\
\
	#el_response > img{\
\
		display:block;\
		margin: 0 auto;\
\
	}\
\
	#time_info{\
\
	color: #fff;\
	text-align:center;\
\
	}\
\
	.param{\
\
	display:block;\
	width:50px;\
	float:left;\
\
	}\
\
	#el_enter_code{\
\
		box-sizing: border-box;\
		display:block;\
		width: 100%;\
		height: 32px;\
		margin: 10px auto;\
		font-size: 1.5em;\
\
	}\
\
	#el_code_len,\
	#work_info{\
\
		height: 20px;\
		margin: 10px auto;\
		font-size: 1.2em;\
\
	}\
\
	#el_btn_cnt{\
\
	margin: 10px auto;\
\
	}\
\
	#el_btn_cnt:after{\
\
	content:"";\
	display:block;\
	clear:both;\
\
	}\
\
	.btn_fun{\
\
	width: 100px;\
	cursor: pointer;\
	height: 40px;\
	margin: 0 5px 0;\
	background-color: #8DDFD2;\
	line-height: 40px;\
	text-align: center;\
	font-size: 1.5em;\
	color: #528682;\
	float: right;\
\
	}\
\
	#el_audio{\
\
		width: 100%;\
		margin:20px 0;\
		border: 1px solid;\
		background-color: #000;\
\
	}\
\
</style>';

html_code = '\
\
<div id="fix_toggle">On/Off</div>\
<div id="fix_wrap">\
	<div id="center_wrap">\
		<div id="el_response"></div>\
		<div id="between_r_resp"></div>\
		<div id="el_img"></div>\
		<input id="el_enter_code" type="text" maxlength=16>\
		<div id="el_code_len"></div>\
		<div id="work_info"></div>\
		<div id="time_info"></div>\
		<div id="already_ac"></div>\
		<div id="el_btn_cnt">\
			<div id="el_btn_stop" class="btn_fun">Стоп</div>\
			<div id="el_btn_star" class="btn_fun">Старт</div>\
			<div id="el_post_code" class="btn_fun">Отправить</div>\
		</div>\
		<input id="req_min" class="param" type="text" >\
		<input id="req_max" class="param" type="text" >\
		<input id="req_int" class="param" type="text" >\
		<input id="d_start" class="param" type="text" >\
		<input id="d_end" class="param" type="text" >\
		<audio id="el_audio" src="http://cs4-1v4.vk-cdn.net/p24/2d4e3036dc90d8.mp3" controls></audio>\
	</div>\
</div>';


function start(){

	var min = 1, max = 3;

	var rand = min - 0.5 + Math.random()*(max-min+1);
	rand = Math.round(rand);

	_fun.get_code("el_response", "el_audio");
	count_response++;
	$("#work_info").html(count_response);
	timer = setTimeout(start,rand*1000);

}



function stop(){

	window.let_try = false;
	window.check_img.lock();
	count_response = 0;
	$("#work_info").html(count_response);

}

function i_timer_set(){

	
	window.let_try = true;
	window.check_img = i_wrap();
	window.check_img.go();
	count_response++;
	$("#work_info").html(count_response);

}



function i_wrap(){

	return new _fun.check_img_code( parseInt($("#d_start").val()) || 2600 , 
									parseInt($("#d_end").val()) || 2900, 
									Math.random()*(parseInt($("#req_int").val()) || 100),
									function(arr){

										var 
											a = window.img_code,
											min = parseFloat($("#req_min").val()) || 4, 
											max = parseFloat($("#req_max").val()) || 8,
											rand;

										rand = min + Math.random()*(max-min);
										
										if( a.length >= 4 ) a.shift();

										if( arr.length ) a.push(arr);

										if( window.let_try ) timer_id = setTimeout(i_timer_set, rand*1E3);

									});

}

	window.img_code = [];
	window._fun = new add_fun;
	window.check_img;
	window.last_code = null;

	$(document.body).append(style_code);
	$(document.body).append(html_code);

	$("#el_post_code").bind('click', function(){_fun.post_code("el_enter_code","el_response")});
	$("#el_enter_code").keydown(function(e){ if(e.which == 13)_fun.post_code("el_enter_code","el_response"); });
	$("#el_enter_code").bind('keyup', function(){ $("#el_code_len").html($("#el_enter_code").val().length) });
	$("#el_btn_star").bind('click', i_timer_set);
	$("#el_btn_stop").bind('click', stop);
	$("#fix_toggle").bind('click', function(){ $("#fix_wrap").toggle() });

}

//out

var a = document.createElement("script"),
	b = document.createElement("script");

a.innerHTML = init_fun;
b.innerHTML = "init_fun();";

document.body.appendChild(a);
document.body.appendChild(b);