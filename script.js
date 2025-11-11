console.log("Lets start JavaScript");

let currentSong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/Songs/");
  let response = await a.text();
  // console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as);
  let Songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      Songs.push(element.href.split("Songs")[1]);
    }
  }
  return Songs;
}
// getSongs();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, play = false) => {
  // let audio = new Audio("./Songs/" + track)
  // this is change by BlackAsh
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  currentSong.src = "./Songs/" + track;
  if (play) {
    currentSong.play();
    play.src = "pause.svg";
  }
};

async function main() {
  //Get the list of all the Songs
  let Songs = await getSongs();
  // this is change by BlackAsh
  playMusic(Songs[0].split("%5C")[1]);
  let SongUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of Songs) {
    SongUl.innerHTML =
      SongUl.innerHTML +
      `<li>
                            <div class="all1">
                                <img class="invert" src="music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%5C", " ")}</div>
                                    <div>Song Artist</div>
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`;
  }

  //Attach an eventListener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // this is change by BlackAsh
      playMusic(
        e.querySelector(".info").firstElementChild.innerHTML.trim(),
        true
      );
    });
  });

  //Attach an eventListener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    console.log(e);
  });

  //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    //Add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous clicked");
        // console.log(currentSong);
        let res = "%5C" + currentSong.src.split("/").slice(-1)[0];
        let index = Songs.indexOf(res);
        // console.log({ index, Songs });
        playMusic(Songs[index - 1], true)
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked");
        let res = "%5C" + currentSong.src.split("/").slice(-1)[0];
        let index = Songs.indexOf(res);
        // console.log({ index, Songs });
        if ((index + 1) < Songs.length) {
            playMusic(Songs[index + 1], true)
        }
        // console.log(Songs, index);
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to ", e.target.value, " / 100");
        currentSong.volume = parseInt(e.target.value)/100
    })

}

main();
