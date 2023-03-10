const input = document.querySelector("input")
const output = document.querySelector(".mainBody")
let imagesArray = []
let displayProfile = false;
let displayLogout = false;
let choose = false;
let selectAll = false;
const loadData = async () =>{
  try{
    const res = await fetch(`/pictures/0`);
    const data = await res.json();
    if(!data.ok){
      throw Error(`Error fetching pictures`);
    }
    imagesArray = data.data;
    displayImages();
  }catch(err){
    console.error(err);
  }
  
}
loadData();
input.addEventListener("change", async () => {
  const file = input.files[0]
  
  let formData = new FormData();
  formData.append('photo', file);
  const res = await fetch(`/upload`,{
    method: 'POST',
    body: formData
  })
  imagesArray.push(file)
  displayImages()
})

function displayImages() {
  let images = ""
  console.log(imagesArray);
  imagesArray.forEach((image, index) => {
    if(typeof image == `object`){
      images += `<div class="image">
                  <img src="${URL.createObjectURL(image)}" alt="image">
                  <div class="select"></div>
                </div>`
    }else{
      images += `<div class="image">
                  <img src="/picture/${image}" alt="image">
                  <div class="select"></div>
                </div>`
    }
  })
  if(imagesArray.length > 0){
    document.querySelector(`.mainInput`).style.display = `none`;
  }
  else{
    document.querySelector(`.mainInput`).style.display = `block`;
  }
  output.innerHTML = images;
  document.querySelectorAll('.image').forEach((item, index) => {
    item.addEventListener('click', event => {
      if(choose){
        if(document.querySelectorAll('.select')[index].style.display == 'block'){
          document.querySelectorAll('.select')[index].style.display = 'none';
        }
        else{
          document.querySelectorAll('.select')[index].style.display = 'block';
        }
      }
    });
  });
}

document.querySelector(`#profile`).addEventListener(`click`, e =>{
  if(displayProfile){
    document.querySelector(`.profileInfo`).classList.remove("display");
  }
  else{
    document.querySelector(`.profileInfo`).classList.add("display");
  }
  displayProfile = !displayProfile;
})

document.querySelector(`#logout`).addEventListener(`click`, e =>{
  if(displayLogout){
    document.querySelector(`.logoutInfo`).classList.remove("display");
  }
  else{
    document.querySelector(`.logoutInfo`).classList.add("display");
  }
  displayLogout = !displayLogout;
})

document.querySelector(`#selectAll`).addEventListener(`click`, e =>{
  selectAll = !selectAll;
  if(selectAll){
    for(let i = 0; i < document.querySelectorAll(`.select`).length; i++){
      document.querySelectorAll(`.select`)[i].style.display = `block`;
    }
  }
  else{
    for(let i = 0; i < document.querySelectorAll(`.select`).length; i++){
      document.querySelectorAll(`.select`)[i].style.display = `none`;
    }
  }
  
})

document.querySelector(`#choose`).addEventListener(`click`, e =>{
  choose = !choose;
})

document.querySelector(`#delete`).addEventListener(`click`, async e =>{
  for(let i = 0; i < document.querySelectorAll(`.select`).length; i++){
    if(document.querySelectorAll(`.select`)[i].style.display == `block`){
      let error = [];
        if(typeof imagesArray[i] == `object`){
          try{
            const res = await fetch(`/picture/${imagesArray[i].name}`,{
              method: 'DELETE'
            })
            const data = await res.json();
            console.log(data.message);
          }catch(err){
            console.error(err);
            error.push(imagesArray[i]);
          }
        }else{
          try{
            const res = await fetch(`/picture/${imagesArray[i]}`,{
            method: 'DELETE'
          })
          const data = await res.json();
          console.log(data.message);
          }catch(err){
            console.error(err);
            error.push(imagesArray[i]);
          }
        }
      document.querySelectorAll(`.select`)[i].style.display = 'none';
    }
  }
  loadData();
});