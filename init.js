function init_fun(){


	function post_code(input_id, cnt_id){

		var
			_url = "/ajax/action2015/activate_code.php",
			val = $("#"+input_id).val(),
			post_data = {};

			val = val.toUpperCase();

		for( i = 1, s = 0; i <= 4; i++, s += 4){

			post_data["c"+i] = val.substr( s, 4);

		}

		console.log(post_data);

		$.ajax({

			type: "POST",
			data: post_data,
			url: _url,
			dataType: "json",
			success: function(data){

						$("#"+cnt_id).html(JSON.stringify(data));

			},
			error: function(xhr,status,errorThrown){

						$("#"+cnt_id).html(errorThrown);

			}

		});
	}


	var 
		cnt = $("#action2015_speed_result"),
		cnt_er = $("#action2015_question"),
		watch_speed,
		watch_er,
		code_place = '<input id="el_enter_code" type="text" maxlength=16>',
		code_len = '<div id="el_code_len"></div>',
		response = '<div id="el_response"></div>',
		alert_code = '<audio id="el_audio" src="http://cs4-4v4.vk-cdn.net/p20/638a721e9c465e.mp3" controls></audio>',
		audio_src = '<input id="el_audio_src" type="text">',
		apply_src = '<input id="el_apply_src" type="button" value="Применить">',
		style_code = '<style>\
\
	#el_response{\
\
		text-align: center;\
		background-color: #EAFBFF;\
		padding: 16px 0;\
		min-height: 20px;\
		margin: 10px 0;\
		font-size: 1.5em;\
		color: #649BA5;\
\
	}\
\
	#el_audio_src,\
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
	#el_apply_src{\
\
		width: 100px;\
		margin: 5px 0;\
\
	}\
\
	#el_audio{\
\
		width: 100%;\
		display:block;\
		margin:20px 0;\
		border: 1px solid;\
		background-color: #000;\
\
	}\
\
</style>';


	if(cnt.length){

		cnt.before(style_code);
		cnt.after(code_place+code_len+response+alert_code+audio_src+apply_src);
		watch_speed = new MutationObserver( function(m){ $("#el_audio")[0].play(); } );
		watch_speed.observe( cnt[0], { childList:true } );
		$("#el_enter_code").keydown(function(e){ if(e.which == 13) post_code("el_enter_code","el_response") });
		$("#el_enter_code").bind('keyup', function(){ $("#el_code_len").html($("#el_enter_code").val().length) });
		$("#el_apply_src").bind('click', function(){ $("#el_audio").attr("src", $("#el_audio_src").val() )  });

	}

	if(cnt_er.length){

		cnt_er.before(style_code);
		cnt_er.after(alert_code+audio_src+apply_src);
		cnt_er.append('<div></div>');
		watch_er = new MutationObserver( function(m){ 

			$("#el_audio")[0].play();
			watch_er.disconnect();
			cnt_er.append('<div></div>');
			watch_er.observe( cnt_er[0], { childList:true , characterData:true} );

		});
		watch_er.observe( cnt_er[0], { childList:true , characterData:true} );

	}

}

var a = document.createElement("script");

a.innerHTML = ';('+init_fun+')();';

document.body.appendChild(a);