// Custm Select
// new CustomSelect('select', {
//     listMaxHeight: 300,
// });

let duration = video.duration;
let time = 0;
// video.addEventListener('play', function() {
//     console.log(video.currentTime);
// });

let positionY = 0;
window.addEventListener('scroll', function (e) {  
	if (positionY < window.scrollY) {
		// scroll down
        time += 0.10;
        video.currentTime = time;
	} else {
		// scroll up
        time -= 0.10;
        video.currentTime = time;
  }
  positionY = window.scrollY;

  console.log(video.currentTime)
})
