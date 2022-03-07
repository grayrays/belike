$(function(){
	var $gnbWrapper = $('.gnb-wrapper');
	var $mainMenu = $('.mainmenu');
	var $menuClone = $('.mainmenu-clone');
	var $menuBtn = $gnbWrapper.find('.bt-menu a');
	var $searchLayer = $('.layer-search');
	var checkMo = 750;
	
	/* menu copy and animate */
	var menuCopy = $mainMenu.find('ul').clone();
	$menuClone.html(menuCopy)

	mobileCheck();
	$(window).on('load resize scroll', function(){
		var scroll = $(this).scrollTop();
		var winWidth = $(window).outerWidth(true);
		mobileCheck();

		/* main navigation */
		if ($mainMenu.length) {
			if ( scroll >= $('.gnb').height() && !$gnbWrapper.hasClass('mo') ){
				$gnbWrapper.addClass('dv');
			} else {
				$gnbWrapper.removeClass('dv');
			}

			if (winWidth >= checkMo && !$gnbWrapper.hasClass('mo')){
				$menuBtn.removeClass('close');
				$mainMenu.removeClass('show');
				if (!$searchLayer.hasClass('show')) scrollAble();
			} else {
				if ($searchLayer.hasClass('show') && $mainMenu.hasClass('show')) scrollDisable();
			}
		}
		if ($menuClone.length){
			if ( scroll >= $('.gnb').height() && !$gnbWrapper.hasClass('mo') ){
				if ( scroll >= $('.container .hash-tag').position().top ) {
					$mainMenu.addClass('show');
				} else {
					$mainMenu.removeClass('show');
				}
			}
			if ( $gnbWrapper.hasClass('mo') && !$menuBtn.hasClass('close') ) {
				$mainMenu.removeClass('show');
			}
			if (winWidth >= checkMo){
				if ( scroll <= $('.container .hash-tag').position().top) {
					$mainMenu.removeClass('show');
				}
			}
		}

		goTop();
		//windowSize();
	});

	var $go = $('.go-top');
	$go.on('click', function(e){
		$('html, body').animate({ scrollTop:0 }, 600);
		e.preventDefault();
	});

	$menuBtn.bind('click', function(e){
		if ( $(this).hasClass('close') ) {
			$mainMenu.removeClass('show');
			$mainMenu.addClass('hide');
			scrollAble();
			setTimeout(function(){
				$mainMenu.removeClass('hide');
			}, 700);
		} else {
			scrollDisable();
			$mainMenu.addClass('show');
		}
		$(this).toggleClass('close');
		e.preventDefault();
	});

	$('.etc-menu .bt-search').click(function(e){
		searchAnimate();
		e.preventDefault();
	});
	$('.layer-search .close').click(function(e){
		searchAnimate();
		if ($gnbWrapper.hasClass('mo')) {
			$mainMenu.hasClass('show') ? scrollDisable() : scrollAble();
		} else {
			scrollAble();
		}
		e.preventDefault();
	});
	searchBoxReset();
	selectPolicy();
});

function mobileCheck(){
	var winWidth = $(window).outerWidth(true);
	var $gnbWrapper = $('.gnb-wrapper');
	var checkMo = 750;
	/* mobile check */
	if (winWidth <= checkMo){
		$gnbWrapper.addClass('mo');
	} else {
		$gnbWrapper.removeClass('mo');
	}
}
function selectPolicy(){
	var $select = $('.select-privacy');
	var folder = '/privacy';
	if ( $select.length ){
    var location = window.location.href;
    var urlPrev = location.split(folder)[0] + folder;
    var urlNext = location.split(folder)[1];
    var lastValue = $select.find('option:eq(0)').val();
    var checkDay = (urlNext.length) ? urlNext : lastValue;

		var optionLength = $select.find('option').length;
		if ( optionLength <= 1 ) $select.hide();

    $select.val(checkDay).prop('selected',true);

		$select.change(function(event){
			var eventValue = event.target.value;
			window.location = urlPrev + eventValue;
		});
	}
}
function goTop(){
	var $go = $('.go-top');
	var privacyFixWidth = 900;
	var windowScroll = $(window).scrollTop();
	var contentPadding = parseInt($('.container').css('padding-bottom'));
	var posEnd = $(document).height() - $(window).height() - ($('footer').height() + contentPadding);
	if ( $go.length ){
		var contentW = $('.privacy').width();
		var posShow = $('.privacy').position().top;
		var left = $(window).width() <= privacyFixWidth ? (contentW/2) - $go.width() : (contentW/2) + ($go.width()/2);
		$go.css({ 'margin-left' : left });

		if (windowScroll >= posShow) {
			$go.addClass('show');
			if (windowScroll >= posEnd) {
				$go.css({ 'position' : 'absolute', 'bottom' : '0' });
			} else {
				$go.css({ 'position' : 'fixed', 'bottom' : '4rem' });
			}
		} else {
			$go.removeClass('show');
		}
	}
}
function searchAnimate(){
	var $layer = $('.layer-search');
	if (!$layer.hasClass('show')){
		scrollDisable();
		$layer.addClass('show');
	} else {
		$layer.removeClass('show');
		$layer.addClass('hide');
		scrollAble();
		setTimeout(function(){
			$layer.removeClass('hide');
		}, 500);
	}
}
function searchBoxReset(){
	var $search = $('.search-box');
	$search.each(function(){
		var $this = $(this);
		var searchBox = $this.find('input[type="search"]');
		var reset = $this.find('.bt-reset');
		if ($this.length){
			//search-box의 검색 인풋 박스에 value 값을 체크해서 리셋 버튼 유무를 결정
			searchBox.val().length > 0 ? $this.addClass('show') : $this.removeClass('show');
			//글자 입력 시 리셋 버튼 나타나며, 삭제하여 검색어가 없을 경우 사라짐 
			searchBox.on('keypress keyup', function(){
				searchBox.val().length !== 0 ? $this.addClass('show') : $this.removeClass('show');
			});
			//리셋 버튼 클릭 시 검색 인풋 박스에 value 값이 있을 경우, value값을 삭제하고 리셋 버튼 사라짐
			//reset 타입의 input 버튼이 새로 입력된 값은 삭제해주나, 기존에 담고 있는 value 삭제는 되지 않아 value 삭제 추가함
			reset.on('click', function(){
				if (searchBox.val() !== 0) {
					searchBox.attr({ 'value' : ''});
					$this.removeClass('show');
				}
			});
		}
	});
}
function scrollDisable(){
	$('body').addClass('hidden');
	window.addEventListener('scroll touchmove mousewheel', function (event) { event.preventDefault (); }, {passive: false});
}
function scrollAble(){
	$('body').removeClass('hidden').off('scroll touchmove mousewheel');
}
function windowSize(){
	var winWidth = $(window).outerWidth();
	var checkText = '<div class="check-text" style="position:fixed; top:50px; right:50px; font-size:30px; z-index:100;" />';
	if (!$('.check-text').length) $('.bmlike-wrap').append(checkText);
	$('.check-text').html(winWidth);
}