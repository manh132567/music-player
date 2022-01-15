
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          name: "Mang tiền về cho mẹ",
          singer: "Đen Vâu",
          path: './assets/music/den.mp3',
          image: './assets/img/den.jpg'
        },
        {
          name: "Đi để trở về 6",
          singer: "Phan Mạnh Quỳnh",
          path: './assets/music/quynh.mp3',
          image: './assets/img/quynh.jpg'
        },
        {
            name: "Gieo quẻ",
            singer: "Hoàng Thùy Linh",
            path: './assets/music/gieoque.mp3',
            image: './assets/img/gieoque.jpg'
        },
        {
            name: "Deal With the Devil",
            singer: "Rory Webley",
            path: './assets/music/devil.mp3',
            image: './assets/img/devil.jpg'
        },
        {
            name: "Something Super Sweet",
            singer: "Rory Webley",
            path: './assets/music/super.mp3',
            image: './assets/img/super.jpg'
        },
        {
            name: "Stagestruck",
            singer: "Imnaku",
            path: './assets/music/stagestruck.mp3',
            image: './assets/img/imnaku.jpg'
        },
    
      ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}');"></div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            ` 
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        // sd trường hợp muốn gọi app mà nằm trong function con
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý xoay CD
        const cdThumbAnimate = cdthumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to, thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                // _this.isPlaying = false
                audio.pause()
                // player.classList.remove('playing')
            } else {
                // _this.isPlaying = true
                audio.play()
                // player.classList.add('playing')
            }
        }

        //Khi song play
        audio.onplay = function () {
            _this.isPlaying = true
            audio.play()
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Khi song pause
        audio.onpause = function () {
            _this.isPlaying = false
            audio.pause()
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lý  tua nhạc
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Xử lý khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý khi prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý bật tắt random bài hát
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

         // xử lý lặp bài hát-repeat
         repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }       

        //Xử lý next bài khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click() 
            }
        }

        // lắng nghe hành vi click vào danh sách bài hát -playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                
                //Xử lý click vào bài bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play(songNode)

                }
                
                //Xử lý khi click vào bài -> option
                if (e.target.closest('.option')) {

                }
            }
        }

    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',

            })
        }, 200)
    },

    // Xử lý hình CD
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    start: function () {
        //định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //lắng nghe và xử lý DOM event
        this.handleEvent()

        //tải thông tin bài hát đầu tiên vào giao diện khi chạy ứng dụng
        this.loadCurrentSong()

        //render playlist
        this.render()
    }   
}

app.start();

