new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Lost",
          artist: "Maroon 5",
          cover: "img/24.jpg",
          source: "mp3/1.mp3",
          url: "https://www.youtube.com/watch?v=U05fwua9-D4",
          favorited: false
        },
        {
          name: "Boomerang",
          artist: "Imagine Dragons",
          cover: "img/25.jpg",
          source: "mp3/2.mp3",
          url: "https://www.youtube.com/watch?v=aE6uqYRwv48",
          favorited: true
        },
        {
          name: "Wait",
          artist: "Maroon 5",
          cover: "img/23.jpg",
          source: "mp3/3.mp3",
          url: "https://www.youtube.com/watch?v=4uTNVumfm84",
          favorited: true
        },
        {
          name: "Lalisa",
          artist: "LISA",
          cover: "img/27.jpg",
          source: "mp3/4.mp3",
          url: "https://www.youtube.com/watch?v=awkkyBH2zEo",
          favorited: false
        },
        {
          name: "Angel Baby",
          artist: "Troye Sivan",
          cover: "img/31.jpg",
          source: "mp3/5.mp3",
          url: "https://www.youtube.com/watch?v=IR-6KE8C4VQ",
          favorited: true
        },
        {
          name: "Could cry just thinking about you",
          artist: "Troye Sivan",
          cover: "img/30.jpg",
          source: "mp3/6.mp3",
          url: "https://www.youtube.com/watch?v=RwGoRzTRLyU",
          favorited: false
        },
        {
          name: "Lost Stars",
          artist: "Keira Knightley",
          cover: "img/26.jpg",
          source: "mp3/7.mp3",
          url: "https://www.youtube.com/watch?v=sLTRSakuugs",
          favorited: true
        },
        {
          name: "This is it",
          artist: "Oh The Larceny",
          cover: "img/29.jpg",
          source: "mp3/8.mp3",
          url: "https://www.youtube.com/watch?v=qmsaUQ7JQOo",
          favorited: false
        },
        {
          name: "Tokyo Drift",
          artist: "Teriyaki Boyz",
          cover: "img/28.jpg",
          source: "mp3/9.mp3",
          url: "https://www.youtube.com/watch?v=iuJDhFRDx9M",
          favorited: false
        },
        {
          name: "You",
          artist: "Troye Sivan",
          cover: "img/32.jpg",
          source: "mp3/10.mp3",
          url: "https://www.youtube.com/watch?v=on_IPWtYdc0",
          favorited: true
        },
        {
          name: "Take yourself home",
          artist: "Troye Sivan",
          cover: "img/33.jpg",
          source: "mp3/11.mp3",
          url: "https://www.youtube.com/watch?v=LniYWYmNXiM",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
