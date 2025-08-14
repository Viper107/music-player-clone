console.log("Initializing javascript....");
let currFolder;
async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${currFolder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                            <img class="invert" src="/img/music.svg" alt="music icon">
                            <div class="info">
                                <div> ${song.replace(
                                  "-128-ytshorts.savetube.me",
                                  ""
                                )} </div>
                                <div>Unkown</div>
                            </div>
                            <div class="playnow">

                                <span>Play Now</span>
                                <img src="/img/play.svg"  alt="">
                            </div>
                            
                        </li>`;
  }

  //Attach an event to the listner
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playsongs(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

let currentSong = new Audio();
let songs;
const playsongs = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/img/paused.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "";
};

function secondsToMinutesSeconds(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anschors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anschors)
  
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if(e.href.includes("/songs")){
        let folder =e.href.split('/').slice(-2)[0];
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
        let response = await a.json();
        cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card bradius"  data-folder="${folder}">
                        <div class="svg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50px" height="50px">
                                <circle cx="12" cy="12" r="10" fill="green"></circle>
                                <path
                                d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                fill="black"></path>
                            </svg>
                        </div>
                        

                        <img src="/songs/${folder}/cover.jpg" class="bradius">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                    </div>`


    }
    //Load the playlist
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playsongs(songs[0]);
    });
  });
  }
  
}

async function main() {
  songs = await getsongs("songs/SeedhaMaut");
  playsongs(songs[0], true);

  //Display albums
  displayAlbums();

  //Play, previous and paused
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/paused.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Event to handel seek in seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //hamburger event
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //close event
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Event for previous
  previoius.addEventListener("click", () => {
    console.log("Previoius clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index - 1 >= 0) {
      playsongs(songs[index - 1]);
    }
  });

  //Event for next
  next.addEventListener("click", () => {
    console.log("next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playsongs(songs[index + 1]);
    }
  });

  //Add Event listner for changing volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });


    //Add Event for mute
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
          }
          else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            currentSong.volume = 0.10;
        }
    })
  
}

main();
