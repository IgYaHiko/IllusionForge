const generateForm = document.querySelector(".Generate-form");
const imageGalary = document.querySelector(".img-galary");

const OPENAI_API_KEY = "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";
let isImgGen = false;
const updateImageCard = (imgDataArray) => {
     imgDataArray.forEach((imgObject, index) => {
            const imgCard = imageGalary.querySelectorAll(".img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadImg = imgCard.querySelector(".down-btn");

            const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
            imgElement.src = aiGeneratedImg;

            imgElement.onload = () => {
                imgCard.classList.remove("loading");
                downloadImg.setAttribute("href",aiGeneratedImg);
                downloadImg.setAttribute("download",`${new Date().getTime()}.jpg`);
            }


     });
}

const generateAiImages = async (userPrompt,userImgQuantity) => {
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
             method: "POST",
             headers : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
             },
             body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
             })
      });

      if(!response.ok) throw new Error("failed to generate images! Please try again");
      
      const { data } = await response.json();
      updateImageCard([...data]);
      console.log(data);
    } catch (error) {
       alert(error.message);
    } finally {
        isImgGen = false;
    }
} 

const handleFormSubmisson = (e) => {
    e.preventDefault();
    if(isImgGen) return
    isImgGen = true;
    
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
       `<div class="img-card loading">
       <img src="loader.svg">
       <a href="#" class="down-btn">
           <img src="download.svg" alt="download-icon">
       </a>
   </div>`
    ).join("");

    imageGalary.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);
}


generateForm.addEventListener("submit", handleFormSubmisson);