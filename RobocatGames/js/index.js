var images = ['robocat1.png', 'robocat1.png', 'robocat2.png', 'robocat2.png', 'robocat3.png', 'robocat3.png', 'robocat4.png', 'robocat4.png', 'robocat5.png', 'robocat5.png', 'robocat6.png', 'robocat6.png', 'robocat7.png','robocat7.png', 'robocat8.png','robocat8.png'];
var opened = [];
var match = 0;
var moves = 0;
var clicks = 0;
var $deck = jQuery('.deck');
var $scorePanel = $('#score-panel');
var $moveNum = $('.moves');
var $ratingStars = $('i');
var $restart = $('.restart');
var timer;


	// Timer	
var gameTimer = () => {
	var startWaktu = new Date().getTime();

	// Memperbaharui waktu setiap detik 
	timer = setInterval(() => {

		var mulai = new Date().getTime();

		// menemukan waktu yg berlalu antara yg sekarang dan yang sudah dimulai 
		var waktuBerjalan = mulai - startWaktu;

		// menghitung atau mengkalkulasi menit dan detik dengan Math.Floor
		var minutes = Math.floor((waktuBerjalan % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((waktuBerjalan % (1000 * 60)) / 1000);

		// waktu dimulai 0 if seconds < 10
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		var currentTime = minutes + ':' + seconds;

		// Update waktu di tampilan permainan dan modul
		$(".clock").text(currentTime);
	}, 750);
};

// inisialisasi moves di bagian bintang (fa) ROBOCAT
var init = ()=> {
 var cards = shuffle(images);
  $deck.empty();
  match = 0;
  moves = 0;
  $moveNum.text('0');
  $ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><img src="image/' + cards[i] + '" /></li>'))
	}
	balikKartu();
	$(".clock").text("0:00");
	
};

//mengacak kartu
var shuffle = (array)=> {
  var index = array.length, temporaryValue, randomIndex;
  while (0 !== index) {
    randomIndex = Math.floor(Math.random() * index);
    index -= 1;
    temporaryValue = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Set rating bintang dan score 
var setRating =(moves)=> {
	var score = 3;
	if(moves <= 14) {
		$ratingStars.eq(3).removeClass('fa-star').addClass('fa-star-o');
		score = 3;
	} else if (moves > 14 && moves <= 18) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		score = 2;
	} else if (moves > 18) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		score = 1;
	}
	return { score };
};

// Mengakhiri Robocat Game
// Konfigurasi popup sweet alert 
var endGame = (langkah, score) => {
	var pesan = score == 1 ? score + ' Bintang' :score +' Bintang';
	swal({
		imageUrl: './image/win.png',
		imageHeight: 250,
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Selamat Kamu Berhasil',
		text: 'Dengan ' + langkah + ' Langkah dan ' + pesan ,
		confirmButtonColor: '#41ff51',
		confirmButtonText: 'Mainkan Lagi'
	}).then((isConfirm)=> {
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			init();
		}
	})
}

var balikKartu = ()=> {
	// Card click listner untuk membalik kartu
	$deck.find('.card:not(".match, .open")').bind('click' , function() {
		clicks++ ;
		clicks == 1 ? gameTimer() :'';
		// Memeriksa panggilan untuk menjadi berhasil sebelum semua pembaharuan dom
		if($('.show').length > 1) { return true; };
		var $this = $(this), card = $this.context.innerHTML;
		// Mengecek jika pemain meng click kartu yang sama
		if($this.hasClass('open')){ return true;};
	  $this.addClass('open show');
		opened.push(card);
		// Mengecek kartu yang di buka dengan animasi css 'rubberband'
		// Jika tidak match maka kartu yang di buka menggunakan animasi css 'wobble'
		// Menghapus kelas animasi css
	  if (opened.length > 1) {
	    if (card === opened[0]) {
	      $deck.find('.open').addClass('match animated infinite rubberBand');
	      setTimeout(()=> {
	        $deck.find('.match').removeClass('open show animated infinite rubberBand');
	      }, 800);
	      match++;
	    } else {
	      $deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(()=> {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, 800 / 1.5);
	      setTimeout(()=> {
	        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
	      }, 800);
	    }
	    opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
	  }
		
		// Mengakhiri permainan ROBOCAT jika semua kartu matched
		if (match === 8) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(()=> {
				endGame(moves, score);
			}, 500);
	  }	
	});
};

// Mengikat button klik ulang ROBOCAT
// Buka Popup untuk menampilkan detail yang dibutuhkan
// Pada konfiguarasi, tampilkan tampilan ke default
$restart.bind('click', ()=> {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Yakin Nih?',
    text: "Permainanmu Akan Dimulai Lagi Dari Awal!",
		imageUrl: './image/warning.png',
		imageHeight: 250,
    showCancelButton: true,
    confirmButtonColor: '#2e3d49',
    cancelButtonColor: '#f01f1f',
    confirmButtonText: 'Mulai Kembali!'
  }).then((isConfirm)=> {
    if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
      init();
    }
  })
});

// Inisialisasi ROBOCAT
init();