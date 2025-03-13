const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};

const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

function removeActiveClass() {
  const activeButtons = document.getElementsByClassName("active");
  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
}

function loadCategories() {
  // 1-fetch then data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    // 2-convert json to data
    .then((res) => res.json())
    // 3-send data to display
    .then((data) => displayCategories(data.categories));
}

function loadVideos(searchText = "") {
  showLoader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((response) => response.json())
    .then((data) => displayVideos(data.videos));
}

const loadVideoDetails = (videoId) => {
  console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/aaac`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video));
};
//------------------------------------------
const displayVideoDetails = (video) => {
  console.log(video);
  document.getElementById("video_details").showModal();
  const detailsContainer = document.getElementById("details_container");
  detailsContainer.innerHTML = `
 <div class="card bg-base-100 image-full w-96 shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div class="card-actions justify-end">
      
    </div>
  </div>
</div>
  `;
};

const loadCategoryVideos = (id) => {
  showLoader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      removeActiveClass();
      const clickedButton = document.getElementById(`btn-${id}`);
      clickedButton.classList.add("active");
      console.log(clickedButton);
      displayVideos(data.category);
    });
};

function displayCategories(categories) {
  // get the container
  const categoryContainer = document.getElementById("category-container");
  // Loop operation on Array or object
  for (const cat of categories) {
    // console.log(cat);
    // create Element
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
        <button id="btn-${cat.category_id}" onclick ="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
    `;
    // Append the Element
    categoryContainer.append(categoryDiv);
  }
}

// {
//     "category_id": "1003",
//     "video_id": "aaaj",
//     "thumbnail": "https://i.ibb.co/xgWL3vQ/kid-gorgeous.jpg",
//     "title": "Kid Gorgeous",
//     "authors": [
//       {
//         "profile_picture": "https://i.ibb.co/xsfkwN2/john.jpg",
//         "profile_name": "John Mulaney",
//         "verified": true
//       }
//     ],
//     "others": {
//       "views": "241K",
//       "posted_date": ""
//     },
//     "description": "John Mulaney's 'Kid Gorgeous' has captured the hearts of many with 241K views. As a verified comedian, John delivers a masterclass in stand-up with clever anecdotes, quick wit, and relatable humor. This performance is a laugh-filled adventure through his unique take on life, politics, and pop culture."
//   }

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.innerHTML = `
    <div
        class="col-span-full flex flex-col justify-center items-center py-20"
      >
        <img class="w-[120px]" src="./assets/Icon.png" alt="" />
        <h2 class="text-2xl font-bold">
          Oops!! Sorry, There is no content here
        </h2>
      </div>
    `;
    hideLoader();
    return;
  }
  videos.forEach((video) => {
    // console.log(video);
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
      <div class="card bg-base-100">
        <figure class="relative">
          <img class ="w-full h-[150px] object-cover" src="${
            video.thumbnail
          }" />
          <span
            class="absolute bottom-2 right-2 text-white bg-black px-2 text-sm rounded"
            >3hrs 56 min ago</span
          >
        </figure>
        <div class="flex gap-3 px-0 py-5">
          <div class="profile">
            <div class="avatar">
              <div
                class="ring-primary ring-offset-base-100 w-7 rounded-full ring ring-offset-2"
              >
                <img
                  src="${video.authors[0].profile_picture}"
                />
              </div>
            </div>
          </div>
          <div class="intro">
            <h2 class="text-sm font-semibold">${video.title}</h2>
            <p class="text-sm text-gray-400 flex gap-1">
              ${video.authors[0].profile_name}
              ${
                video.authors[0].verified == true
                  ? `<img
                class="w-5 h-5"
                src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png"
                alt=""/>`
                  : ` `
              }
            </p>
            <p class="text-sm text-gray-400">${video.others.views}</p>
          </div>
        </div>
        <button onclick=loadVideoDetails("${
          video.video_id
        }") class="btn btn-block">Show Details</button>
      </div>
    `;
    videoContainer.append(videoCard);
  });
  hideLoader();
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  const input = e.target.value;
  loadVideos(input);
});
loadCategories();
